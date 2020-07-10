require("dotenv").config();

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const tokenGenerator = (id, nick, role) => {
  const token = jwt.sign(
    {
      id,
      nick,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "16h",
    }
  );
  return token;
};

export const hurdleGenerator = (time) => {
  const hurdle = jwt.sign(
    {
      lastLoggedIn: time,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return hurdle;
};
