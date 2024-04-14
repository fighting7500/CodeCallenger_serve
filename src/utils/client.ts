// This file is auto-generated, don't edit it
import Captcha20230305, * as $Captcha20230305 from '@alicloud/captcha20230305';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import Console from '@alicloud/tea-console';
import Util, * as $Util from '@alicloud/tea-util';


export default class Client {

    static async getEnvProperty(propertyName: string): Promise<string> {
        return process.env[propertyName] || '';
    }

    static async main(args: string[]) {
        // ====================== 1. 初始化配置 ======================
        let config = new $OpenApi.Config({});
        // 设置AccessKey ID 和 AccessKey Secret。
        config.accessKeyId = await Client.getEnvProperty("ACCESS_KEY_ID");
        config.accessKeySecret = await Client.getEnvProperty("ACCESS_KEY_SECRET");
        //设置请求地址
        config.endpoint = "captcha.cn-shanghai.aliyuncs.com";
        // 连接超时
        config.connectTimeout = 5000;
        // 读超时
        config.readTimeout = 5000;
        // ====================== 2. 初始化客户端（实际生产代码中建议复用client） ======================
        let client = new Captcha20230305(config);
        // 创建APi请求
        let request = new $Captcha20230305.VerifyIntelligentCaptchaRequest({});
        // 场景ID
        request.sceneId = "1q6cx5mm";
        // 前端传来的验证参数 CaptchaVerifyParam
        request.captchaVerifyParam = args[0];
        // ====================== 3. 发起请求） ======================
        try {
            let resp = await client.verifyIntelligentCaptcha(request);
            // 建议使用您系统中的日志组件，打印返回
            // 获取验证码验证结果（请注意判空），将结果返回给前端。出现异常建议认为验证通过，优先保证业务可用，然后尽快排查异常原因。
            // @ts-ignore
            let captchaVerifyResult = resp.body.result.verifyResult;
            console.error('验证结果', captchaVerifyResult)
            // 原因code
            // let captchaVerifyCode = resp.body.result.verifyCode;
            // @ts-ignore
            return resp.body.result.verifyResult;
        } catch (error) {
            // 建议使用您系统中的日志组件，打印异常
            // 出现异常建议认为验证通过，优先保证业务可用，然后尽快排查异常原因。
            console.error(error);
            return true;
        }
    }

    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(accessKeyId: string | undefined, accessKeySecret: string | undefined): Dysmsapi20170525 {
        let config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
        });
        // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
        config.endpoint = `dysmsapi.aliyuncs.com`;
        return new Dysmsapi20170525(config);
    }

    /**
     * 使用STS鉴权方式初始化账号Client，推荐此方式。
     * @param accessKeyId
     * @param accessKeySecret
     * @param securityToken
     * @return Client
     * @throws Exception
     */
    static createClientWithSTS(accessKeyId: string, accessKeySecret: string, securityToken: string): Dysmsapi20170525 {
        let config = new $OpenApi.Config({
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
        config.endpoint = `dysmsapi.aliyuncs.com`;
        return new Dysmsapi20170525(config);
    }

    static async sendCode(args: string[]) {
        // 请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID 和 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
        // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html
        let client = Client.createClient(process.env['ACCESS_KEY_ID'], process.env['ACCESS_KEY_SECRET']);
        let sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
            signName: "Mysql学习闯关网站",
            templateCode: "SMS_465375304",
            phoneNumbers: args[0],
            templateParam: "{\"code\":\"" + args[1] + "\"}",
        });
        let runtime = new $Util.RuntimeOptions({
            autoretry: true, // 失败是否自动重试
            maxAttempts: 2, // 最大重试次数
        });
        // try {
        let resp = await client.sendSmsWithOptions(sendSmsRequest, runtime);
        Console.log(Util.toJSONString(resp));
        return resp;
        // } catch (error) {
        // 	// 错误 message
        // 	console.log(error.message);
        // 	// 诊断地址
        // 	console.log(error.data["Recommend"]);
        // 	Util.assertAsString(error.message);
        // }
    }

}

Client.main(process.argv.slice(2));
// Client.sendCode(process.argv.slice(2));