import { hash } from "bcryptjs";
import { compare } from "bcryptjs";

export async function hashPassword(password) {
  const hashPwd = await hash(password, 12);
  return hashPwd;
}

export async function verifyPassword(password, hashedPassword) {
  const isValid = compare(password, hashedPassword);
  return isValid;
}
