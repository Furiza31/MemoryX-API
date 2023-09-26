const { PrismaClient } = require('@prisma/client');

// singleton pattern
class PrismaClientSingleton {
    static instance = null;
  
    static getInstance() {
      if (PrismaClientSingleton.instance === null) {
        PrismaClientSingleton.instance = new PrismaClient();
      }
  
      return PrismaClientSingleton.instance;
    }
}

module.exports = {
    prisma: PrismaClientSingleton.getInstance()
}