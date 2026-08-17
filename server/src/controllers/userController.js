import * as userService from "../services/userService.js";
import { AppError } from "../utils/AppError.js";

function getAllUsers(req, res, next) {
  const users = userService.getAllUsers();
  res.status(200).json(users);
}

function getUserById(req, res, next) {
  const { id } = req.params;
  const user = userService.getUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.status(200).json(user);
}

function createUser(req, res, next) {
  const data = req.body;
  const user = userService.createUser(data);
  if (!user) {
    throw new AppError("Failed to create user", 400);
  }
  res.status(201).json(user);
}

function updateUser(req, res, next) {
  const { id } = req.params;
  const data = req.body;
  const user = userService.updateUser(id, data);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.status(200).json(user);
}

function deleteUser(req, res, next) {
  const { id } = req.params;
  const user = userService.deleteUser(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.status(200).json(user);
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
