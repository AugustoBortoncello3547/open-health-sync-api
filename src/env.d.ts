declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      API_VERSION: string;
      MONGODB_URL: string;
      MONGODB_USER: string;
      MONGODB_PASSWORD: string;
      SALT_PASSWORD_HASH: number;
    }
  }
}

export {};
