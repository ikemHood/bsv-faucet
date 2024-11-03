import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial,
  json,
  boolean,
  varchar,
  decimal,
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const roleEnum = pgEnum('role', ['user', 'admin']);
export const themesEnum = pgEnum('theme', ['light', 'dark']);
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  theme: text('theme').default('light'),
  userId: text('user_id').unique().notNull(),
  role: roleEnum('role').notNull(),
});

export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(),
  status: statusEnum('status').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  availableAt: timestamp('available_at').notNull()
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      products: await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  let totalProducts = await db.select({ count: count() }).from(products);
  let moreProducts = await db.select().from(products).limit(5).offset(offset);
  let newOffset = moreProducts.length >= 5 ? offset + 5 : null;

  return {
    products: moreProducts,
    newOffset,
    totalProducts: totalProducts[0].count
  };
}

// Add treasury settings table
export const treasurySettings = pgTable('treasury_settings', {
  id: serial('id').primaryKey(),
  lowBalanceThreshold: decimal('low_balance_threshold', { precision: 16, scale: 8 }).notNull().default('10'),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Add treasury transactions table for history
export const treasuryTransactions = pgTable('treasury_transactions', {
  id: serial('id').primaryKey(),
  amount: decimal('amount', { precision: 16, scale: 8 }).notNull(),
  type: text('type').notNull(), // 'deposit' or 'withdrawal'
  description: text('description'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  balanceAfter: decimal('balance_after', { precision: 16, scale: 8 }).notNull()
});

// Export types
export type TreasurySettings = typeof treasurySettings.$inferSelect;
export type TreasuryTransaction = typeof treasuryTransactions.$inferSelect;


export async function deleteProductById(id: number) {
  await db.delete(products).where(eq(products.id, id));
}

export const transactions = pgTable('transactions', {
  txid: text('txid').primaryKey(),
  rawTx: text('rawTx').notNull(),
  beefTx: json('beefTx').notNull(),
  vout: json('vout').notNull(),
  txType: text('txType').notNull(),
  spentStatus: boolean('spentStatus').notNull().default(false),
  testnetFlag: boolean('testnetFlag').notNull(),
  amount: numeric('amount', { precision: 20, scale: 0 }).notNull(),
  fee: numeric('fee', { precision: 20, scale: 0 }),
});

export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),
  address: text('address').unique().notNull(),
  privateKey: text('privateKey').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  balance: numeric('balance', { precision: 20, scale: 0 }).notNull().default('0'),
});