import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function createHash(password) {
  const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(SALT_ROUNDS));
  return hashPassword;
}

export async function verifyPassword(password, hashPassword) {
  const isPasswordCorrect = await bcrypt.compare(password, hashPassword);
  return isPasswordCorrect;
}
