declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      API_VERSION: string;
      MONGODB_URL: string;
      MONGODB_USER: string;
      MONGODB_PASSWORD: string;
      SALT_PASSWORD_HASH: number;
      JWT_SECRET: string;
      JWT_EXPIRE_TIME: number;
      MONGOOSE_ENCRYPT_ENC_KEY: string;
      ID_APLICACAO_ADMIN: string;
    }
  }
}

export {};
