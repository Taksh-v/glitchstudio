import { integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

// Orders placed through the GlitchStudio upload flow.
// No user accounts exist — the admin dashboard is gated by a hardcoded password,
// so there is no per-user scoping here.
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderCode: text("order_code").notNull().unique(),
  email: text("email").notNull(),
  packageId: text("package_id").notNull(),
  packageName: text("package_name").notNull(),
  price: integer("price").notNull(), // in cents
  vibe: text("vibe").notNull(),
  notes: text("notes"),
  photoUrls: jsonb("photo_urls").notNull().default([]).$type<string[]>(),
  // Payment tracking
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed, refunded
  paypalOrderId: text("paypal_order_id"),
  paypalTransactionId: text("paypal_transaction_id"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  // Fulfillment
  status: text("status").notNull().default("new"), // new, processing, completed
  downloadToken: text("download_token").unique(), // Token for accessing download link
  downloadExpiresAt: timestamp("download_expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Order = typeof orders.$inferSelect
