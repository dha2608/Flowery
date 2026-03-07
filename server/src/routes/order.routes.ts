import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Order, Shop, Product, Notification, User } from '../models/index.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middleware/error-handler.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { ROLES, ORDER_STATUS } from '../config/constants.js';
import { sendEmail } from '../utils/email.js';
import { orderConfirmationEmail, orderStatusEmail } from '../utils/email-templates.js';

export const orderRouter = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ─── Helpers ───────────────────────────────────────────────────────────────

const generateOrderNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BS-${dateStr}-${random}`;
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['delivering', 'cancelled'],
  delivering: ['delivered'],
  delivered: [],
  cancelled: [],
  refunded: [],
};

// ─── Schemas ───────────────────────────────────────────────────────────────

const createOrderSchema = z.object({
  shopId: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
        customizations: z
          .array(z.object({ name: z.string(), selected: z.string() }))
          .optional(),
      })
    )
    .min(1),
  deliveryAddress: z.object({
    recipientName: z.string().min(1),
    recipientPhone: z.string().regex(/^(\+84|0)(3|5|7|8|9)\d{8}$/, 'Invalid phone number'),
    street: z.string().min(1),
    ward: z.string().min(1),
    district: z.string().min(1),
    city: z.string().min(1),
    notes: z.string().optional(),
  }),
  deliveryDate: z.string().datetime(),
  deliveryTimeSlot: z.string().optional(),
  giftMessage: z.string().max(500).optional(),
  isAnonymous: z.boolean().default(false),
  paymentMethod: z.enum(['cod', 'vnpay', 'momo', 'zalopay', 'bank_transfer']),
});

const updateStatusSchema = z.object({
  // Cancel has its own endpoint — only forward transitions here
  status: z.enum(['confirmed', 'preparing', 'delivering', 'delivered']),
  note: z.string().max(500).optional(),
});

const cancelOrderSchema = z.object({
  reason: z.string().min(1).max(500),
});

const listOrdersQuerySchema = z.object({
  status: z
    .enum([
      'pending',
      'confirmed',
      'preparing',
      'delivering',
      'delivered',
      'cancelled',
      'refunded',
    ])
    .optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

// ─── POST / ─ Create order ────────────────────────────────────────────────
orderRouter.post(
  '/',
  requireAuth,
  validate(createOrderSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const {
      shopId,
      items,
      deliveryAddress,
      deliveryDate,
      deliveryTimeSlot,
      giftMessage,
      isAnonymous,
      paymentMethod,
    } = req.body;

    // Verify shop exists and is active
    const shop = await Shop.findById(shopId);
    if (!shop || !shop.isActive) throw new NotFoundError('Shop');

    // Fetch all products in one query; validate they belong to this shop and are available
    const requestedProductIds = items.map((i: any) => i.productId);
    const products = await Product.find({
      _id: { $in: requestedProductIds },
      shopId: shop._id,
      isAvailable: true,
    });

    if (products.length !== items.length) {
      throw new BadRequestError(
        'One or more products are unavailable or do not belong to this shop'
      );
    }

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    // Build order items and compute subtotals
    let orderSubtotal = 0;
    const orderItems = items.map((item: any) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = product.salePrice ?? product.price;

      let customizationExtra = 0;
      const mappedCustomizations: { name: string; selected: string; priceModifier: number }[] =
        [];

      if (item.customizations?.length) {
        for (const custom of item.customizations) {
          const option = product.customizationOptions.find((o) => o.name === custom.name);
          const choice = option?.options.find((o) => o.label === custom.selected);
          const priceModifier = choice?.priceModifier ?? 0;
          customizationExtra += priceModifier;
          mappedCustomizations.push({
            name: custom.name,
            selected: custom.selected,
            priceModifier,
          });
        }
      }

      const subtotal = (unitPrice + customizationExtra) * item.quantity;
      orderSubtotal += subtotal;

      return {
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice,
        customizations: mappedCustomizations,
        subtotal,
      };
    });

    // Delivery fee: waived when order meets the shop's minimum threshold
    const deliveryFee =
      orderSubtotal >= shop.deliveryConfig.freeDeliveryMinOrder
        ? 0
        : shop.deliveryConfig.baseFee;

    const discount = 0; // Coupon logic can extend this later
    const totalAmount = orderSubtotal + deliveryFee - discount;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId,
      shopId: shop._id,
      items: orderItems,
      pricing: { subtotal: orderSubtotal, deliveryFee, discount, totalAmount },
      status: ORDER_STATUS.PENDING,
      paymentStatus: 'pending',
      deliveryAddress,
      deliveryDate: new Date(deliveryDate),
      deliveryTimeSlot,
      giftMessage,
      isAnonymous,
      paymentMethod,
      statusHistory: [
        { status: ORDER_STATUS.PENDING, timestamp: new Date(), note: 'Order placed' },
      ],
    });

    // Notify the shop owner
    await Notification.create({
      userId: shop.ownerId,
      type: 'order_status',
      title: 'Đơn hàng mới',
      message: `Bạn có đơn hàng mới #${order.orderNumber}`,
      data: { orderId: order._id, shopId: shop._id },
      channels: ['in_app'],
    });

    // Send order confirmation email (fire-and-forget)
    const buyer = await User.findById(req.user!.userId).lean();
    if (buyer?.email) {
      sendEmail({
        to: buyer.email,
        subject: `Xác nhận đơn hàng #${order.orderNumber}`,
        html: orderConfirmationEmail(buyer.name, {
          orderNumber: order.orderNumber,
          items: order.items.map((i: any) => ({
            productName: i.productName,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
          pricing: order.pricing,
          deliveryDate: order.deliveryDate,
          deliveryAddress: order.deliveryAddress,
        }),
      }).catch((err) => console.error('[EMAIL] Order confirmation failed:', err));
    }

    res.status(201).json({ success: true, data: order });
  })
);

// ─── GET / ─ List orders ──────────────────────────────────────────────────
orderRouter.get(
  '/',
  requireAuth,
  validate(listOrdersQuerySchema, 'query'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, role } = req.user!;
    const { status, paymentStatus } = req.query as any;
    const pagination = getPagination(req);

    const filter: Record<string, any> = {};

    if (role === ROLES.SHOP_OWNER) {
      const shop = await Shop.findOne({ ownerId: userId });
      if (!shop) throw new NotFoundError('Shop');
      filter.shopId = shop._id;
    } else if (role === ROLES.USER) {
      filter.userId = userId;
    }
    // Admin: no scoped filter — sees all orders

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .select('-statusHistory'), // trimmed list payload
      Order.countDocuments(filter),
    ]);

    res.json(paginateResponse(orders, total, pagination));
  })
);

// ─── GET /:id ─ Get order detail ──────────────────────────────────────────
orderRouter.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, role } = req.user!;

    // Fetch without populate so we can compare raw ObjectIds
    const order = await Order.findById(req.params.id);
    if (!order) throw new NotFoundError('Order');

    if (role === ROLES.SHOP_OWNER) {
      const shop = await Shop.findOne({ ownerId: userId });
      if (!shop || order.shopId.toString() !== shop._id.toString()) {
        throw new ForbiddenError('Access denied');
      }
    } else if (role === ROLES.USER) {
      if (order.userId.toString() !== userId) throw new ForbiddenError('Access denied');
    }

    // Populate after ownership is confirmed
    await order.populate('items.productId', 'name images');
    await order.populate('shopId', 'name slug');

    res.json({ success: true, data: order });
  })
);

// ─── PUT /:id/status ─ Update order status (shop owner only) ─────────────
orderRouter.put(
  '/:id/status',
  requireAuth,
  requireRole(ROLES.SHOP_OWNER),
  validate(updateStatusSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { status, note } = req.body;

    const shop = await Shop.findOne({ ownerId: userId });
    if (!shop) throw new NotFoundError('Shop');

    const order = await Order.findById(req.params.id);
    if (!order) throw new NotFoundError('Order');

    if (order.shopId.toString() !== shop._id.toString()) {
      throw new ForbiddenError('Access denied');
    }

    const allowed = VALID_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(status)) {
      throw new BadRequestError(
        `Invalid status transition: '${order.status}' → '${status}'`
      );
    }

    order.status = status;
    (order.statusHistory as any[]).push({
      status,
      timestamp: new Date(),
      note,
      updatedBy: shop.ownerId,
    });

    await order.save();

    // Notify the customer
    await Notification.create({
      userId: order.userId,
      type: 'order_status',
      title: 'Cập nhật đơn hàng',
      message: `Đơn hàng #${order.orderNumber} đã cập nhật trạng thái: ${status}`,
      data: { orderId: order._id, shopId: shop._id },
      channels: ['in_app'],
    });

    // Send status update email (fire-and-forget)
    const buyer = await User.findById(order.userId).select('email name').lean();
    if (buyer?.email) {
      sendEmail({
        to: buyer.email,
        subject: `Cập nhật đơn hàng #${order.orderNumber}`,
        html: orderStatusEmail(buyer.name, order.orderNumber, status, note),
      }).catch((err) => console.error('[EMAIL] Status update email failed:', err));
    }

    res.json({ success: true, data: order });
  })
);

// ─── POST /:id/cancel ─ Cancel order ─────────────────────────────────────
orderRouter.post(
  '/:id/cancel',
  requireAuth,
  validate(cancelOrderSchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, role } = req.user!;
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) throw new NotFoundError('Order');

    const terminalStatuses = [
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.REFUNDED,
    ] as string[];

    if (role === ROLES.SHOP_OWNER) {
      const shop = await Shop.findOne({ ownerId: userId });
      if (!shop || order.shopId.toString() !== shop._id.toString()) {
        throw new ForbiddenError('Access denied');
      }

      if (terminalStatuses.includes(order.status)) {
        throw new BadRequestError(`Cannot cancel an order with status '${order.status}'`);
      }

      order.cancelledBy = 'shop';

      // Notify the customer
      await Notification.create({
        userId: order.userId,
        type: 'order_status',
        title: 'Đơn hàng bị hủy',
        message: `Đơn hàng #${order.orderNumber} đã bị hủy bởi cửa hàng`,
        data: { orderId: order._id, shopId: shop._id },
        channels: ['in_app'],
      });
    } else {
      // Regular user
      if (order.userId.toString() !== userId) throw new ForbiddenError('Access denied');

      const userCancellable = [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED] as string[];
      if (!userCancellable.includes(order.status)) {
        throw new BadRequestError(
          `You can only cancel orders that are 'pending' or 'confirmed'`
        );
      }

      order.cancelledBy = 'user';

      // Notify the shop owner
      const shop = await Shop.findById(order.shopId).select('ownerId name');
      if (shop) {
        await Notification.create({
          userId: shop.ownerId,
          type: 'order_status',
          title: 'Đơn hàng bị hủy',
          message: `Đơn hàng #${order.orderNumber} đã bị khách hàng hủy`,
          data: { orderId: order._id, shopId: shop._id },
          channels: ['in_app'],
        });
      }
    }

    order.status = ORDER_STATUS.CANCELLED;
    order.cancelReason = reason;
    (order.statusHistory as any[]).push({
      status: ORDER_STATUS.CANCELLED,
      timestamp: new Date(),
      note: reason,
    });

    await order.save();

    res.json({ success: true, data: order });
  })
);

// ─── GET /:id/tracking ─ Get order status history ─────────────────────────
orderRouter.get(
  '/:id/tracking',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, role } = req.user!;

    const order = await Order.findById(req.params.id).select(
      'orderNumber statusHistory userId shopId'
    );
    if (!order) throw new NotFoundError('Order');

    if (role === ROLES.SHOP_OWNER) {
      const shop = await Shop.findOne({ ownerId: userId });
      if (!shop || order.shopId.toString() !== shop._id.toString()) {
        throw new ForbiddenError('Access denied');
      }
    } else if (role === ROLES.USER) {
      if (order.userId.toString() !== userId) throw new ForbiddenError('Access denied');
    }

    res.json({ success: true, data: order.statusHistory });
  })
);
