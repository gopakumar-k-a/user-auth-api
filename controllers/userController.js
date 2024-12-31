import { User } from "../models/User.js";
import { userValidator } from "../validators/userValidator.js";

export const userController = {
  async getAllUsers(req, res) {
    try {

      const users = User.findAll();
      res.json({users});
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

      if (User.findByEmail(userData.email)) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const newUser = User.create(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  },

  async getUserById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const user = User.findById(id);

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
      const id = parseInt(req.params.id);
      const updates = req.body;

      const errors = userValidator.validateUpdate(updates);
      if (errors.length) {
        return res.status(400).json({ errors });
      }

      if (updates.email) {
        const existingUser = User.findByEmail(updates.email);
        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ error: "Email already registered" });
        }
      }

      const updatedUser = User.update(id, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  },

  async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (!User.findById(id)) {
        return res.status(404).json({ error: "User not found" });
      }

      User.delete(id);

      res.status(200).send({message:`user with id:${id} deleted successfully`});
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  },
};
