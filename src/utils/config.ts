import dotenv from "dotenv";

dotenv.config();

const getEnvVar = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const getConfig = () => ({
  PORT: process.env.PORT || 8888,
  PAYPAL_CLIENT_ID: getEnvVar("PAYPAL_CLIENT_ID"),
  PAYPAL_CLIENT_SECRET: getEnvVar("PAYPAL_CLIENT_SECRET"),
  NEXTCLOUD_USERNAME: getEnvVar("NEXTCLOUD_USERNAME"),
  NEXTCLOUD_PASSWORD: getEnvVar("NEXTCLOUD_PASSWORD"),
  NEXTCLOUD_URL: getEnvVar("NEXTCLOUD_URL"),
});
