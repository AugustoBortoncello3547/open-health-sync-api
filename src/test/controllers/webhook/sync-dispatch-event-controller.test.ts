import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IGetAmbienteRepository } from "../../../controllers/ambiente/get-ambiente/types.js";
import { SyncDispatchEventController } from "../../../controllers/webhook/sync-dispatch-event-controller.js";
import type { EventTypeDispatchEnum } from "../../../enums/event-type-dispatch-enum.js";

describe("SyncDispatchEventController", () => {
  let mockGetAmbienteRepository: IGetAmbienteRepository;
  let controller: SyncDispatchEventController;

  beforeEach(() => {
    mockGetAmbienteRepository = {
      getAmbiente: vi.fn(),
      getAmbienteOnlyByIdExterno: vi.fn(),
    };

    global.fetch = vi.fn();

    controller = new SyncDispatchEventController(mockGetAmbienteRepository);
  });

  it("deve retornar false se não encontrar o ambiente", async () => {
    (mockGetAmbienteRepository.getAmbiente as any).mockResolvedValue(null);

    const result = await controller.dispatch("app1", "amb1", "CREATE" as EventTypeDispatchEnum, { foo: "bar" });

    expect(result).toBe(false);
    expect(mockGetAmbienteRepository.getAmbiente).toHaveBeenCalledWith("amb1", "app1");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("deve retornar false se não houver urlWebhook", async () => {
    (mockGetAmbienteRepository.getAmbiente as any).mockResolvedValue({
      urlWebhook: null,
      tokenWebhook: "token123",
    });

    const result = await controller.dispatch("app1", "amb1", "UPDATE" as EventTypeDispatchEnum, { foo: "bar" });

    expect(result).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("deve retornar true se o webhook responder com ok", async () => {
    (mockGetAmbienteRepository.getAmbiente as any).mockResolvedValue({
      urlWebhook: "http://example.com/webhook",
      tokenWebhook: "token123",
    });

    (global.fetch as any).mockResolvedValue({
      ok: true,
    });

    const result = await controller.dispatch("app1", "amb1", "DELETE" as EventTypeDispatchEnum, { foo: "bar" });

    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith("http://example.com/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Token": "token123",
      },
      body: JSON.stringify({
        event: "DELETE",
        data: { foo: "bar" },
      }),
    });
  });

  it("deve retornar false se o fetch lançar erro", async () => {
    (mockGetAmbienteRepository.getAmbiente as any).mockResolvedValue({
      urlWebhook: "http://example.com/webhook",
      tokenWebhook: "token123",
    });

    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    const result = await controller.dispatch("app1", "amb1", "CREATE" as EventTypeDispatchEnum, { foo: "bar" });

    expect(result).toBe(false);
  });
});
