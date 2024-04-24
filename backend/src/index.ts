import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myHotelRoutes from "./routes/my-hotels";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose
  .connect(process.env.MOGODB_CONNECTION_STRING as string)
  .then(() =>
    console.log("Connected to MongoDB", process.env.MOGODB_CONNECTION_STRING),
  );

const app = express(); // Create an Express application
app.use(cookieParser()); // it helps to parse the cookie data
app.use(express.json()); // it heslps convert the body of api request to json automatically
app.use(express.urlencoded({ extended: true })); // it helps to parse the url encoded data
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
); // it will allow all the request from all the origins to access the api server but we can restrict it to only specific origins

app.use(express.static(path.join(__dirname, "../../frontend/dist"))); // it will serve the static files from the dist folder of the frontend

app.use("/api/auth", authRoutes); // it will use the authRoutes for the /api/auth path
app.use("/api/users", userRoutes); // it will use the userRoutes for the /api/users path
app.use("/api/my-hotels", myHotelRoutes); // it will use the myHotelsRoutes for the /api/my-hotels path

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
}); // it will send the index.html file for all the other routes

app.listen(7000, () => {
  console.log("Server is running on localhost:7000");
});
