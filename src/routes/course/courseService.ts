import { Request, Response } from "express";
import userDao from "../../dao/userDao";
import courseDao from "../../dao/courseDao";
import { Course, User } from "../../../lib/models";
import { Status } from "../../../lib/enums";
class courseService {
  async createCourse(req: Request, res: Response) {
    try {
      const id = req.user;
      const { title, description } = req.body;
      const user = await userDao.findUserById(id);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "Invalid User" });

      const newCourse = {
        title,
        description,
        createdBy: id,
      };
      const createCourse = await courseDao.createCourse(newCourse);
      if (!createCourse)
        return res
          .status(403)
          .json({ success: false, message: "unable to create course" });

      return res.status(201).json({
        success: true,
        message: "course created sucessfully ",
        createCourse,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }
  async updateCourse(req: Request, res: Response) {
    try {
      const { title, description } = req.body;
      const cousrId = req.params.id;
      const id = req.user;

      const user = await User.findOne({ _id: id });
      const course = await Course.findOne({ _id: cousrId });

      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "Invalid user" });
      if (!course)
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      if (course?.createdBy != id)
        return res
          .status(401)
          .json({ success: false, message: "unathotrized Access" });

      const updateCourse = {
        $set: {
          title,
          description,
        },
      };

      const udpatedCourse = await Course.updateOne(
        { _id: cousrId },
        updateCourse
      );

      if (udpatedCourse.modifiedCount === 0)
        return res
          .status(401)
          .json({ success: false, message: "Unable to update course " });

      return res.status(200).json({
        success: true,
        message: "course updated successfuly!",
        udpatedCourse,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error });
    }
  }

  async getCourse(req: Request, res: Response) {
    try {
      const course = await Course.find().select("title description");
      if (!course)
        return res.status(404).json({ success: false, message: "Not Found" });
      return res
        .status(200)
        .json({ success: true, message: "Courses", course });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error });
    }
  }

  async deleteCourse(req: Request, res: Response) {
    try {
      const courseId = req.params.id;
      const id = req.user;

      const user = await User.findOne({ _id: id });
      const course = await Course.findOne({ _id: courseId });

      if (!course)
        return res
          .status(404)
          .json({ success: false, message: "course not found" });
      if (course.createdBy != id)
        return res
          .status(401)
          .json({ success: false, message: "unathotrizd access" });

      const deletedCourse = await Course.updateOne(
        { _id: courseId },
        { $set: { status: Status.ARCHIVED } }
      );

      if (deletedCourse.modifiedCount === 0)
        return res
          .status(400)
          .json({ success: false, message: "Unable to delete Course" });

      return res
        .status(200)
        .json({ success: false, message: "Course Deleted Successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: true, message: "Internal Server Error", error });
    }
  }
}
export default new courseService();
