import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import users from "../models/users.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstname, lastname } = req.body;
  try {
    const existingUser = await users.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password didn't match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await users.create({
      email,
      password: hashedPassword,
      name: `${firstname} ${lastname}`,
    });

    const token = await jwt.sign(
      { email: result.email, id: result._id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
