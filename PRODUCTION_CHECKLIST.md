# GlitchStudio Production Deployment Checklist

## Environment Variables
- [ ] `DATABASE_URL` — Neon connection string (auto-provisioned by integration)
- [ ] `ADMIN_PASSWORD` — Hardcoded admin password for `/admin` (set a strong value, not "letmein")
- [ ] `RESEND_API_KEY` — Optional; for admin email notifications on new orders
- [ ] `ADMIN_EMAIL` — Optional; where order notifications go
- [ ] `NODE_ENV=production` — Automatically set by Vercel

## Security Hardening
- [ ] ADMIN_PASSWORD changed from default "letmein"
- [ ] CSP headers configured in `middleware.ts`
- [ ] Session cookies set to httpOnly and secure
- [ ] Rate limiting enabled on `/api/upload`
- [ ] File upload constraints enforced (10MB max, images only)
- [ ] Input validation on email, notes, package selections

## Testing
- [ ] ✅ Upload flow tested (valid images, file size rejection, type rejection)
- [ ] ✅ Order creation tested
- [ ] ✅ Admin dashboard login/logout
- [ ] ✅ Mobile responsive (tested at 375px, 768px, 1280px)
- [ ] E2E tests recommended before production

## Monitoring
- [ ] Health check endpoint: `GET /api/health`
- [ ] Error logging configured
- [ ] Sentry integration optional but recommended
- [ ] Database backups enabled in Neon console

## Performance
- [ ] Gallery images optimized with Next.js Image component
- [ ] Blob uploads use private storage (secure)
- [ ] File delivery route (`/api/file`) gated by admin session
- [ ] Static pages prerendered
- [ ] Consider CDN caching headers for gallery

## Deployment
- [ ] Push to GitHub main branch
- [ ] Vercel detects and deploys automatically
- [ ] Test at `https://<project>.vercel.app`
- [ ] Custom domain configured (if needed)
- [ ] DNS CNAME or alias pointing to Vercel

## Post-Launch
- [ ] Monitor `/api/health` for outages
- [ ] Review admin dashboard regularly for order status
- [ ] Backup Neon database weekly
- [ ] Update ADMIN_PASSWORD monthly

## Notes
- Simulated checkout; replace with real PayPal/Stripe when ready
- Order confirmation email requires RESEND_API_KEY
- Admin session timeout: 7 days (can be reduced in `lib/admin.ts`)
- File uploads expire after 1 year in Blob storage
