const User = require("../../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_KEY, JWT_EXP } = process.env;

module.exports = {
  createUser: async (args) => {
    const { firstName, lastName, email, password, role } = args.userInput;
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) throw new Error("User with that email already exists");
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User doesn't exist.");
    }
    console.log(user);
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
  },
};
