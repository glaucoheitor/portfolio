import User from "../../models/user.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { JWT_KEY, JWT_EXP } = process.env;

export async function getUserId({ uid, name, authProvider, ...user }) {
  try {
    const existingUser = await User.findOne({ uid: uid });
    if (existingUser) return existingUser.id;
    const newUser = new User({ uid, name, authProvider, ...user });
    const result = await newUser.save();
    return result.id;
  } catch (err) {
    throw err;
  }
}

export async function createUser(args) {
  const { name, email, password, role } = args.userInput;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) throw new Error("User with that email already exists");
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const result = await user.save();
    return { ...result._doc, password: null };
  } catch (err) {
    throw err;
  }
}

export async function login({ email, password }) {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("User doesn't exist.");
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw new Error("Password is incorrect.");
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_KEY, {
    expiresIn: Number(JWT_EXP),
  });

  return {
    userId: user.id,
    token: token,
    tokenExpiration: Number(JWT_EXP),
  };
}

export async function verifyUser(args, req) {
  if (!req.isAuth) {
    return false;
  }
  return true;
}
