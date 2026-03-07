# Flowery Deployment Guide

## Prerequisites

- Node.js >= 20.x
- MongoDB 6.x+
- Domain with SSL certificate
- (Optional) Firebase project for push notifications
- (Optional) Twilio account for SMS OTP
- (Optional) Cloudinary for image hosting

## Environment Variables

### Server (.env)

```env
# App
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-domain.com

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/flowery

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your-32-char-random-string
JWT_REFRESH_SECRET=your-32-char-random-string
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@your-domain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://api.your-domain.com/api/v1/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret
FACEBOOK_CALLBACK_URL=https://api.your-domain.com/api/v1/auth/facebook/callback

# Twilio (SMS OTP)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# Payment (VNPay)
VNPAY_TMN_CODE=your-terminal-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://your-domain.com/checkout/callback

# Payment (MoMo)
MOMO_PARTNER_CODE=your-partner-code
MOMO_ACCESS_KEY=your-access-key
MOMO_SECRET_KEY=your-secret-key

# Payment (ZaloPay)
ZALOPAY_APP_ID=your-app-id
ZALOPAY_KEY1=your-key1
ZALOPAY_KEY2=your-key2
```

### Client (.env.local)

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## Deployment Steps

### 1. Server Deployment (Railway/Render/VPS)

```bash
# Clone repository
git clone https://github.com/dha2608/Flowery.git
cd Flowery/server

# Install dependencies
npm ci --production

# Build TypeScript
npm run build

# Start server
npm start
```

**Railway:** Connect GitHub repo, set environment variables, deploy.

**Docker:**

```bash
docker build -t flowery-server .
docker run -p 3001:3001 --env-file .env flowery-server
```

### 2. Client Deployment (Vercel)

```bash
cd Flowery/client

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

**Vercel Settings:**

- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm ci`

### 3. Database Setup

```bash
# Connect to MongoDB and create indexes
mongosh "your-mongodb-uri"

# Run seed script (optional, for demo data)
cd server
npm run seed
```

### 4. DNS Configuration

| Record | Type  | Value                      |
| ------ | ----- | -------------------------- |
| @      | A     | Vercel IP                  |
| www    | CNAME | cname.vercel-dns.com       |
| api    | A     | Server IP / Railway domain |

### 5. SSL/TLS

- Vercel: Automatic SSL
- Railway: Automatic SSL
- Custom VPS: Use Let's Encrypt with Certbot

## Post-Deployment Checklist

- [ ] Verify CORS allows only production domain
- [ ] Test OAuth callbacks (Google, Facebook)
- [ ] Test email delivery (OTP, order confirmation)
- [ ] Test payment flow (sandbox first)
- [ ] Check rate limiting is working
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Configure database backups

## Monitoring

### Health Check Endpoints

- Server: `GET /api/v1/health`
- Client: `GET /api/health` (Next.js API route)

### Recommended Tools

- **Uptime:** UptimeRobot, Pingdom
- **APM:** Sentry, LogRocket
- **Analytics:** Google Analytics, Vercel Analytics

## Scaling

### Horizontal Scaling

- Server: Add more instances behind load balancer
- Database: MongoDB Atlas auto-scaling
- Client: Vercel Edge Network (automatic)

### Caching

- Redis for session/token storage (optional upgrade)
- CDN for static assets (Vercel/Cloudflare)
- MongoDB indexes for frequent queries

## Troubleshooting

### Common Issues

1. **CORS errors**: Check `CLIENT_URL` matches exactly
2. **OAuth redirect failed**: Verify callback URLs in provider console
3. **Email not sending**: Check SMTP credentials and spam folder
4. **WebSocket not connecting**: Ensure server supports WebSocket upgrade

### Logs

```bash
# Server logs (Railway)
railway logs

# Server logs (Docker)
docker logs flowery-server

# Client logs (Vercel)
vercel logs
```

## Support

- GitHub Issues: https://github.com/dha2608/Flowery/issues
- Email: support@flowery.vn
