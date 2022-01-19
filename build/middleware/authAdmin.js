"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAdmin = void 0;
const _helpers_1 = require("../_helpers");
function authAdmin(req, res, next) {
    const user = req.user;
    if (!user.isAdmin)
        return _helpers_1.err(res, new Error("Request not autherized. Admin credentials are required"));
    next();
}
exports.authAdmin = authAdmin;
