import { SERVER_URL } from "./env.js";

class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error("Network error. Please check your connection.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body.message || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, body);
  }
  return res.json();
}


function getUsers() {
  return request(`${SERVER_URL}/users`);
}

function getUserById(id) {
  return request(`${SERVER_URL}/users/${id}`);
}

function createUser(data) {
  return request(`${SERVER_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

function updateUser(id, data) {
  return request(`${SERVER_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

function deleteUser(id) {
  return request(`${SERVER_URL}/users/${id}`, { method: "DELETE" });
}

export { getUsers, getUserById, createUser, updateUser, deleteUser };
