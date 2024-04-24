import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
export type Salt = string | number;

if (require.main === module) {
  dotenv.config();

  const salt:Salt = 12;
  seed(salt).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function seed(bcryptSalt: Salt) {
  console.info("Seeding database...");

  const client = new PrismaClient();

  const userData = {
    fullName: "Admin",
    email: "test@test.com",
    hashedPassword: await hash("1234", bcryptSalt)
  };

  const newUser = await client.user.upsert({
    where: {
      email: userData.email,
    },

    update: {},
    create: userData,
  });


  console.info("Seeding database with Todos seed...");

  for(let i=0; i<10; i++){
    const todoData = {
      id: `3a34927a-8ba2-4ae4-a693-531c42bb032${i}`,
      title: `todo work ${i}`,
      completed: false,
      userId: newUser.id,
    }
    await client.todo.upsert({
      where: {
        id: todoData.id
      },
      update: {},
      create: todoData
    })
  
  
  }
  void client.$disconnect();

  console.info("Seeded database successfully");
}
