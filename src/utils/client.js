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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
// This file is auto-generated, don't edit it
var captcha20230305_1 = require("@alicloud/captcha20230305"), $Captcha20230305 = captcha20230305_1;
var dysmsapi20170525_1 = require("@alicloud/dysmsapi20170525"), $Dysmsapi20170525 = dysmsapi20170525_1;
var $OpenApi = require("@alicloud/openapi-client");
var tea_console_1 = require("@alicloud/tea-console");
var tea_util_1 = require("@alicloud/tea-util"), $Util = tea_util_1;
var Client = /** @class */ (function () {
    function Client() {
    }
    Client.getEnvProperty = function (propertyName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO 请实现非明文硬编码方式获取您的AccessKey ID 和 AccessKey Secret，比如阿里云Credentials工具（参见https://help.aliyun.com/document_detail/378659.html），或其他您的系统中安全的获取方式。
                return [2 /*return*/, process.env[propertyName] || ''];
            });
        });
    };
    Client.main = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var config, _a, _b, client, request, resp, captchaVerifyResult, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        config = new $OpenApi.Config({});
                        // 设置AccessKey ID 和 AccessKey Secret。
                        _a = config;
                        return [4 /*yield*/, Client.getEnvProperty("ACCESS_KEY_ID")];
                    case 1:
                        // 设置AccessKey ID 和 AccessKey Secret。
                        _a.accessKeyId = _c.sent();
                        _b = config;
                        return [4 /*yield*/, Client.getEnvProperty("ACCESS_KEY_SECRET")];
                    case 2:
                        _b.accessKeySecret = _c.sent();
                        //设置请求地址
                        config.endpoint = "captcha.cn-shanghai.aliyuncs.com";
                        // 连接超时
                        config.connectTimeout = 5000;
                        // 读超时
                        config.readTimeout = 5000;
                        client = new captcha20230305_1.default(config);
                        request = new $Captcha20230305.VerifyIntelligentCaptchaRequest({});
                        // 场景ID
                        request.sceneId = "1q6cx5mm";
                        // 前端传来的验证参数 CaptchaVerifyParam
                        request.captchaVerifyParam = args[0];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, client.verifyIntelligentCaptcha(request)];
                    case 4:
                        resp = _c.sent();
                        captchaVerifyResult = resp.body.result.verifyResult;
                        console.error('验证结果', captchaVerifyResult);
                        // 原因code
                        // let captchaVerifyCode = resp.body.result.verifyCode;
                        return [2 /*return*/, resp.body.result.verifyResult];
                    case 5:
                        error_1 = _c.sent();
                        // 建议使用您系统中的日志组件，打印异常
                        // 出现异常建议认为验证通过，优先保证业务可用，然后尽快排查异常原因。
                        console.error(error_1);
                        return [2 /*return*/, true];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    Client.createClient = function (accessKeyId, accessKeySecret) {
        var config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
        });
        // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
        config.endpoint = "dysmsapi.aliyuncs.com";
        return new dysmsapi20170525_1.default(config);
    };
    /**
    * 使用STS鉴权方式初始化账号Client，推荐此方式。
    * @param accessKeyId
    * @param accessKeySecret
    * @param securityToken
    * @return Client
    * @throws Exception
    */
    Client.createClientWithSTS = function (accessKeyId, accessKeySecret, securityToken) {
        var config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
            // 必填，您的 Security Token
            securityToken: securityToken,
            // 必填，表明使用 STS 方式
            type: "sts",
        });
        // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
        config.endpoint = "dysmsapi.aliyuncs.com";
        return new dysmsapi20170525_1.default(config);
    };
    Client.sendCode = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var client, sendSmsRequest, runtime, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = Client.createClient(process.env['ACCESS_KEY_ID'], process.env['ACCESS_KEY_SECRET']);
                        sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
                            signName: "Mysql学习闯关网站",
                            templateCode: "SMS_465375304",
                            phoneNumbers: args[0],
                            templateParam: "{\"code\":\"" + args[1] + "\"}",
                        });
                        runtime = new $Util.RuntimeOptions({
                            autoretry: true, // 失败是否自动重试
                            maxAttempts: 2, // 最大重试次数
                        });
                        return [4 /*yield*/, client.sendSmsWithOptions(sendSmsRequest, runtime)];
                    case 1:
                        resp = _a.sent();
                        tea_console_1.default.log(tea_util_1.default.toJSONString(resp));
                        return [2 /*return*/, resp];
                }
            });
        });
    };
    return Client;
}());
exports.default = Client;
Client.main(process.argv.slice(2));
// Client.sendCode(process.argv.slice(2));
