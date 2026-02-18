import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routers from "./routes";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI!;

const app = express();
app.use(express.json());
app.use("/api", routers);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
  });
