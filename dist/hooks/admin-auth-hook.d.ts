import type { FastifyReply, FastifyRequest } from "fastify";
export declare function adminAuthHook(request: FastifyRequest<{
    Headers: {
        authorization?: string;
    };
}>, reply: FastifyReply): Promise<void>;
//# sourceMappingURL=admin-auth-hook.d.ts.map