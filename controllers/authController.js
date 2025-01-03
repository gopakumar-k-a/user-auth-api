import { authValidator } from "../validators/authValidator.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { pick } from "lodash-es";
import { tokenGenerator } from "../helpers/tokenGenerator.js";
import { tokenVerifier } from "../helpers/tokenVerifier.js";
import jwt from 'jsonwebtoken'
export const authController = {
  async registerUser(req, res) {
    try {
      console.log("body in register is ", req.body);

      const errors = authValidator.validateRegister(req.body);
      if (errors.length) {
        return res.status(400).json({ errors });
      }
      const { name, email, password, age } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        age,
      });

      const createdUser = pick(newUser.toObject(), ["name", "email"]);

      console.log("hashed password ", hashedPassword);
      console.log("newUser ", newUser);

      res
        .status(201)
        .json({ message: "User registered successfully", user: createdUser });
    } catch (error) {
      res.status(500).json({ error: "Failed to register" });
    }
  },

  async loginUser(req, res) {
    try {
      const errors = authValidator.validateLogin(req.body);
      console.log("login user ");

      if (errors.length) {
        return res.status(400).json({ errors });
      }

      const { email, password } = req.body;
      console.log("email and password ", email, " ", password);

      const user = await User.findOne({ email });
      console.log("user is ", user);

      if (!user) {
        return res.status(406).json({
          message: "Invalid credentials",
        });
      }
      const isMatch = bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(406).json({
          message: "Invalid credentials",
        });
      }
      // res.json({ message: "hi hello testing from login" });
      const accessToken = tokenGenerator.generateAccessToken(user._id);
      const refreshToken = tokenGenerator.generateRefreshToken(user._id);

      console.log("access token ", accessToken);
      console.log("refresh token ", refreshToken);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({ accessToken });
    } catch (error) {
      res.status(500).json({ error: "Failed to login" });
    }
  },

  async refreshToken(req,res) {
    try {
      console.log('inside refresh');
      console.log('req cookies ',req.cookies);
      
      if (req.cookies?.jwt) {
        console.log('inside if');
        
        const refreshToken = req.cookies.jwt;

        console.log('refreshtoken ',refreshToken);
        // const decoded = jwt.verify(req.cookies?.jwt,'i0sX1cE5AU9Q4XFri0Blv94CSqMtCmxx0qcd4glHgfLTtrCdjEB3JvUjJppi6Hou');
        // console.log('Decoded Token:', decoded);

        const verificationResult =
          tokenVerifier.verifyRefreshToken(refreshToken);
console.log('verificationResult ',verificationResult);

        if (!verificationResult.valid) {
          return res
            .status(406)
            .json({ message: "Unauthorized", error: verificationResult.error });
        }

        const accessToken = tokenGenerator.generateAccessToken({
          id: verificationResult.decoded.id,
        });

        return res.json({ accessToken });
      } else {
        return res.status(406).json({ message: "Unauthorized" });
      }
    } catch (error) {
      return res.status(406).json({ message: "Unauthorized catch" });
    }
  },
};
