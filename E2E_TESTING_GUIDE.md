# GlitchStudio End-to-End Testing Guide

**Purpose:** Verify the entire system works perfectly with real users
**Duration:** 45-60 minutes per full test
**Frequency:** Before each deployment

---

## Test Environment Setup

### Prerequisites
- PayPal Sandbox account (free)
- Test email address (Gmail)
- Browser DevTools open for console errors
- Admin password ready

### Test Accounts
```
PayPal Sandbox Buyer:
Email: sb-xxxxx@personal.example.com
Password: (from PayPal dashboard)

GlitchStudio Admin:
Password: (from your .env file)
```

---

## Test Scenario 1: Happy Path (Basic Flow)

**Duration:** 10 minutes
**Success Criteria:** User gets file download link via email

### Steps:

1. **Start**
   - [ ] Open `http://localhost:3000` in fresh browser
   - [ ] Scroll to pricing section
   - [ ] Should see: "$10.00" "27.00" "$45.00"

2. **Select Package**
   - [ ] Click "Choose This" on Triptych ($27.00)
   - [ ] Should scroll to order form
   - [ ] Should show "STEP 1: CHOOSE A PACKAGE" with Triptych selected

3. **Upload Photos**
   - [ ] Click "STEP 2: UPLOAD YOUR PHOTOS"
   - [ ] Upload test image (JPG or PNG)
   - [ ] Wait for upload to complete
   - [ ] Should show "1/3" in title
   - [ ] Upload 2 more photos
   - [ ] Should show "3/3"

4. **Select Vibe**
   - [ ] Click on vibe option (e.g., "Datamosh")
   - [ ] Should be highlighted

5. **Enter Email**
   - [ ] Enter test email: `test-glitch-<timestamp>@gmail.com`
   - [ ] Should validate format

6. **Review Total**
   - [ ] Check total shows "$27.00" (NOT $2700)
   - [ ] ✓ CRITICAL: Price display fix verified

7. **Pay**
   - [ ] Click "Pay $27.00 with PayPal → Get Your Files"
   - [ ] PayPal modal opens
   - [ ] Select sandbox buyer account
   - [ ] Complete payment

8. **Success Page**
   - [ ] See "✓ PAYMENT CONFIRMED"
   - [ ] See order code (e.g., "GLX-ABC123")
   - [ ] See "ORDER RECEIVED" message

9. **Email Delivery**
   - [ ] Check email within 5 seconds
   - [ ] Should have download link
   - [ ] Link format: `/api/download?token=...`

10. **Download Files**
    - [ ] Click download link
    - [ ] Should download ZIP file
    - [ ] Open ZIP to verify contents

11. **Admin Dashboard**
    - [ ] Go to `/admin`
    - [ ] Enter admin password
    - [ ] Should see new order in list
    - [ ] Should show "$27.00" (NOT $2700)
    - [ ] Status should be "completed"

**✓ PASS** if all steps succeed

---

## Test Scenario 2: Browser Close Recovery (CRITICAL)

**Duration:** 5 minutes
**Success Criteria:** Webhook confirms payment even if user closes browser

### Steps:

1. **Start Fresh Flow**
   - [ ] Go to pricing page
   - [ ] Select Single Frame ($10.00)
   - [ ] Upload 1 photo
   - [ ] Enter email: `test-webhook-<timestamp>@gmail.com`

2. **Close on PayPal**
   - [ ] Click "Pay $10.00 with PayPal"
   - [ ] PayPal modal opens
   - [ ] Complete payment (select "Return to Merchant" but...)
   - [ ] **BEFORE clicking return**, close the PayPal tab entirely
   - [ ] Go back to GlitchStudio tab
   - [ ] You should see error or incomplete state

3. **Check Email**
   - [ ] Wait 10 seconds (webhook delay)
   - [ ] Check test email
   - [ ] **CRITICAL:** Should still receive download link
   - [ ] User paid but browser was closed = webhook saved the day!

4. **Admin Verification**
   - [ ] Go to `/admin`
   - [ ] Should see order with status "completed"
   - [ ] Payment status should be "completed"

**✓ PASS** if webhook delivers email despite browser close
**✗ FAIL** if user doesn't get email

---

## Test Scenario 3: Refund Flow

**Duration:** 10 minutes
**Success Criteria:** Admin can refund, customer gets money back

### Steps:

1. **Create Paid Order**
   - [ ] Complete a full payment (use Triptych $27)
   - [ ] Note the order code
   - [ ] Verify payment succeeded

2. **Go to Admin**
   - [ ] Enter `/admin`
   - [ ] Find the order you just paid
   - [ ] Should have "Refund" button

3. **Process Refund**
   - [ ] Click refund button
   - [ ] Confirm refund in modal
   - [ ] Should see success message

4. **Check Order Status**
   - [ ] Order status should change to "refunded"
   - [ ] Payment status should show "refunded"

5. **Check Email**
   - [ ] Customer should receive refund confirmation
   - [ ] Email says "3-5 business days"

6. **Verify PayPal**
   - [ ] Log into PayPal sandbox
   - [ ] Check transaction history
   - [ ] Should show refund initiated

**✓ PASS** if customer receives refund email
**✗ FAIL** if refund doesn't process

---

## Test Scenario 4: Repeat Customer Discount

**Duration:** 10 minutes
**Success Criteria:** 2nd order shows 10% discount

### Steps:

1. **First Order**
   - [ ] Complete first full order
   - [ ] Use email: `repeat-test@gmail.com`
   - [ ] Order value: $27.00

2. **Second Order - Same Email**
   - [ ] Go back to homepage
   - [ ] Select package
   - [ ] Upload photos
   - [ ] **Enter same email:** `repeat-test@gmail.com`
   - [ ] **SHOULD SEE:** Discount message (if implemented)
   - [ ] Price should be: $24.30 (10% off $27)

3. **Complete Second Order**
   - [ ] Pay $24.30
   - [ ] Should see success

4. **Admin Verification**
   - [ ] Check both orders in admin
   - [ ] Both should have same email
   - [ ] Prices should be $27.00 and $24.30

**✓ PASS** if 2nd order is discounted
**✓ PASS (Foundation)** if system setup allows it

---

## Test Scenario 5: Input Validation

**Duration:** 5 minutes
**Success Criteria:** Invalid inputs are rejected with clear messages

### Steps:

1. **Invalid Email**
   - [ ] Try email: `invalidemail`
   - [ ] Should show error: "Enter a valid email"

2. **Invalid Email (Spam)**
   - [ ] Try email: `test@test`
   - [ ] Should show error: "Enter a real email"

3. **Too Many Photos**
   - [ ] Select Single Frame (1 photo max)
   - [ ] Try to upload 3 photos
   - [ ] Should error: "Single Frame allows up to 1 photo"

4. **No Photos**
   - [ ] Enter email without uploading
   - [ ] Try to submit
   - [ ] Should error: "Upload at least one photo"

5. **Oversized Photo**
   - [ ] Try uploading file > 10MB
   - [ ] Should error: "File too large"

**✓ PASS** if all validations work

---

## Test Scenario 6: Error Handling

**Duration:** 5 minutes
**Success Criteria:** Errors show helpful messages, don't crash

### Steps:

1. **Payment Failure**
   - [ ] Try payment with declined card (if available)
   - [ ] Should show error with suggestion
   - [ ] Should NOT crash

2. **Network Timeout**
   - [ ] (Manual) Open DevTools Network tab
   - [ ] Throttle to Slow 3G
   - [ ] Try uploading large photo
   - [ ] Should show timeout error

3. **Missing Email**
   - [ ] Fill form but leave email blank
   - [ ] Click pay
   - [ ] Should error before PayPal

**✓ PASS** if errors are handled gracefully

---

## Test Scenario 7: Admin Dashboard

**Duration:** 5 minutes
**Success Criteria:** Admin can see all orders correctly

### Steps:

1. **Access Admin**
   - [ ] Go to `/admin`
   - [ ] Enter password
   - [ ] Should show orders list

2. **Order Details**
   - [ ] Click on recent order
   - [ ] Should show all details:
     - Order code
     - Customer email
     - Package name
     - **Price in dollars ($27.00, NOT $2700)**
     - Payment status
     - Files uploaded
     - Timestamps

3. **Statistics**
   - [ ] Should see total revenue
   - [ ] Should see order count
   - [ ] Should see package breakdown

4. **Refund Button**
   - [ ] Should have refund option for paid orders
   - [ ] Should have confirmation

**✓ PASS** if admin can see all data correctly

---

## Test Scenario 8: Download Link Expiry

**Duration:** 2 minutes + manual verification
**Success Criteria:** Links expire after 30 days

### Steps:

1. **Complete Order**
   - [ ] Pay for order and get download link

2. **Immediate Download**
   - [ ] Click link immediately
   - [ ] Should download successfully

3. **Expired Link Test**
   - [ ] Manually modify download token in URL
   - [ ] Add garbage character to token
   - [ ] Click modified link
   - [ ] Should error: "Link expired or invalid"

4. **Full Expiry Test** (requires DB access)
   - [ ] In DB, change downloadExpiresAt to past date
   - [ ] Try to use download link
   - [ ] Should error: "Link expired"

**✓ PASS** if expired links are rejected

---

## Test Scenario 9: Mobile Experience

**Duration:** 5 minutes
**Success Criteria:** Works on mobile devices

### Steps:

1. **Responsive Design**
   - [ ] Open on mobile (or DevTools mobile view)
   - [ ] All elements should be readable
   - [ ] No horizontal scroll

2. **Touch Interactions**
   - [ ] Buttons should be easily clickable
   - [ ] Form fields should be accessible
   - [ ] Upload should work

3. **Checkout Flow**
   - [ ] Complete full checkout on mobile
   - [ ] Should work smoothly
   - [ ] PayPal should open correctly

**✓ PASS** if mobile works seamlessly

---

## Test Scenario 10: Performance

**Duration:** 5 minutes
**Success Criteria:** Fast load times

### Steps:

1. **Page Load**
   - [ ] Open DevTools Performance tab
   - [ ] Refresh homepage
   - [ ] Should load in < 2.5 seconds

2. **Image Upload**
   - [ ] Upload image
   - [ ] Should complete in < 10 seconds
   - [ ] Check Network tab: file uploaded to Blob

3. **Payment Processing**
   - [ ] Click pay button
   - [ ] PayPal modal should open < 2 seconds
   - [ ] Order creation < 1 second

4. **Email Delivery**
   - [ ] After payment, email arrives in < 5 seconds

**✓ PASS** if all operations are fast

---

## Quick Test Checklist (5-minute smoke test)

Use this before every deployment:

```
[ ] Homepage loads
[ ] Pricing shows correct prices ($10, $27, $45)
[ ] Can select package
[ ] Can upload photo
[ ] Can enter email
[ ] Total shows correct price
[ ] PayPal button works
[ ] Payment flow completes
[ ] Success page shows
[ ] Email arrives with download link
[ ] Can download files
[ ] Admin dashboard shows order
[ ] Admin shows correct price
```

---

## Sign-Off Sheet

After completing all tests, sign off:

```
Test Date: _______________
Tester: _______________

All Tests Passed: [ ] YES [ ] NO

Issues Found: _________________________________
________________________________________________

Blocked By: [ ] None [ ] Payment [ ] Email [ ] Other: ________

Approved for Production: [ ] YES [ ] NO

Signed: _______________
```

---

## Troubleshooting

### PayPal not opening
- Check popup blockers
- Clear browser cache
- Try incognito mode

### Email not arriving
- Check spam folder
- Verify email address format
- Check Resend API key in env

### Can't upload photos
- Check file size < 10MB
- Verify file format (JPG/PNG)
- Clear browser storage

### Price shows wrong
- Hard refresh (Ctrl+Shift+R)
- Clear .next build
- Run `pnpm build` again

---

**This checklist ensures your users will have a flawless experience!**
