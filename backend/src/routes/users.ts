import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password"); // exclude password from the response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// /api/users/register
router.post(
  "/register",
  [
    check("firstName", "First Name is Required").isString(),
    check("lastName", "Last Name is Required").isString(),
    check("email", "Email is Required").isEmail(),
    check(
      "password",
      "Password with 6 or more characters is required",
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({
          massage: "User already exists",
        });
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        {
          userId: user.id,
        },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        },
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).send({
        message: "User registered successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Something went wrong",
      });
    }
  },
);

export default router;
