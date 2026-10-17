require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = 3000;

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to database:", error);
    }
}

startServer();