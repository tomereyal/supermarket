"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugClient = exports.errMissing = exports.err = exports.ok = void 0;
function ok(res, body, debug) {
    if (debug) {
        console.log(`[RESPONSE]`, body);
    }
    return res.status(200).json(body);
}
exports.ok = ok;
function err(res, error) {
    console.log(`error`, error);
    return res.status(500).json({ message: error.message, error });
}
exports.err = err;
function errMissing(res) {
    console.log("ERROR: MISSING REQUEST PARAMS");
    return res.status(500).json({ message: "Missing request parameter" });
}
exports.errMissing = errMissing;
/**
 *
 * @param req The request received from client
 * @param body The body the controller expects
 * @param params The params the controller expect
 * @param query The query the controller expect
 *
 * The function will print the received vs expected.
 */
function debugClient(req, expected) {
    console.log("======================================");
    if (expected === null || expected === void 0 ? void 0 : expected.body) {
        console.log("REQ BODY:     ", req.body);
        console.log("EXPECTED BODY:  ", expected.body);
    }
    if (expected === null || expected === void 0 ? void 0 : expected.params) {
        console.log("REQ PARAMS:   ", req.params);
        console.log("EXPECTED PARAMS:  ", expected.params);
    }
    if (expected === null || expected === void 0 ? void 0 : expected.query) {
        console.log("REQ QUERY:    ", req.query);
        console.log("EXPECTED QUERY:  ", expected.query);
    }
    console.log("======================================");
}
exports.debugClient = debugClient;
