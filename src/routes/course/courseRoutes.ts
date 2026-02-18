import { RequestHandler, Router } from "express";
import courseService from "./courseService";
import { verifyToken } from "../../utils/auth";

const router = Router();

router.post("/", verifyToken(), courseService.createCourse as RequestHandler);
router.post(
  "/update-course/:id",
  verifyToken(),
  courseService.updateCourse as RequestHandler
);

router.get("/", courseService.getCourse as RequestHandler);

router.delete(
  "/:id",
  verifyToken(),
  courseService.deleteCourse as RequestHandler
);
export { router };
