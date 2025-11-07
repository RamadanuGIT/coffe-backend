import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userRouter from "./routes/UserRoute.js";
import menuRouter from "./routes/MenuRoute.js";
import cartRouter from "./routes/CartRoute.js";
import publicMenus from "./routes/PublicMenu.js";
import orderRouter from "./routes/OrderRoute.js";
import { config } from "dotenv";
import dotenv from "dotenv";

const app = express();

mongoose.connect("mongodb://localhost:27017/coffeeshop");
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("database running!!!"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
app.use("/api/menus", menuRouter);
app.use("/api/cart", cartRouter);
app.use("/api/public", publicMenus);
app.use("/api", orderRouter);

app.listen(process.env.PORT, () =>
  console.log("Server running in port: ", process.env.PORT)
);
