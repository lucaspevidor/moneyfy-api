import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTransactionTypes() {
  await prisma.transactionType.deleteMany();

  const transactionTypeData = [
    {
      name: "Income",
    },
    {
      name: "Expense",
    },
  ];

  await prisma.transactionType.createMany({
    data: transactionTypeData,
  });
}

seedTransactionTypes()
  .then(() => console.log("Transaction types seeded!"))
  .catch((e) => console.error(e));
