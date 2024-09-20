// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   const roles = [{ name: 'ADMIN' }, { name: 'USER' }];

//   for (const role of roles) {
//     await prisma.rol.upsert({
//       where: { name: role.name },
//       update: {},
//       create: { name: role.name },
//     });
//   }

//   console.log('Roles created or already exist');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: 'ADMIN', code: 'ADMIN' },
    { name: 'USER', code: 'USER' },
  ];

  for (const role of roles) {
    await prisma.rol.upsert({
      where: { code: role.code },
      update: {},
      create: { name: role.name, code: role.code },
    });
  }

  console.log('Roles created or already exist');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


