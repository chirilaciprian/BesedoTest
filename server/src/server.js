import app from "./app.js";
import { initialize } from "./services/userService.js";
import generateUsers from "./utils/seed.js";

initialize(generateUsers(200))

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
