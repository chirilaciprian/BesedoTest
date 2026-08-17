import generateUsers from "../utils/seed.js";

let users = generateUsers(200);

function getAllUsers() {
  return users;
}

function getUserById(id) {
  return users.find((u) => u.id === id);
}

function createUser(data) {
  const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser = { id: newId, ...data };
  users.push(newUser);
  return newUser;
}

function updateUser(id, data) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return false;
  }
  users[index] = { ...users[index], ...data };
  return users[index];
}

function deleteUser(id) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return null;
  }
  const user = users[index];
  users.splice(index, 1);
  return user;
}

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
