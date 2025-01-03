import { User } from "../models/userModel.js";
import { userValidator } from "../validators/userValidator.js";

export const userController = {
  async getAllUsers(req, res) {
    try {
      console.log("insde user controller");

      const users = await User.find();
      console.log("users are ", users);

      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  async createUser(req, res) {
    try {
      const userData = req.body;

      const errors = userValidator.validateCreate(userData);
      if (errors.length) {
        return res.status(400).json({ errors });
      }
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      console.log("userData ", userData);

      const newUser = await User.create(userData);

      const newUserObj = newUser.toObject();
      delete newUserObj.createdAt;
      delete newUserObj.updatedAt;
      
      res.status(201).json({ newUser: newUserObj });
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  },

  async getUserById(req, res) {
    try {
      const id = req.params.id;
      console.log("id is ", id);

      const user = await User.findById(id).select("-createdAt -updatedAt -__v");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  },

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const updates = req.body;

      const errors = userValidator.validateUpdate(updates);
      if (errors.length) {
        return res.status(400).json({ errors });
      }

      if (updates.email) {
        const existingUser = await User.findOne({ email: updates.email });
        if (existingUser && existingUser._id !== id) {
          return res.status(400).json({ error: "Email already registered" });
        }
      }
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      Object.assign(user, updates);
      const updatedUser = await user.save();
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  },

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // User.delete(id);

      res
        .status(200)
        .send({ message: `user with id:${id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  },
};
