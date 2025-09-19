import express from "express";
import { menuPublic } from "../controllers/MenuController.js";

const router = express.Router();

router.get("/menu", menuPublic);

export default router;
