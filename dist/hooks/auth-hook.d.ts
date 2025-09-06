import type { FastifyReply, FastifyRequest } from "fastify";
export declare function authHook(request: FastifyRequest<{
    Headers: {
        authorization?: string;
    };
}>, reply: FastifyReply): Promise<void>;
//# sourceMappingURL=auth-hook.d.ts.map