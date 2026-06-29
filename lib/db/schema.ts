import { pgTable, text, timestamp, boolean, integer, varchar } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- GlitchStudio App Tables -----------------------------------------------

// Free trial tracking - one free transform per user
export const freeTrial = pgTable('free_trial', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  used: boolean('used').notNull().default(false),
  usedAt: timestamp('usedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Orders - payment records
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderCode: varchar('orderCode', { length: 20 }).notNull().unique(),
  userId: text('userId'), // Nullable for legacy anonymous orders
  packageId: varchar('packageId', { length: 50 }).notNull(),
  price: integer('price').notNull(), // in cents
  email: varchar('email', { length: 255 }).notNull(),
  numPhotos: integer('numPhotos').notNull(),
  vibe: varchar('vibe', { length: 50 }).notNull(),
  paymentStatus: varchar('paymentStatus', { length: 20 }).notNull().default('pending'), // pending, completed, failed, refunded
  paypalTransactionId: text('paypalTransactionId'),
  downloadToken: text('downloadToken').unique(),
  downloadTokenExpiresAt: timestamp('downloadTokenExpiresAt'),
  downloadedAt: timestamp('downloadedAt'),
  refundReason: text('refundReason'),
  refundedAt: timestamp('refundedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Referral codes - for customer referral system
export const referralCodes = pgTable('referral_codes', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  discountPercent: integer('discountPercent').notNull().default(10),
  usageCount: integer('usageCount').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Referral tracking - who referred whom
export const referrals = pgTable('referrals', {
  id: text('id').primaryKey(),
  referrerId: text('referrerId').notNull(), // User who shared code
  referredUserId: text('referredUserId').notNull(), // User who used code
  orderId: text('orderId').notNull(), // Order where referral was used
  discountAmount: integer('discountAmount').notNull(), // in cents
  rewardAmount: integer('rewardAmount').notNull(), // in cents (what referrer gets)
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Customer email preferences
export const emailPreferences = pgTable('email_preferences', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  marketingEmails: boolean('marketingEmails').notNull().default(true),
  orderUpdates: boolean('orderUpdates').notNull().default(true),
  refundReminders: boolean('refundReminders').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Before/After gallery - sample glitch transforms for social proof
export const galleryImages = pgTable('gallery_images', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  beforeUrl: text('beforeUrl').notNull(), // URL to before image
  afterUrl: text('afterUrl').notNull(), // URL to after image
  vibe: varchar('vibe', { length: 50 }).notNull(),
  creatorName: varchar('creatorName', { length: 100 }),
  creatorHandle: varchar('creatorHandle', { length: 100 }),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Customer testimonials
export const testimonials = pgTable('testimonials', {
  id: text('id').primaryKey(),
  userId: text('userId'),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  testimonial: text('testimonial').notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  approved: boolean('approved').notNull().default(false),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// System events for tracking and monitoring
export const systemEvents = pgTable('system_events', {
  id: text('id').primaryKey(),
  eventType: varchar('eventType', { length: 50 }).notNull(), // payment_received, refund_processed, email_sent, etc.
  userId: text('userId'),
  orderId: text('orderId'),
  status: varchar('status', { length: 20 }).notNull().default('success'), // success, failed, pending
  message: text('message'),
  metadata: text('metadata'), // JSON
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
