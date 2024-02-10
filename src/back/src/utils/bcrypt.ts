import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 13;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  storedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, storedPassword);
};
