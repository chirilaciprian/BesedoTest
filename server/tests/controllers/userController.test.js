import { jest } from "@jest/globals";

const mockUserService = {
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

jest.unstable_mockModule(
  "../../src/services/userService.js",
  () => mockUserService
);

const userController = await import(
  "../../src/controllers/userController.js"
);

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = userController;

describe("User Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    test("returns all users with status 200", () => {
      const users = [
        { id: 1, firstName: "John" },
        { id: 2, firstName: "Jane" },
      ];

      mockUserService.getAllUsers.mockReturnValue(users);

      getAllUsers(req, res, next);

      expect(mockUserService.getAllUsers).toHaveBeenCalledTimes(1);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe("getUserById", () => {
    test("returns the user with status 200", () => {
      req.params.id = "1";

      const user = {
        id: 1,
        firstName: "John",
      };

      mockUserService.getUserById.mockReturnValue(user);

      getUserById(req, res, next);

      expect(mockUserService.getUserById).toHaveBeenCalledWith("1");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    test("throws AppError with status 404 when user does not exist", () => {
      req.params.id = "999";

      mockUserService.getUserById.mockReturnValue(undefined);

      expect(() => {
        getUserById(req, res, next);
      }).toThrow("User not found");

      expect(mockUserService.getUserById).toHaveBeenCalledWith("999");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("createUser", () => {
    test("creates a user and returns status 201", () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };

      const user = {
        id: 1,
        ...data,
      };

      req.body = data;

      mockUserService.createUser.mockReturnValue(user);

      createUser(req, res, next);

      expect(mockUserService.createUser).toHaveBeenCalledWith(data);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    test("throws AppError with status 400 when user creation fails", () => {
      req.body = {
        firstName: "John",
      };

      mockUserService.createUser.mockReturnValue(null);

      expect(() => {
        createUser(req, res, next);
      }).toThrow("Failed to create user");

      expect(mockUserService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("updateUser", () => {
    test("updates a user and returns status 200", () => {
      req.params.id = "1";

      req.body = {
        firstName: "Johnny",
      };

      const updatedUser = {
        id: 1,
        firstName: "Johnny",
        lastName: "Doe",
      };

      mockUserService.updateUser.mockReturnValue(updatedUser);

      updateUser(req, res, next);

      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        "1",
        req.body
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    test("throws AppError with status 404 when user does not exist", () => {
      req.params.id = "999";
      req.body = {
        firstName: "Nobody",
      };

      mockUserService.updateUser.mockReturnValue(null);

      expect(() => {
        updateUser(req, res, next);
      }).toThrow("User not found");

      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        "999",
        req.body
      );

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("deleteUser", () => {
    test("deletes a user and returns status 200", () => {
      req.params.id = "1";

      const user = {
        id: 1,
        firstName: "John",
      };

      mockUserService.deleteUser.mockReturnValue(user);

      deleteUser(req, res, next);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith("1");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    test("throws AppError with status 404 when user does not exist", () => {
      req.params.id = "999";

      mockUserService.deleteUser.mockReturnValue(null);

      expect(() => {
        deleteUser(req, res, next);
      }).toThrow("User not found");

      expect(mockUserService.deleteUser).toHaveBeenCalledWith("999");

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});