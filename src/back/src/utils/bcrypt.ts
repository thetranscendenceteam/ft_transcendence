const bcrypt = require('bcrypt');


export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 13;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  storedPassword: string | null,
): Promise<boolean> => {
  if (!storedPassword) return false;
  return bcrypt.compare(password, storedPassword);
};
