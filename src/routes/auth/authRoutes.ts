import { RequestHandler, Router } from "express";
import authService from "./authService";
import { verifyToken } from "../../utils/auth";

const router = Router();

router.post("/register", authService.register as RequestHandler);


export { router };
