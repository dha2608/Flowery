import { Server as HttpServer, IncomingMessage } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;
}

interface WSClient {
  ws: WebSocket;
  userId?: string;
  subscriptions: Set<string>; // e.g., 'order:123', 'shop:456'
}

const clients = new Map<WebSocket, WSClient>();

let wss: WebSocketServer | null = null;

// ─── Initialize WebSocket Server ──────────────────────────────────────────────

export function initWebSocket(server: HttpServer) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, _req: IncomingMessage) => {
    const client: WSClient = { ws, subscriptions: new Set() };
    clients.set(ws, client);

    console.log(`WebSocket client connected. Total: ${clients.size}`);

    // Handle incoming messages
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        handleMessage(client, message);
      } catch {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      clients.delete(ws);
      console.log(`WebSocket client disconnected. Total: ${clients.size}`);
    });

    // Send welcome message
    ws.send(JSON.stringify({ type: 'connected', message: 'Welcome to Flowery real-time' }));
  });

  console.log('WebSocket server initialized on /ws');
}

// ─── Handle Incoming Messages ─────────────────────────────────────────────────

interface WSMessage {
  type: 'auth' | 'subscribe' | 'unsubscribe' | 'ping';
  token?: string;
  channel?: string;
}

function handleMessage(client: WSClient, message: WSMessage) {
  switch (message.type) {
    case 'auth':
      handleAuth(client, message.token);
      break;
    case 'subscribe':
      handleSubscribe(client, message.channel);
      break;
    case 'unsubscribe':
      handleUnsubscribe(client, message.channel);
      break;
    case 'ping':
      client.ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;
  }
}

function handleAuth(client: WSClient, token?: string) {
  if (!token) {
    client.ws.send(JSON.stringify({ type: 'auth_error', message: 'Token required' }));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    client.userId = payload.userId;
    client.ws.send(JSON.stringify({ type: 'auth_success', userId: payload.userId }));
  } catch {
    client.ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }));
  }
}

function handleSubscribe(client: WSClient, channel?: string) {
  if (!channel) return;

  // Validate channel access (e.g., user can only subscribe to their own orders)
  const [type, _id] = channel.split(':');

  if (type === 'order' && client.userId) {
    // Allow subscription (we'd validate ownership in production)
    client.subscriptions.add(channel);
    client.ws.send(JSON.stringify({ type: 'subscribed', channel }));
  } else if (type === 'shop') {
    // Shop owners can subscribe to their shop's updates
    client.subscriptions.add(channel);
    client.ws.send(JSON.stringify({ type: 'subscribed', channel }));
  }
}

function handleUnsubscribe(client: WSClient, channel?: string) {
  if (!channel) return;
  client.subscriptions.delete(channel);
  client.ws.send(JSON.stringify({ type: 'unsubscribed', channel }));
}

// ─── Broadcast Functions ──────────────────────────────────────────────────────

export function broadcastToChannel(channel: string, event: string, data: unknown) {
  const message = JSON.stringify({ type: 'event', event, channel, data, timestamp: Date.now() });

  clients.forEach((client) => {
    if (client.subscriptions.has(channel) && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

export function broadcastToUser(userId: string, event: string, data: unknown) {
  const message = JSON.stringify({ type: 'event', event, data, timestamp: Date.now() });

  clients.forEach((client) => {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

export function broadcastToAll(event: string, data: unknown) {
  const message = JSON.stringify({ type: 'event', event, data, timestamp: Date.now() });

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

// ─── Order-specific Events ────────────────────────────────────────────────────

export const OrderEvents = {
  statusChanged: (orderId: string, status: string, previousStatus: string) => {
    broadcastToChannel(`order:${orderId}`, 'order:status_changed', {
      orderId,
      status,
      previousStatus,
      updatedAt: new Date().toISOString(),
    });
  },

  locationUpdated: (orderId: string, lat: number, lng: number, eta?: string) => {
    broadcastToChannel(`order:${orderId}`, 'order:location_updated', {
      orderId,
      location: { lat, lng },
      eta,
      updatedAt: new Date().toISOString(),
    });
  },

  delivered: (orderId: string) => {
    broadcastToChannel(`order:${orderId}`, 'order:delivered', {
      orderId,
      deliveredAt: new Date().toISOString(),
    });
  },
};

// ─── Shop-specific Events ─────────────────────────────────────────────────────

export const ShopEvents = {
  newOrder: (shopId: string, orderId: string, orderSummary: unknown) => {
    broadcastToChannel(`shop:${shopId}`, 'shop:new_order', {
      shopId,
      orderId,
      summary: orderSummary,
      createdAt: new Date().toISOString(),
    });
  },

  orderCancelled: (shopId: string, orderId: string, reason?: string) => {
    broadcastToChannel(`shop:${shopId}`, 'shop:order_cancelled', {
      shopId,
      orderId,
      reason,
      cancelledAt: new Date().toISOString(),
    });
  },
};
