import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import path from "path";

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

app.listen(7000, () => {
  console.log("Server is running on localhost:7000");
});
