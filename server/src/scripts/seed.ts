import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  User,
  Flower,
  FlowerMeaning,
  Shop,
  Product,
  Relationship,
  Event,
  Order,
  Review,
  Subscription,
  Notification,
} from '../models/index.js';
import { connectDB } from '../config/database.js';
import { getUsersData } from './seed-data/users.js';
import { flowersData } from './seed-data/flowers.js';
import { getFlowerMeaningsData } from './seed-data/flower-meanings.js';
import { getShopsData } from './seed-data/shops.js';
import { getProductsData } from './seed-data/products.js';
import { getMiscData } from './seed-data/misc.js';

type IdMap = Record<string, mongoose.Types.ObjectId>;

const log = (icon: string, msg: string) => console.log(`  ${icon} ${msg}`);

async function seed() {
  await connectDB();
  console.log('\n🌱 Starting Flowery seed...\n');

  // Clear all collections
  const collections = [User, Flower, FlowerMeaning, Shop, Product, Relationship, Event, Order, Review, Subscription, Notification] as const;
  for (const model of collections) {
    await (model as mongoose.Model<unknown>).deleteMany({});
  }
  log('🗑️', 'Cleared all collections');

  // Hash passwords
  const [adminHash, shopHash, userHash] = await Promise.all([
    bcrypt.hash('Admin@123', 10),
    bcrypt.hash('Shop@123', 10),
    bcrypt.hash('User@123', 10),
  ]);

  // 1. Users
  const users = await User.insertMany(getUsersData(adminHash, shopHash, userHash));
  const userMap: IdMap = Object.fromEntries(users.map((u) => [u.email, u._id as mongoose.Types.ObjectId]));
  log('👥', `Users: ${users.length}`);

  // 2. Flowers
  const flowers = await Flower.insertMany(flowersData);
  const flowerMap: IdMap = Object.fromEntries(flowers.map((f) => [f.slug, f._id as mongoose.Types.ObjectId]));
  log('🌸', `Flowers: ${flowers.length}`);

  // 3. Flower Meanings
  const meanings = await FlowerMeaning.insertMany(getFlowerMeaningsData(flowerMap));
  log('💐', `Flower Meanings: ${meanings.length}`);

  // 4. Shops
  const shops = await Shop.insertMany(getShopsData(userMap));
  const shopMap: IdMap = Object.fromEntries(shops.map((s) => [s.slug, s._id as mongoose.Types.ObjectId]));
  log('🏪', `Shops: ${shops.length}`);

  // 5. Products
  const products = await Product.insertMany(getProductsData(shopMap, flowerMap));
  const productMap: Record<string, { _id: mongoose.Types.ObjectId; name: string; price: number; shopId: mongoose.Types.ObjectId }> =
    Object.fromEntries(
      products.map((p) => [
        p.slug,
        { _id: p._id as mongoose.Types.ObjectId, name: p.name, price: p.price, shopId: p.shopId as mongoose.Types.ObjectId },
      ]),
    );
  log('📦', `Products: ${products.length}`);

  // 6. Misc data (relationships, events, orders, reviews, subscriptions, notifications)
  const misc = getMiscData(userMap, shopMap, productMap, flowerMap);

  const relationships = await Relationship.insertMany(misc.relationships);
  log('❤️', `Relationships: ${relationships.length}`);

  const events = await Event.insertMany(misc.events);
  log('📅', `Events: ${events.length}`);

  const orders = await Order.insertMany(misc.orders);
  log('🛒', `Orders: ${orders.length}`);

  // Link reviews to order IDs (reviews[0] → order[0], reviews[1] → order[1], reviews[2] → order[2])
  for (let i = 0; i < misc.reviews.length; i++) {
    misc.reviews[i].orderId = orders[i]._id as mongoose.Types.ObjectId;
  }
  const reviews = await Review.insertMany(misc.reviews);
  log('⭐', `Reviews: ${reviews.length}`);

  const subscriptions = await Subscription.insertMany(misc.subscriptions);
  log('🔄', `Subscriptions: ${subscriptions.length}`);

  const notifications = await Notification.insertMany(misc.notifications);
  log('🔔', `Notifications: ${notifications.length}`);

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('🌸 Flowery seed completed successfully!');
  console.log('='.repeat(50));
  console.log('\n📊 Summary:');
  console.log(`  Users:          ${users.length}`);
  console.log(`  Flowers:        ${flowers.length}`);
  console.log(`  Flower Meanings: ${meanings.length}`);
  console.log(`  Shops:          ${shops.length}`);
  console.log(`  Products:       ${products.length}`);
  console.log(`  Relationships:  ${relationships.length}`);
  console.log(`  Events:         ${events.length}`);
  console.log(`  Orders:         ${orders.length}`);
  console.log(`  Reviews:        ${reviews.length}`);
  console.log(`  Subscriptions:  ${subscriptions.length}`);
  console.log(`  Notifications:  ${notifications.length}`);

  console.log('\n🔑 Test accounts:');
  console.log('  Admin:      admin@flowery.vn / Admin@123');
  console.log('  Shop Owner: shop1@flowery.vn / Shop@123');
  console.log('  Shop Owner: shop2@flowery.vn / Shop@123');
  console.log('  Shop Owner: shop3@flowery.vn / Shop@123');
  console.log('  Shop Owner: shop4@flowery.vn / Shop@123');
  console.log('  Customer:   minh@gmail.com / User@123');
  console.log('  Customer:   lan@gmail.com / User@123');
  console.log('  Customer:   huy@gmail.com / User@123\n');

  await mongoose.disconnect();
  log('🔌', 'Disconnected from MongoDB');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
