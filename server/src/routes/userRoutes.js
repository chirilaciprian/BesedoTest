import * as userController from "../controllers/userController.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  createUserSchema,
  updateUserSchema,
  idParamSchema,
} from "../schema/userSchema.js";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/api/users", userController.getAllUsers);

userRouter.get(
  "/api/users/:id",
  validate(idParamSchema, "params"),
  userController.getUserById,
);

userRouter.post(
  "/api/users",
  validate(createUserSchema),
  userController.createUser,
);

userRouter.put(
  "/api/users/:id",
  validate(idParamSchema, "params"),
  validate(updateUserSchema),
  userController.updateUser,
);

userRouter.delete(
  "/api/users/:id",
  validate(idParamSchema, "params"),
  userController.deleteUser,
);

export default userRouter;
