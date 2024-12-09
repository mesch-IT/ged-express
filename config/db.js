const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function checkDatabaseConnection() {
   
    try {
       
        await prisma.$connect();
        console.log("Database connection successful!");
    } catch (error) {
        console.log("unable to connect to database:", error);
    }


}

module.exports = {
    prisma,
    checkDatabaseConnection,
}