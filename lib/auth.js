import { hash } from "bcryptjs";

export async function hashPassword(password) {
  const hashPwd = await hash(password, 12);
  return hashPwd;
}
