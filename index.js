// 3rd party modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// importing custom routes
import managerRoutes from "./routes/manager.js";
import authRoutes from "./routes/auth.js";

// express application
const app = express();
const PORT = 3000;

// loadin environment variables to process.env
dotenv.config();

// connect to DB
mongoose.connect(process.env.DB_URI, { dbName: process.env.DB_NAME });

// using 3rd party middleware
app.use(cors());
app.use(express.json());

// using my routes as middleware
app.use("/api/auth", authRoutes);
app.use("/api/manager", managerRoutes);

// route not found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found", statusCode: 404 });
});

// error middleware
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ message: "Internal server error", statusCode: 500 });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
