import { Request, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser, IUserResponse } from "./interface";
import { User } from "../../models/user";

const route = Router();

route.post(
  "/sign-up",
  async (req: Request<{}, IUserResponse, IUser>, res, next) => {
    try {
      const existingUser = await User.find({ email: req.body.email });
      if (existingUser.length) {
        res.status(422).json({
          message: `User already exist for email id - ${req.body.email}`,
        });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      const user: IUser = {
        email: req.body.email,
        password: hashPassword,
      };
      const newUser = await User.create(user);
      delete newUser.password;

      res.status(201).json({
        message: "Created",
        data: newUser,
      });
    } catch (error) {
      console.error(error);
      // @ts-ignore
      res.status(error?.status || 400).json(error);
    }
  }
);

route.post(
  "/sign-in",
  async (
    req: Request<{}, { access_token?: string; message?: string }, IUser>,
    res,
    next
  ) => {
    try {
      const user = await User.find({ email: req.body.email });
      if (!user.length) {
        return res.status(401).json({
          message: "Authentication failed",
        });
      }
      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (!isPasswordMatch) {
        return res.status(401).json({
          message: "Invalid password",
        });
      }
      const payload = {
        email: user[0].email,
        userId: user[0]._id,
      };
      const token = jwt.sign(payload, String(process.env.JWT_SECRET), {
        expiresIn: "1h",
      });
      res.status(200).json({
        access_token: token,
      });
    } catch (error) {
      console.error(error);
      // @ts-ignore
      res.status(error?.status || 400).json(error);
    }
  }
);

export default route;
