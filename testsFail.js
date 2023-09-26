const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {

    // get the last ID of the user
    const userToDelete = await prisma.user.findFirst({
        orderBy: {
            id: 'desc'
        }
    });

    if (userToDelete !== null) {
      await prisma.user.delete({
          where: {
              id: userToDelete.id
          }
      });
    }
    console.log('Reset successfuly');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })