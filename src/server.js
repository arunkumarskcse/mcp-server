"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var hubspot_client_1 = require("@/lib/hubspot-client");
var readline = require("readline");
// Set up stdin/stdout interface
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});
// Handle cleanup on process exit
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log('[HubSpot MCP] Shutting down...');
        rl.close();
        process.exit(0);
        return [2 /*return*/];
    });
}); });
console.log('[HubSpot MCP] Server started');
// Validate contact data
function validateContactData(contact) {
    if (!contact.properties.firstname || typeof contact.properties.firstname !== 'string') {
        throw new Error('First name is required and must be a string');
    }
    if (!contact.properties.lastname || typeof contact.properties.lastname !== 'string') {
        throw new Error('Last name is required and must be a string');
    }
    if (!contact.properties.email || typeof contact.properties.email !== 'string') {
        throw new Error('Email is required and must be a string');
    }
    if (!contact.properties.phone || typeof contact.properties.phone !== 'string') {
        throw new Error('Phone is required and must be a string');
    }
    return true;
}
// Validate contact ID
function validateContactId(contactId) {
    if (!contactId || typeof contactId !== 'string') {
        throw new Error('Valid contact ID is required');
    }
    return true;
}
rl.on("line", function (line) { return __awaiter(void 0, void 0, void 0, function () {
    var input, result, _a, error_1, err;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 11, , 12]);
                input = JSON.parse(line);
                result = void 0;
                _a = input.command;
                switch (_a) {
                    case "GET_CONTACTS": return [3 /*break*/, 1];
                    case "ADD_CONTACT": return [3 /*break*/, 3];
                    case "UPDATE_CONTACT": return [3 /*break*/, 5];
                    case "DELETE_CONTACT": return [3 /*break*/, 7];
                }
                return [3 /*break*/, 9];
            case 1: return [4 /*yield*/, hubspot_client_1.hubspotClient.getContacts()];
            case 2:
                result = _f.sent();
                return [3 /*break*/, 10];
            case 3:
                if (!((_b = input.payload) === null || _b === void 0 ? void 0 : _b.contact)) {
                    throw new Error('Contact data is required');
                }
                validateContactData(input.payload.contact);
                return [4 /*yield*/, hubspot_client_1.hubspotClient.addContact(input.payload.contact)];
            case 4:
                result = _f.sent();
                return [3 /*break*/, 10];
            case 5:
                if (!((_c = input.payload) === null || _c === void 0 ? void 0 : _c.contactId) || !((_d = input.payload) === null || _d === void 0 ? void 0 : _d.contact)) {
                    throw new Error('Contact ID and contact data are required');
                }
                validateContactId(input.payload.contactId);
                validateContactData(input.payload.contact);
                return [4 /*yield*/, hubspot_client_1.hubspotClient.updateContact(input.payload.contactId, input.payload.contact)];
            case 6:
                result = _f.sent();
                return [3 /*break*/, 10];
            case 7:
                if (!((_e = input.payload) === null || _e === void 0 ? void 0 : _e.contactId)) {
                    throw new Error('Contact ID is required');
                }
                validateContactId(input.payload.contactId);
                return [4 /*yield*/, hubspot_client_1.hubspotClient.deleteContact(input.payload.contactId)];
            case 8:
                result = _f.sent();
                return [3 /*break*/, 10];
            case 9:
                result = { error: "Unknown command" };
                _f.label = 10;
            case 10:
                process.stdout.write(JSON.stringify(result) + "\n");
                return [3 /*break*/, 12];
            case 11:
                error_1 = _f.sent();
                err = error_1;
                process.stdout.write(JSON.stringify({
                    success: false,
                    error: err.message,
                    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
                }) + "\n");
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
