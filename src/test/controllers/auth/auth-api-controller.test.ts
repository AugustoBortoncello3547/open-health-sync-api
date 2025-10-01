import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { AuthApiController } from "../../../controllers/auth/auth-api-controller.js";
import { UnauthorizedError } from "../../../errors/unauthorized-error.js";
import { RoleApiEnum } from "../../../enums/role-api-enum.js";

vi.mock("bcrypt", () => ({
  compare: vi.fn(),
}));

describe("AuthApiController", () => {
  let getAplicacaoRepository: any;
  let jwtTokenController: any;
  let controller: AuthApiController;

  const fakeAplicacao = {
    id: "app-123",
    email: "teste@app.com",
    senha: "hashed-password",
    status: "ATIVO",
  };

  beforeEach(() => {
    getAplicacaoRepository = {
      getAplicacaoByEmail: vi.fn(),
      getAplicacao: vi.fn(),
    };
    jwtTokenController = {
      getTokenFromAuthorizationHeader: vi.fn(),
      extractDatafromToken: vi.fn(),
    };

    controller = new AuthApiController(getAplicacaoRepository, jwtTokenController);

    process.env.JWT_SECRET = "secret";
    process.env.JWT_EXPIRE_TIME = 60;
    process.env.ID_APLICACAO_ADMIN = "admin-001";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---- AUTENTICATE ----
  it("deve autenticar aplicação com sucesso", async () => {
    getAplicacaoRepository.getAplicacaoByEmail.mockResolvedValue(fakeAplicacao);
    (compare as any).mockResolvedValue(true);

    const result = await controller.autenticate(fakeAplicacao.email, "senha-correta");

    expect(result.token).toBeDefined();
    expect(result.expiresIn).toBe(60);
    expect(result.expiresAt).toBeInstanceOf(Date);
    expect(getAplicacaoRepository.getAplicacaoByEmail).toHaveBeenCalledWith(fakeAplicacao.email);
  });

  it("deve lançar UnauthorizedError se aplicação não encontrada", async () => {
    getAplicacaoRepository.getAplicacaoByEmail.mockResolvedValue(null);

    await expect(controller.autenticate("naoexiste@app.com", "123")).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("deve lançar UnauthorizedError se senha for inválida", async () => {
    getAplicacaoRepository.getAplicacaoByEmail.mockResolvedValue(fakeAplicacao);
    (compare as any).mockResolvedValue(false);

    await expect(controller.autenticate(fakeAplicacao.email, "senha-errada")).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("deve autenticar aplicação admin com role ADMIN", async () => {
    getAplicacaoRepository.getAplicacaoByEmail.mockResolvedValue({ ...fakeAplicacao, id: "admin-001" });
    (compare as any).mockResolvedValue(true);

    const result = await controller.autenticate("admin@app.com", "senha-correta");

    const payload: any = jwt.verify(result.token, process.env.JWT_SECRET!);
    expect(payload.role).toBe(RoleApiEnum.ADMIN);
  });

  // ---- VERIFY TOKEN ----
  it("deve falhar se token não informado", async () => {
    jwtTokenController.getTokenFromAuthorizationHeader.mockReturnValue({ scheme: "", token: "" });

    await expect(controller.verifyToken({ headers: {} } as any, {} as any, RoleApiEnum.USER)).rejects.toThrow(
      "Token não informado.",
    );
  });

  it("deve falhar se formato do token for inválido", async () => {
    jwtTokenController.getTokenFromAuthorizationHeader.mockReturnValue({ scheme: "Basic", token: "123" });

    await expect(
      controller.verifyToken({ headers: { authorization: "Basic 123" } } as any, {} as any, RoleApiEnum.USER),
    ).rejects.toThrow("Formato de token inválido.");
  });

  it("deve falhar se dados do token forem inválidos", async () => {
    jwtTokenController.getTokenFromAuthorizationHeader.mockReturnValue({ scheme: "Bearer", token: "abc" });
    jwtTokenController.extractDatafromToken.mockResolvedValue({ idAplicacao: "", email: "", role: "" });

    await expect(
      controller.verifyToken({ headers: { authorization: "Bearer abc" } } as any, {} as any, RoleApiEnum.USER),
    ).rejects.toThrow("Token fornecido não é valido.");
  });

  it("deve falhar se role do token não corresponder", async () => {
    jwtTokenController.getTokenFromAuthorizationHeader.mockReturnValue({ scheme: "Bearer", token: "abc" });
    jwtTokenController.extractDatafromToken.mockResolvedValue({
      idAplicacao: "app-123",
      email: "teste@app.com",
      role: RoleApiEnum.USER,
    });

    await expect(
      controller.verifyToken({ headers: { authorization: "Bearer abc" } } as any, {} as any, RoleApiEnum.ADMIN),
    ).rejects.toThrow("Aplicação sem permissão para acessar o recurso.");
  });

  it("deve falhar se aplicação não for encontrada no banco", async () => {
    jwtTokenController.getTokenFromAuthorizationHeader.mockReturnValue({ scheme: "Bearer", token: "abc" });
    jwtTokenController.extractDatafromToken.mockResolvedValue({
      idAplicacao: "app-999",
      email: "teste@app.com",
      role: RoleApiEnum.USER,
    });
    getAplicacaoRepository.getAplicacao.mockResolvedValue(null);

    await expect(
      controller.verifyToken({ headers: { authorization: "Bearer abc" } } as any, {} as any, RoleApiEnum.USER),
    ).rejects.toThrow("Aplicação não encotrada.");
  });

  it("deve falhar se aplicação estiver bloqueada", async () => {
    jwtTokenController.getTokenFromAuthorizationHeader.mockReturnValue({ scheme: "Bearer", token: "abc" });
    jwtTokenController.extractDatafromToken.mockResolvedValue({
      idAplicacao: "app-123",
      email: "teste@app.com",
      role: RoleApiEnum.USER,
    });
    getAplicacaoRepository.getAplicacao.mockResolvedValue({ ...fakeAplicacao, status: "CANCELADO" });

    await expect(
      controller.verifyToken({ headers: { authorization: "Bearer abc" } } as any, {} as any, RoleApiEnum.USER),
    ).rejects.toThrow("Aplicação está bloqueada.");

    jwtTokenController.getTokenFromAuthorizationHeader.mockReturnValue({ scheme: "Bearer", token: "abc" });
    jwtTokenController.extractDatafromToken.mockResolvedValue({
      idAplicacao: "app-123",
      email: "teste@app.com",
      role: RoleApiEnum.USER,
    });
    getAplicacaoRepository.getAplicacao.mockResolvedValue({ ...fakeAplicacao, status: "RECUSADO" });

    await expect(
      controller.verifyToken({ headers: { authorization: "Bearer abc" } } as any, {} as any, RoleApiEnum.USER),
    ).rejects.toThrow("Aplicação está bloqueada.");
  });

  it("deve falhar se email do token não bater com email da aplicação", async () => {
    jwtTokenController.getTokenFromAuthorizationHeader.mockReturnValue({ scheme: "Bearer", token: "abc" });
    jwtTokenController.extractDatafromToken.mockResolvedValue({
      idAplicacao: "app-123",
      email: "outro@app.com",
      role: RoleApiEnum.USER,
    });
    getAplicacaoRepository.getAplicacao.mockResolvedValue(fakeAplicacao);

    await expect(
      controller.verifyToken({ headers: { authorization: "Bearer abc" } } as any, {} as any, RoleApiEnum.USER),
    ).rejects.toThrow("Este Token não se refere ao email atual da aplicação.");
  });

  it("deve validar token com sucesso", async () => {
    jwtTokenController.getTokenFromAuthorizationHeader.mockReturnValue({ scheme: "Bearer", token: "abc" });
    jwtTokenController.extractDatafromToken.mockResolvedValue({
      idAplicacao: fakeAplicacao.id,
      email: fakeAplicacao.email,
      role: RoleApiEnum.USER,
    });
    getAplicacaoRepository.getAplicacao.mockResolvedValue(fakeAplicacao);

    await expect(
      controller.verifyToken({ headers: { authorization: "Bearer abc" } } as any, {} as any, RoleApiEnum.USER),
    ).resolves.not.toThrow();
  });
});
