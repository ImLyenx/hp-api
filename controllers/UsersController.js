const PrismaClient = require("../config/prisma");
const { hashPassword } = require("../utils/bcrypt");
const { generateAccessToken } = require("../utils/jwt");

class UsersController {
  async index(req, res) {
    try {
      const users = await PrismaClient.user.findMany();
      res.json(users);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the users" });
    }
  }

  async store(req, res) {
    try {
      const body = req.body;
      const password = body.password;
      const hashedPassword = await hashPassword(password);
      const user = await PrismaClient.user.create({
        data: {
          ...body,
          password: hashedPassword,
          lastHouseVisited: "",
        },
      });
      const token = generateAccessToken(user.email, user.id);
      res.json({ token });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the user" });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await PrismaClient.user.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      res.json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.user;
      const user = await PrismaClient.user.update({
        where: {
          id: id,
        },
        data: req.user,
      });
      res.json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the user" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await PrismaClient.user.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the user" });
    }
  }
}

module.exports = new UsersController();
