export const getBasicToken: (user: {
  username: string;
  password: string;
}) => string = (user) => {
  const token = Buffer.from(`${user.username}:${user.password}`).toString(
    "base64"
  );
  return `Basic ${token}`;
};
