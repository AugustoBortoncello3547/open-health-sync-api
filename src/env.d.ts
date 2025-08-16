declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGODB_URL: string;
      MONGODB_USER: string;
      MONGODB_PASSWORD: string;
    }
  }
}

export {};
