import crypto from "crypto";
import sanitizeHtml from "sanitize-html";
import jwt from "jsonwebtoken";

export const isAuthenticated = (ctx) => {
  if (!ctx.state.user) {
    throw Error("Please LogIn");
  } else {
    return;
  }
};

export const secretGenerator = () =>
  crypto.randomBytes(3).toString("hex").toUpperCase();

import { countries, adjectives, animals, emojis } from "./words";

export const randomNickname = () => {
  const number1 = Math.floor(Math.random() * countries.length);
  const number2 = Math.floor(Math.random() * adjectives.length);
  const number3 = Math.floor(Math.random() * emojis.length);

  return `${adjectives[number2]} ${countries[number1]} ${emojis[number3]}`;
};

export const sanitizer = (body) => {
  const sanitizeOption = {
    allowedTags: [
      "h1",
      "h2",
      "b",
      "i",
      "u",
      "s",
      "p",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "iframe",
    ],
    allowedAttributs: {
      a: ["href", "name", "target"],
      li: ["class"],
      img: ["src", "id"],
      iframe: ["src", "style", "width", "height"],
    },
    allowedSchemes: ["data", "http"],
  };
  return sanitizeHtml(body, sanitizeOption);
};

export const cleaner = (body) => {
  const sanitizeOption = {
    allowedTags: [],
    allowedAttributs: {},
    allowedSchemes: [],
  };
  return sanitizeHtml(body, sanitizeOption);
};

export const isAdmin = (ctx) => {
  const role = ctx.state.user.role;
  if (!role) throw Error("Unauthorized");
  const isMarshal = role === "MARSHAL" || role === "ADMIN";
  if (!isMarshal) {
    throw Error("Unauthorized");
  } else {
    return true;
  }
};

export const dayRange = (wantDayNumber) => {
  const plusDay = wantDayNumber + 86400000;
  const wantDayISO = new Date(wantDayNumber).toISOString();
  const plusDayISO = new Date(plusDay).toISOString();
  return {
    wantDayISO,
    plusDayISO,
  };
};
