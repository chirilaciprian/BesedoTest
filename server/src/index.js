import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRouter);

app.use(errorHandler)

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
