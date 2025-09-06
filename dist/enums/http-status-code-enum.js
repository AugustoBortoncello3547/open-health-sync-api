export var HttpStatusCodeEnum;
(function (HttpStatusCodeEnum) {
    HttpStatusCodeEnum[HttpStatusCodeEnum["OK"] = 200] = "OK";
    HttpStatusCodeEnum[HttpStatusCodeEnum["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatusCodeEnum[HttpStatusCodeEnum["CREATED"] = 201] = "CREATED";
    HttpStatusCodeEnum[HttpStatusCodeEnum["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCodeEnum[HttpStatusCodeEnum["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusCodeEnum[HttpStatusCodeEnum["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatusCodeEnum[HttpStatusCodeEnum["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCodeEnum[HttpStatusCodeEnum["CONFLICT"] = 409] = "CONFLICT";
    HttpStatusCodeEnum[HttpStatusCodeEnum["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatusCodeEnum || (HttpStatusCodeEnum = {}));
//# sourceMappingURL=http-status-code-enum.js.map