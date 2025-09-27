import jwt from "jsonwebtoken";
import { afterAll, beforeAll, describe, vi, expect, test } from "vitest";
import { JwtTokenController } from "../../../controllers/token/jwt-token-controller.js";
import type { TJwtProps } from "../../../controllers/token/types.js";
import { RoleApiEnum } from "../../../enums/role-api-enum.js";

describe("JwtTokenController", () => {
  const jwtController = new JwtTokenController();
  const mockSecret = "my-secret";

  const validPayload: TJwtProps = {
    idAplicacao: "app-123",
    email: "user@example.com",
    role: RoleApiEnum.ADMIN,
  };

  let validToken: string;

  beforeAll(() => {
    process.env.JWT_SECRET = mockSecret;
    validToken = jwt.sign(validPayload, mockSecret);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  // getTokenFromAuthorizationHeader
  describe("getTokenFromAuthorizationHeader", () => {
    test("deve extrair scheme e token de um header válido", () => {
      const result = jwtController.getTokenFromAuthorizationHeader("Bearer token123");
      expect(result).toEqual({ scheme: "Bearer", token: "token123" });
    });

    test("deve retornar scheme e token vazios se o header for string vazia", () => {
      const result = jwtController.getTokenFromAuthorizationHeader("");
      expect(result).toEqual({ scheme: "", token: "" });
    });

    test("deve lidar com header undefined", () => {
      const result = jwtController.getTokenFromAuthorizationHeader(undefined);
      expect(result).toEqual({ scheme: "", token: "" });
    });

    test("deve lidar com header sem token", () => {
      const result = jwtController.getTokenFromAuthorizationHeader("Bearer");
      expect(result).toEqual({ scheme: "Bearer", token: "" });
    });
  });

  // extractDatafromToken
  describe("extractDatafromToken", () => {
    test("deve retornar payload válido para token válido", async () => {
      const result = await jwtController.extractDatafromToken(validToken);
      expect(result).toMatchObject(validPayload);
    });

    test("deve retornar objeto vazio para token inválido", async () => {
      const result = await jwtController.extractDatafromToken("invalid.token.here");
      expect(result).toMatchObject({ idAplicacao: "", email: "", role: "" });
    });
  });

  // getTokenData
  describe("getTokenData", () => {
    test("deve extrair dados do token a partir de um header válido", async () => {
      const authHeader = `Bearer ${validToken}`;
      const result = await jwtController.getTokenData(authHeader);
      expect(result).toMatchObject(validPayload);
    });

    test("deve retornar objeto vazio se token do header for inválido", async () => {
      const authHeader = "Bearer invalid.token";
      const result = await jwtController.getTokenData(authHeader);
      expect(result).toMatchObject({ idAplicacao: "", email: "", role: "" });
    });

    test("deve retornar objeto vazio se header não for fornecido", async () => {
      const result = await jwtController.getTokenData(undefined);
      expect(result).toMatchObject({ idAplicacao: "", email: "", role: "" });
    });
  });
});
