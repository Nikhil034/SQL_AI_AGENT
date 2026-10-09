
import { db } from "./db";
import { products, orders } from "./schema";


async function seed() {
  console.log("🌱 Starting database seed...");

  await db.transaction(async (tx) => {
    // Clear existing data in dependency order.
    // Use only in development; this deletes existing records.
    await tx.delete(orders);
    await tx.delete(products);

    // 1. Seed products
    await tx.insert(products).values([
      {
        id: "product-1",
        name: "MacBook Pro",
        description: "Apple laptop for developers",
        price: 150000,
        stock: 10,
      },
      {
        id: "product-2",
        name: "Mechanical Keyboard",
        description: "RGB mechanical keyboard",
        price: 5000,
        stock: 25,
      },
      {
        id: "product-3",
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse",
        price: 1500,
        stock: 50,
      },
    ]);

    // 2. Seed orders
    await tx.insert(orders).values([
      {
        id: "order-1",
        productId: "product-1",
        status: "pending",
        totalAmount: 156500,
        quantity: 1,
      },
      {
        id: "order-2",
        productId: "product-2",
        status: "completed",
        totalAmount: 8000,
        quantity: 1,
      },
    ]);

  });

  console.log("✅ Database seeded successfully!");
}

seed().catch((error) => {
  console.error("❌ Database seeding failed:", error);
  process.exitCode = 1;
});