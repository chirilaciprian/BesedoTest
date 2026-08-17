import app from "./app";
import { initialize } from "./services/userService";
import generateUsers from "./utils/seed";

initialize(generateUsers(200))

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
