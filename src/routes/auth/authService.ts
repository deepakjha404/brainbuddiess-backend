import { Request, Response } from "express";
import { IUser } from "../../../lib/schemas";
import { User } from "../../../lib/models";
import userDao from "../../dao/userDao";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
class authService {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body as IUser;
      const existUser = await userDao.findUser(email);
      if (existUser)
        return res
          .status(403)
          .json({ success: false, messsage: "User alread found" });
      const hashedPassword = bcrypt.hash(password, 8);

      const user = await userDao.createUser({
        name,
        email,
        password: hashedPassword,
        role,
      });
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Unable to create user" });
      return res
        .status(400)
        .json({ success: true, message: "User creatd sucessfully", user });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { password, email } = req.body;
      const user = await userDao.findUser(email);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User Not found" });

      const comparePassword = bcrypt.compare(password, user.password);
      if (!comparePassword)
        return res
          .status(403)
          .json({ success: false, message: "Invalid Password" });

      const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "15m",
      });
      return res
        .status(200)
        .json({ success: false, message: "Successfully Logged", token });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error", error });
    }
  }
}
export default new authService();
