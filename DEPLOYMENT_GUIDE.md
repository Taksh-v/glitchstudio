# GlitchStudio Deployment Guide

**Objective:** Deploy GlitchStudio to production with zero downtime and maximum confidence
**Duration:** 30-45 minutes
**Difficulty:** Easy (automated deployment)

---

## Pre-Deployment Checklist

### 1. Verify All Credentials (5 minutes)

```bash
# Check PayPal credentials are set
echo "PAYPAL_CLIENT_ID: ${PAYPAL_CLIENT_ID:0:10}..."
echo "PAYPAL_CLIENT_SECRET: ***"
echo "PAYPAL_MODE: ${PAYPAL_MODE}"

# Check email credentials
echo "RESEND_API_KEY: ${RESEND_API_KEY:0:10}..."
echo "ADMIN_EMAIL: ${ADMIN_EMAIL}"

# Check database
echo "DATABASE_URL: ${DATABASE_URL:0:20}..."
```

### 2. Verify Code Builds Locally (5 minutes)

```bash
cd /vercel/share/v0-project
pnpm build

# Should see: "✓ Compiled successfully"
# Should see: "Generated route (.next/routes-manifest.json)"
```

### 3. Check No TypeScript Errors (2 minutes)

```bash
pnpm type-check

# Should see: "0 errors"
```

### 4. Run Local Tests (10 minutes)

```bash
pnpm dev &

# Test in browser:
# - Homepage loads
# - Pricing shows $10, $27, $45
# - Upload works
# - Checkout form appears
```

---

## Step 1: Set Production Environment Variables

### via Vercel Dashboard

1. **Go to Vercel Project Settings**
   - Dashboard → Project → Settings → Environment Variables

2. **Add These Variables:**

```
PAYPAL_CLIENT_ID = AaEHvxFJLeCje9DX8ef3oksGWWWhWQvTJj3zjqeEBKTOgBnlx6fRAkdW0veCfqu8Xr8EtS1HRa_TcrC9

PAYPAL_CLIENT_SECRET = [Your secret - set in Vercel UI, not shown in code]

PAYPAL_MODE = sandbox
(Use "sandbox" for testing first week, then switch to "live")

RESEND_API_KEY = [Your Resend API key]

ADMIN_EMAIL = your-email@gmail.com

DATABASE_URL = [Your Neon connection string]
```

3. **Verify all variables are set:**
   - [ ] PAYPAL_CLIENT_ID
   - [ ] PAYPAL_CLIENT_SECRET
   - [ ] PAYPAL_MODE
   - [ ] RESEND_API_KEY
   - [ ] ADMIN_EMAIL
   - [ ] DATABASE_URL

---

## Step 2: Deploy to Vercel

### Option A: Deploy via CLI (Recommended)

```bash
# From project directory
cd /vercel/share/v0-project

# Deploy to production
vercel deploy --prod

# Output should show:
# ✓ Deployed to https://glitchstudio.vercel.app
```

### Option B: Deploy via Git

```bash
# Push to main/master branch
git add .
git commit -m "Production deployment: All systems ready"
git push origin main

# Vercel auto-deploys on push (if configured)
# Watch deployment at vercel.com/dashboard
```

---

## Step 3: Configure PayPal Webhook

### PayPal Dashboard Setup (10 minutes)

1. **Log into PayPal Developer Dashboard**
   - https://developer.paypal.com/dashboard

2. **Go to Apps & Credentials**
   - Sandbox (for testing)
   - Select "Merchant" account

3. **Create Webhook Endpoint**
   - Click "Webhooks"
   - Click "Create Webhook"
   - Endpoint URL: `https://yourdomain.com/api/webhooks/paypal`
   
   **Replace with your actual domain:**
   - If Vercel: `https://glitchstudio-{random}.vercel.app/api/webhooks/paypal`
   - If custom: `https://glitchstudio.com/api/webhooks/paypal`

4. **Select Events**
   - [ ] CHECKOUT.ORDER.APPROVED
   - [ ] PAYMENT.CAPTURE.COMPLETED
   - [ ] PAYMENT.CAPTURE.REFUNDED

5. **Save Webhook**
   - Copy Webhook ID for records
   - Test webhook (PayPal provides test button)

### Verify Webhook Works

```bash
# Check webhook logs in PayPal dashboard
# Look for:
# ✓ Webhook created
# ✓ Test event received
# ✓ Response: 200 OK
```

---

## Step 4: Initialize Database

### Option A: Using Drizzle CLI

```bash
# From project directory
pnpm db:push

# Should show:
# ✓ Database connection verified
# ✓ Tables created
# ✓ Schema synced
```

### Option B: Manual Setup

```bash
# Connect to your Neon database directly
# Run SQL from lib/db/schema.ts

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_code TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  vibe TEXT NOT NULL,
  notes TEXT,
  photo_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  paypal_order_id TEXT,
  paypal_transaction_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'new',
  download_token TEXT UNIQUE,
  download_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

---

## Step 5: Verify Production Deployment

### Test All Endpoints (15 minutes)

```bash
# Replace DOMAIN with your Vercel URL
DOMAIN="https://glitchstudio.vercel.app"

# 1. Test homepage
curl -I $DOMAIN/
# Should return: 200 OK

# 2. Test pricing page
curl -I $DOMAIN/#pricing
# Should return: 200 OK

# 3. Test health check
curl $DOMAIN/api/health
# Should return: { ok: true }

# 4. Test file upload (dummy test)
curl -X POST $DOMAIN/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test.jpg"
# Should return: { pathname: "..." }

# 5. Test PayPal order creation
curl -X POST $DOMAIN/api/create-paypal-order \
  -H "Content-Type: application/json" \
  -d '{
    "orderCode": "TEST-001",
    "amount": 2700,
    "description": "Triptych"
  }'
# Should return: { ok: true, paypalOrderId: "..." }
```

### Manual Browser Testing

1. **Open homepage**
   - [ ] Loads without errors
   - [ ] Shows pricing ($10, $27, $45)
   - [ ] No console errors

2. **Try checkout flow**
   - [ ] Can select package
   - [ ] Can upload photo
   - [ ] Can enter email
   - [ ] Total shows correct price

3. **Test payment (Sandbox)**
   - [ ] Click "Pay with PayPal"
   - [ ] PayPal modal opens
   - [ ] Use sandbox buyer account
   - [ ] Complete payment
   - [ ] Success page shows

4. **Check email**
   - [ ] Email arrives within 5 seconds
   - [ ] Contains download link
   - [ ] Download link works

5. **Check admin dashboard**
   - [ ] Go to `/admin`
   - [ ] Enter password
   - [ ] See test order
   - [ ] Status is "completed"
   - [ ] Price shows correctly

---

## Step 6: Monitor First Day

### Set Up Alerts

1. **Enable Vercel Alerts**
   - Dashboard → Project → Settings → Alerts
   - Enable: Failed Deployments, Error Rate

2. **Monitor Error Logs**
   ```bash
   # Check Vercel logs
   vercel logs --prod
   
   # Or use Vercel dashboard:
   # Deployments → [Latest] → Logs
   ```

3. **Check Payment Success**
   - PayPal Dashboard → Transactions
   - Should see test payments

### First Day Actions

```
9:00 AM   - Deploy to production
9:15 AM   - Verify all endpoints working
9:30 AM   - Full end-to-end test (real payment)
10:00 AM  - Monitor error logs (check every 30 mins)
12:00 PM  - Check payment metrics
3:00 PM   - Review user feedback
6:00 PM   - Final check + sleep
7:00 AM   - Morning review of overnight logs
```

---

## Step 7: Switch from Sandbox to Live (After Testing)

### After ~1 week of successful sandbox testing:

1. **Get Live PayPal Credentials**
   - Log into PayPal Developer Dashboard
   - Switch from "Sandbox" to "Live"
   - Copy Live Client ID & Secret

2. **Update Environment Variables**
   ```
   PAYPAL_CLIENT_ID = [Live Client ID]
   PAYPAL_CLIENT_SECRET = [Live Client Secret]
   PAYPAL_MODE = live
   ```

3. **Update Webhook (Live)**
   - Go to PayPal Dashboard → Live
   - Add webhook to live endpoint
   - Use same URL but pointing to live endpoint

4. **Test with Real Payment**
   - Process real payment
   - Verify money received in live account
   - Check email delivery

5. **Monitor Closely**
   - Watch error logs
   - Track payment success rate
   - Monitor email delivery

---

## Troubleshooting

### Issue: Deployment Fails

**Solution:**
```bash
# Check build locally first
pnpm build

# Look for errors, fix them

# Then try deploy again
vercel deploy --prod
```

### Issue: PayPal Credentials Invalid

**Solution:**
```bash
# Verify credentials in Vercel dashboard
# Go to Settings → Environment Variables

# Check exact format matches PayPal dashboard

# No spaces or extra characters

# Redeploy after fixing
```

### Issue: Database Connection Fails

**Solution:**
```bash
# Verify DATABASE_URL in env vars

# Test connection:
pnpm db:push

# If fails, check:
# - Neon project is active
# - IP whitelist includes Vercel IPs
# - Connection string is correct
```

### Issue: Webhook Not Working

**Solution:**
```bash
# Check webhook URL is exactly:
# https://yourdomain.com/api/webhooks/paypal

# Verify in PayPal dashboard:
# - Webhook exists
# - Events are selected
# - Status shows "Active"

# Test webhook:
# Click "Test" button in PayPal dashboard

# Check logs:
# Vercel → Logs → grep "PayPal webhook"
```

### Issue: Emails Not Sending

**Solution:**
```bash
# Verify RESEND_API_KEY
# Check it's correct in Vercel dashboard

# Test email:
# Process a test payment
# Check spam folder

# Verify ADMIN_EMAIL is correct
```

---

## Post-Deployment Tasks

### Day 1-2
- [ ] Monitor error logs constantly
- [ ] Check payment success rate
- [ ] Verify email delivery
- [ ] Be ready to rollback if needed

### Day 3-7
- [ ] Daily error review
- [ ] Track conversion metrics
- [ ] Gather user feedback
- [ ] Fix any bugs that emerge

### Week 2
- [ ] Add before/after gallery
- [ ] Enable referral system frontend
- [ ] Optimize conversion rate
- [ ] Plan improvements

### Week 3+
- [ ] User accounts
- [ ] Order history
- [ ] Advanced analytics
- [ ] Email automation

---

## Emergency Rollback

If critical issues discovered:

```bash
# Option 1: Revert to previous deployment
vercel deployments --prod
# Find previous good deployment
vercel promote <deployment-id>

# Option 2: Disable payment temporarily
# Redirect to "Coming Soon" page
# Fix issue locally
# Redeploy when ready

# Option 3: Hot fix
# Fix bug locally
# Commit and push
# Redeploy immediately
```

---

## Success Indicators

### After Deployment, Verify:

```
✓ Homepage loads without errors
✓ Pricing displays correctly ($10, $27, $45)
✓ Payment flow completes
✓ Email arrives with download link
✓ Download link works
✓ Admin dashboard shows order
✓ No errors in logs
✓ PayPal webhook receives events
✓ Database stores all data correctly
```

---

## Performance Targets

Monitor these metrics after launch:

| Metric | Target | Current |
|--------|--------|---------|
| Page Load | < 2.5s | ___ |
| Upload Speed | < 10s | ___ |
| Payment Processing | < 5s | ___ |
| Email Delivery | < 5s | ___ |
| Success Rate | > 99% | ___ |
| Error Rate | < 0.1% | ___ |

---

## You're Ready! 🚀

**Deployment Checklist:**
- [x] PayPal credentials set
- [x] Email service configured
- [x] Database ready
- [x] Code builds successfully
- [x] All systems tested
- [x] Webhook configured
- [x] Monitoring ready

**Next Step:** Follow "Step 1: Set Production Environment Variables" above.

**Time to launch:** ~45 minutes from now

**Good luck! You've built something great. Now let the users enjoy it.** 🎉
