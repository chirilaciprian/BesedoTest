import {
  initialize,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../src/services/userService.js";

const users = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
  },
];

beforeEach(() => {
  initialize(users);
});

describe("getAllUsers", () => {
  test("returns all users", () => {
    expect(getAllUsers()).toEqual(users);
  });

  test("returns an empty array when there are no users", () => {
    initialize([]);

    expect(getAllUsers()).toEqual([]);
  });
});

describe("getUserById", () => {
  test("returns the user when it exists", () => {
    expect(getUserById(1)).toEqual(users[0]);
  });

  test("returns undefined when the user does not exist", () => {
    expect(getUserById(999)).toBeUndefined();
  });
});

describe("createUser", () => {
  test("creates a new user", () => {
    const data = {
      firstName: "Bob",
      lastName: "Smith",
      email: "bob@example.com",
    };

    const result = createUser(data);

    expect(result).toEqual({
      id: 3,
      ...data,
    });

    expect(getAllUsers()).toHaveLength(3);
  });

  test("creates a user with id 1 when there are no users", () => {
    initialize([]);

    const result = createUser({
      firstName: "Bob",
      lastName: "Smith",
      email: "bob@example.com",
    });

    expect(result.id).toBe(1);
  });
});

describe("updateUser", () => {
  test("updates an existing user", () => {
    const result = updateUser(1, {
      firstName: "Johnny",
    });

    expect(result).toEqual({
      id: 1,
      firstName: "Johnny",
      lastName: "Doe",
      email: "john@example.com",
    });
  });

  test("returns null when the user does not exist", () => {
    expect(
      updateUser(999, {
        firstName: "Nobody",
      }),
    ).toBeNull();
  });
});

describe("deleteUser", () => {
  test("deletes an existing user", () => {
    const result = deleteUser(1);

    expect(result).toEqual(users[0]);
    expect(getUserById(1)).toBeUndefined();
    expect(getAllUsers()).toHaveLength(1);
  });

  test("returns null when the user does not exist", () => {
    expect(deleteUser(999)).toBeNull();
    expect(getAllUsers()).toHaveLength(2);
  });
});
