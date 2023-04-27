import bcrypt from "bcryptjs";
import { BadRequestError, UnauthorizedError } from "../utils/errors/index.js";
import dbClient from "../utils/prisma.js";
import isEmail from "validator/lib/isEmail.js";
import { UserRole } from "@prisma/client";
import { createCustomer } from "../payments/service.js";

export const signup = async ({
  name,
  email,
  password,
  receivePromotions,
  role,
  district,
}: {
  name: string;
  email: string;
  password: string;
  receivePromotions: boolean;
  role: UserRole;
  district?: string;
}) => {
  email = email.trim().toLowerCase();

  // Verify email and password requirements
  if (!isEmail.default(email)) {
    throw new BadRequestError("Invalid email");
  }

  // Check if user exists
  const existingUser = await dbClient.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  // Hash password
  const _password = await bcrypt.hash(password, 10);

  const newUser = await dbClient.user.create({
    data: {
      name,
      email,
      password: _password,
      receivePromotions,
      role,
      district,
    },
  });

  // TODO: Identify user with analytics platform
  await createCustomer(newUser.id);

  return newUser.id;
};

export const signin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  email = email.trim().toLowerCase();

  const user = await dbClient.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Verify password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new UnauthorizedError("Invalid email or password");
  }

  return user.id;
};
