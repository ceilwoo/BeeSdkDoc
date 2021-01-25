//****************************
// Bee SDK 1.0.0
// contact: support@beegame.io
// homepage: http://beegame.io
//****************************

//  https://en.wikipedia.org/wiki/ISO_8601
//  时间格式： 使用ISO 8601 Dates标准
//  YYYY-MM-DDTHH:MM:SSZ
//  2020-12-25T12:00:00Z

export namespace bee {

    export namespace sys {
        export const settings = {
            appId : null,
            debug : true
        }

        export const internalSettings = {
            token : null,
            sdkVersion: "1.0.0",
            sdkPlatform : "typescript",
            sdkPlatformVersion : "1.0.0",
            productionServerUrl : "beeapi.taoqi001.com/client",
    
            errorAppId: "Must be have bee.sys.settings.appId set to call this method",
            errorLoggedIn: "Must be logged in to call this method",
            errorEntityToken: "You must successfully call GetEntityToken before calling this"
        }

        export function getResponse<T>(request, xhr, startTime) {
            var result = new bee.BeeResponse();
            try {
                // window.console.log("parsing json result: " + xhr.responseText);
                result = JSON.parse(xhr.responseText);
            } catch (e) {
                result.code = 503; // Service Unavailable
                result.message = xhr.responseText;
            }

            result.callBackTimeMS = (new Date()).getTime() - startTime;
            result.request = request;
            return (result as any) as T;
        }
    }


    export function getServerUrl (){
        if(!bee.sys.settings.appId){
            console.log(bee.sys.internalSettings.errorAppId);
            return;
        }

        return `https://${bee.sys.internalSettings.productionServerUrl}`;
    }

    export function executeRequest<T>(url:string, request:{}, callback:(err,res)=>void = null){
        const {token,sdkVersion,sdkPlatform,sdkPlatformVersion} = bee.sys.internalSettings;
        return new Promise<T>((resolve, reject)=> {
            const isLogin = url.includes("login");

            if (callback != null && typeof (callback) !== "function")
              throw "Callback must be null or a function";
            
            if(token == null && !isLogin)
              throw url + "/ " + bee.sys.internalSettings.errorLoggedIn;

            if (request == null) request = {};

            const startTime = new Date().getTime();
            const requestBody = JSON.stringify(request);

            let completeUrl = bee.getServerUrl() 
                    + url
                    + `?sdkPlatform=${sdkPlatform}`
                    + `&sdkVersion=${sdkVersion}`
                    + `&sdkPlatformVersion=${sdkPlatformVersion}`

            const xhr = new XMLHttpRequest();
            xhr.open("POST", completeUrl, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("token", token);
			      xhr.setRequestHeader("appId", bee.sys.settings.appId);

            /*xhr.onloadend = function () {
                const result = bee.sys.getResponse<T>(request, xhr, startTime);
                callback && callback(result);
                reject(result);
            }*/

            xhr.onerror = function () {
                const result = bee.sys.getResponse<T>(request, xhr, startTime);
                callback && callback(result, null);
                reject(result);
            }

            xhr.send(requestBody);
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    const result = bee.sys.getResponse<T>(request, this, startTime);
                    //bee.sys.internalSettings.token = xhr.getResponseHeader("token");
                    if(isLogin){
                      try {
                        const token = (result as any).result.token;
                        if(token) bee.sys.internalSettings.token = token;
                      } catch(e){ cc.warn(e); }
                    }
                    if(bee.sys.settings.debug) console.log(url, result);
                    callback && callback(null, result);
                    if (this.status === 200) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                }
            };

        });
    }

    /** bee初始化 */
    export function init(appId : string){
        bee.sys.settings.appId = appId;
        cc.game.off(cc.game.EVENT_SHOW, bee.onFrontEnd, this);
        cc.game.off(cc.game.EVENT_HIDE, bee.onBackEnd, this);
        cc.game.on(cc.game.EVENT_SHOW, bee.onFrontEnd, this);
        cc.game.on(cc.game.EVENT_HIDE, bee.onBackEnd, this);
    }

    /** 是否开启测试模式 */
    export function setDebug(isDebug = false){
        this.settings.debug = isDebug;
    }

    /** 是否已经登录 */
    export function isLoggedIn(){
        return this.internalSettings.token ? true : false;
    }

    /** 记录游戏去到后台的事件，在cocos creator和unity会自动触发，不需要手动调用 */
    export function onBackEnd(){
      bee.logEvent({logData : { sys : 'back_end'}})
    }
    /** 记录游戏回到前台的事件，在cocos creator和unity会自动触发，不需要手动调用 */
    export function onFrontEnd(){
      bee.logEvent({logData : { sys : 'front_end'}})
    }


  /** enumValues:
 * 100 - `NOT_EXISTS` - 用户不存在
 * 101 - `DISBAND` - 用户被限制登录
 * 103 - `PASSWORD_NOT_RIGHT` - 密码不对
 * 110 - `AUTHCODE_NOT_RIGHT` - 验证码不正确
 * 122 - `CHANNEL_AUTH_ERROR` - 渠道验证失败
 * 200 - `OK` - 正常返回
 * 201 - `DUPLICATION` - 重复昵称，仅在App不允许重名的情况下返回
 * 202 - `ILLEGAL` - 字符串不合法
 * 203 - `OUT_OF_MAX_LENGTH` - 超过长度限制(目前不返回，超长字符串会自动截断)
 * 503 - `SERVER_NOT_AVAILABLE` - 服务器异常
 */
export enum BeeCode{
	/** 用户不存在 */
	NOT_EXISTS = 100,
	/** 用户被限制登录 */
	DISBAND = 101,
	/** 密码不对 */
	PASSWORD_NOT_RIGHT = 103,
	/** 验证码不正确 */
	AUTHCODE_NOT_RIGHT = 110,
	/** 渠道验证失败 */
	CHANNEL_AUTH_ERROR = 122,
	/** 正常返回 */
	OK = 200,
	/** 重复昵称，仅在App不允许重名的情况下返回 */
	DUPLICATION = 201,
	/** 字符串不合法 */
	ILLEGAL = 202,
	/** 超过长度限制(目前不返回，超长字符串会自动截断) */
	OUT_OF_MAX_LENGTH = 203,
	/** 服务器异常 */
	SERVER_NOT_AVAILABLE = 503,
}
export class BeeResponse {
  /** 返回代码，参考BeeCode枚举 */
  code : number;
  message : string;
  /** 请求执行时间 */
  callBackTimeMS : number;
  /** 请求的内容 */
  request : {};
  /** 返回的内容 */
  result : {};
}
export class BeeValueDetail{
[k:string] : {
  /** 数据值 */
  value : string;
  /** 数据的版本号，每次修改递增 */
  version : number;
  /** 上次更新数据的时间 */
  lastUpdated : string;

}}
export class BeeValue{
[k:string] : string
}
export class BeeInfoRequest {
  /** 排行榜key的数组 */
  getUserLeaderboards? : Array<string>;
  /** 用户数据key的数组 */
  getUserData? : Array<string>;
  /** App数据key的数组 */
  getAppData? : Array<string>;
}
export class BeeInfoRespone {
  /** key-排行榜id，value-排行榜信息 */
  userLeaderboards? : {[k:string] : {
    /** 排行榜当前的版本号 */
    version : number;
    /** 排名，下标0开始 */
    position : number;
    /** 排行榜总人数 */
    totalUser : number;
    /** 用户提交到排行榜的数值 */
    value? : number;
  }};
  userData : BeeValue;
  appData : BeeValue;
}
export namespace LoginWithCustomId {
  /** 用唯一的自定义id登录，可以是设备id，idfa，gid等 */
  export class Request {
    customId : string;
    /** 如果用户不存在，是否自动创建账号 */
    createAccount? : boolean;
    infoRequest : BeeInfoRequest;
  }
  /** undefined */
  export class Result {
    token : string;
    beeId : string;
    info : BeeInfoRespone;
    /** 如果用户被限制返回限制时间 */
    releaseTime? : string;
  }
  /** 错误码 */
export enum ErrorCode{
	/** 用户不存在 */
	NOT_EXISTS = 100,
	/** 用户被限制登录 */
	DISBAND = 101,
}
	export class Response extends BeeResponse {
		code: BeeCode | ErrorCode;
		request : Request;
		result : Result;
	}}
//###########################
/** 用唯一的自定义id登录，可以是设备id，idfa，gid等 */
//###########################
export function loginWithCustomId (
  request : LoginWithCustomId.Request,
  callBack?: (err:LoginWithCustomId.Response, res:LoginWithCustomId.Response)=>{}){
    return bee.executeRequest<LoginWithCustomId.Response>("/loginWithCustomId", request, callBack);
}
export namespace LoginWithEmail {
  /** 用邮箱和密码登录 */
  export class Request {
    /** 邮箱 */
    email : string;
    /** 密码 */
    password : string;
    /** 如果用户不存在，是否自动创建账号 */
    createAccount? : boolean;
    infoRequest : BeeInfoRequest;
  }
  /** 返回登录信息 */
  export class Result {
    token : string;
    beeId : string;
    /** 如果用户被限制返回限制时间 */
    releaseTime? : string;
    info : BeeInfoRespone;
  }
  /** 错误码 */
export enum ErrorCode{
	/** 用户不存在 */
	NOT_EXISTS = 100,
	/** 用户被限制登录 */
	DISBAND = 101,
	/** 密码不对 */
	PASSWORD_NOT_RIGHT = 103,
}
	export class Response extends BeeResponse {
		code: BeeCode | ErrorCode;
		request : Request;
		result : Result;
	}}
//###########################
/** 用邮箱和密码登录 */
//###########################
export function loginWithEmail (
  request : LoginWithEmail.Request,
  callBack?: (err:LoginWithEmail.Response, res:LoginWithEmail.Response)=>{}){
    return bee.executeRequest<LoginWithEmail.Response>("/loginWithEmail", request, callBack);
}
export namespace LoginWithPhone {
  /** 用手机号和密码(或验证码)登录 */
  export class Request {
    /** 手机号 */
    phone : string;
    /** 使用手机+验证码登录 */
    authCode? : string;
    /** 使用手机+密码登录 */
    password? : string;
    /** 如果用户不存在，是否自动创建账号 */
    createAccount? : boolean;
    infoRequest : BeeInfoRequest;
  }
  /** 返回登录信息 */
  export class Result {
    token : string;
    beeId : string;
    info : BeeInfoRespone;
    /** 如果用户被限制返回限制时间 */
    releaseTime? : string;
  }
  /** 错误码 */
export enum ErrorCode{
	/** 用户不存在 */
	NOT_EXISTS = 100,
	/** 用户被限制登录 */
	DISBAND = 101,
	/** 密码不对 */
	PASSWORD_NOT_RIGHT = 103,
	/** 验证码不正确 */
	AUTHCODE_NOT_RIGHT = 110,
}
	export class Response extends BeeResponse {
		code: BeeCode | ErrorCode;
		request : Request;
		result : Result;
	}}
//###########################
/** 用手机号和密码(或验证码)登录 */
//###########################
export function loginWithPhone (
  request : LoginWithPhone.Request,
  callBack?: (err:LoginWithPhone.Response, res:LoginWithPhone.Response)=>{}){
    return bee.executeRequest<LoginWithPhone.Response>("/loginWithPhone", request, callBack);
}
export namespace LoginWithChannel {
  /** 用第三方渠道的唯一识别码登录，微信，facebook, apple id, twitter等 */
  export class Request {
    /** 渠道名称，参考枚举BeeChannel */
    channel : string;
    /** 渠道code */
    code : string;
    /** 如果用户不存在，是否自动创建账号 */
    createAccount? : boolean;
    infoRequest : BeeInfoRequest;
  }
  /** 返回登录信息 */
  export class Result {
    token : string;
    beeId : string;
    info : BeeInfoRequest;
    /** 如果用户被限制返回限制时间 */
    releaseTime? : string;
  }
  /** 错误码 */
export enum ErrorCode{
	/** 用户不存在 */
	NOT_EXISTS = 100,
	/** 用户被限制登录 */
	DISBAND = 101,
	/** 密码不对 */
	PASSWORD_NOT_RIGHT = 103,
	/** 验证码不正确 */
	AUTHCODE_NOT_RIGHT = 110,
	/** 渠道验证失败 */
	CHANNEL_AUTH_ERROR = 122,
}
	export class Response extends BeeResponse {
		code: BeeCode | ErrorCode;
		request : Request;
		result : Result;
	}}
//###########################
/** 用第三方渠道的唯一识别码登录，微信，facebook, apple id, twitter等 */
//###########################
export function loginWithChannel (
  request : LoginWithChannel.Request,
  callBack?: (err:LoginWithChannel.Response, res:LoginWithChannel.Response)=>{}){
    return bee.executeRequest<LoginWithChannel.Response>("/loginWithChannel", request, callBack);
}
export namespace SendRecoveryEmail {
  /** 发送重置邮件 */
  export class Request {
    email : string;
  }
  /** 返回发送邮件是否成功 */
  export class Result {
  }
  /** 错误码 */
export enum ErrorCode{
	/** 用户不存在 */
	NOT_EXISTS = 100,
}
	export class Response extends BeeResponse {
		code: BeeCode | ErrorCode;
		request : Request;
		result : Result;
	}}
//###########################
/** 发送重置邮件 */
//###########################
export function sendRecoveryEmail (
  request : SendRecoveryEmail.Request,
  callBack?: (err:SendRecoveryEmail.Response, res:SendRecoveryEmail.Response)=>{}){
    return bee.executeRequest<SendRecoveryEmail.Response>("/sendRecoveryEmail", request, callBack);
}
export namespace SendPhoneAuthMesssage {
  /** 发送验证码到手机 */
  export class Request {
    phone : string;
  }
  /** 发送验证码到手机 */
  export class Result {
    additionalProperties : string;
  }
  /** 错误码 */
export enum ErrorCode{
	/** 用户不存在 */
	NOT_EXISTS = 100,
}
	export class Response extends BeeResponse {
		code: BeeCode | ErrorCode;
		request : Request;
		result : Result;
	}}
//###########################
/** 发送验证码到手机 */
//###########################
export function sendPhoneAuthMesssage (
  request : SendPhoneAuthMesssage.Request,
  callBack?: (err:SendPhoneAuthMesssage.Response, res:SendPhoneAuthMesssage.Response)=>{}){
    return bee.executeRequest<SendPhoneAuthMesssage.Response>("/sendPhoneAuthMesssage", request, callBack);
}
export namespace ResetPhonePassword {
  /** 重置手机账号的密码 */
  export class Request {
    /** 手机号码 */
    phone : string;
    /** 需要重置为的密码 */
    password : string;
    /** 手机收到的验证码 */
    autoCode : string;
  }
  /** 返回重置手机账号的密码是否成功 */
  export class Result {
  }
  /** 错误码 */
export enum ErrorCode{
	/** 用户不存在 */
	NOT_EXISTS = 100,
}
	export class Response extends BeeResponse {
		code: BeeCode | ErrorCode;
		request : Request;
		result : Result;
	}}
//###########################
/** 重置手机账号的密码 */
//###########################
export function resetPhonePassword (
  request : ResetPhonePassword.Request,
  callBack?: (err:ResetPhonePassword.Response, res:ResetPhonePassword.Response)=>{}){
    return bee.executeRequest<ResetPhonePassword.Response>("/resetPhonePassword", request, callBack);
}
export namespace BindPhone {
  /** 绑定手机 */
  export class Request {
    /** 手机号码 */
    phone : string;
    /** 设置的密码 */
    password? : string;
    /** 手机收到的验证码 */
    autoCode : string;
  }
  /** 是否成功 */
  export class Result {
  }
	export class Response extends BeeResponse {
		request : Request;
		result : Result;
	}}
//###########################
/** 绑定手机 */
//###########################
export function bindPhone (
  request : BindPhone.Request,
  callBack?: (err:BindPhone.Response, res:BindPhone.Response)=>{}){
    return bee.executeRequest<BindPhone.Response>("/bindPhone", request, callBack);
}
export namespace BindEmail {
  /** 绑定邮箱 */
  export class Request {
    /** 邮箱 */
    email : string;
    /** 密码 */
    password : string;
  }
  /** 是否成功 */
  export class Result {
  }
	export class Response extends BeeResponse {
		request : Request;
		result : Result;
	}}
//###########################
/** 绑定邮箱 */
//###########################
export function bindEmail (
  request : BindEmail.Request,
  callBack?: (err:BindEmail.Response, res:BindEmail.Response)=>{}){
    return bee.executeRequest<BindEmail.Response>("/bindEmail", request, callBack);
}
export namespace SetUserData {
  /** 更新用户的存储数据 */
  export class Request {
    /** key value型 */
    userData : {[k:string] : string};
  }
  /** undefined */
  export class Result {
  }
	export class Response extends BeeResponse {
		request : Request;
		result : Result;
	}}
//###########################
/** 更新用户的存储数据 */
//###########################
export function setUserData (
  request : SetUserData.Request,
  callBack?: (err:SetUserData.Response, res:SetUserData.Response)=>{}){
    return bee.executeRequest<SetUserData.Response>("/setUserData", request, callBack);
}
export namespace GetUserData {
  /** 获取用户的存储数据 */
  export class Request {
    /** 传入key数组，如果key为空则返回用户所有的数据 */
    keys? : Array<string>;
  }
  /** undefined */
  export class Result {
    userData : BeeValue;
  }
	export class Response extends BeeResponse {
		request : Request;
		result : Result;
	}}
//###########################
/** 获取用户的存储数据 */
//###########################
export function getUserData (
  request : GetUserData.Request,
  callBack?: (err:GetUserData.Response, res:GetUserData.Response)=>{}){
    return bee.executeRequest<GetUserData.Response>("/getUserData", request, callBack);
}
export namespace SetDisplayName {
  /** 更新用户昵称 */
  export class Request {
    /** 昵称不大于30字 */
    displayName : string;
  }
  /** undefined */
  export class Result {
  }
  /** 错误码 */
export enum ErrorCode{
	/** 重复昵称，仅在App不允许重名的情况下返回 */
	DUPLICATION = 201,
	/** 字符串不合法 */
	ILLEGAL = 202,
	/** 超过长度限制(目前不返回，超长字符串会自动截断) */
	OUT_OF_MAX_LENGTH = 203,
}
	export class Response extends BeeResponse {
		code: BeeCode | ErrorCode;
		request : Request;
		result : Result;
	}}
//###########################
/** 更新用户昵称 */
//###########################
export function setDisplayName (
  request : SetDisplayName.Request,
  callBack?: (err:SetDisplayName.Response, res:SetDisplayName.Response)=>{}){
    return bee.executeRequest<SetDisplayName.Response>("/setDisplayName", request, callBack);
}
export namespace SetAvatarUrl {
  /** 更新用户头像地址 */
  export class Request {
    avatarUrl : string;
  }
  /** undefined */
  export class Result {
  }
  /** 错误码 */
export enum ErrorCode{
	/** 字符串不合法 */
	ILLEGAL = 202,
	/** 超过长度限制(目前不返回，超长字符串会自动截断) */
	OUT_OF_MAX_LENGTH = 203,
}
	export class Response extends BeeResponse {
		code: BeeCode | ErrorCode;
		request : Request;
		result : Result;
	}}
//###########################
/** 更新用户头像地址 */
//###########################
export function setAvatarUrl (
  request : SetAvatarUrl.Request,
  callBack?: (err:SetAvatarUrl.Response, res:SetAvatarUrl.Response)=>{}){
    return bee.executeRequest<SetAvatarUrl.Response>("/setAvatarUrl", request, callBack);
}
export namespace GetUserInfo {
  /** 获取用户信息，如果不输入beeId则默认返回自己的信息 */
  export class Request {
    beeId? : string;
    infoRequest : BeeInfoRequest;
  }
  /** undefined */
  export class Result {
    /** 用户头像地址 */
    avatarUrl? : string;
    /** 用户昵称 */
    displayName? : string;
    info : BeeInfoRespone;
  }
  /** 错误码 */
export enum ErrorCode{
	/** 用户不存在 */
	NOT_EXISTS = 100,
}
	export class Response extends BeeResponse {
		code: BeeCode | ErrorCode;
		request : Request;
		result : Result;
	}}
//###########################
/** 获取用户信息，如果不输入beeId则默认返回自己的信息 */
//###########################
export function getUserInfo (
  request : GetUserInfo.Request,
  callBack?: (err:GetUserInfo.Response, res:GetUserInfo.Response)=>{}){
    return bee.executeRequest<GetUserInfo.Response>("/getUserInfo", request, callBack);
}
export namespace UpdateLeaderboards {
  /** 更新用户排行榜记录，可以同时更新多个排行榜，key(排行榜id)-value(数值) */
  export class Request {
    /** key(排行榜id)-value(数值) */
    leaderboard : {[k:string] : number};
  }
  /** undefined */
  export class Result {
    leaderbord? : {[k:string] : {
      /** 当前排行榜版本号 */
      version : number;
  }};
  }
	export class Response extends BeeResponse {
		request : Request;
		result : Result;
	}}
//###########################
/** 更新用户排行榜记录，可以同时更新多个排行榜，key(排行榜id)-value(数值) */
//###########################
export function updateLeaderboards (
  request : UpdateLeaderboards.Request,
  callBack?: (err:UpdateLeaderboards.Response, res:UpdateLeaderboards.Response)=>{}){
    return bee.executeRequest<UpdateLeaderboards.Response>("/updateLeaderboards", request, callBack);
}
export namespace GetLeaderboard {
  /** 获取排行榜信息 */
  export class Request {
    /** 排行榜id */
    key : string;
    /** 获取排行榜长度，默认10， Max 100 */
    maxResultsCount? : number;
    /** 获取指定版本号的排行榜，不输入则返回最新的排行版内容 */
    version? : number;
  }
  /** 返回排行榜信息 */
  export class Result {
    /** 排行榜topN的数组 */
    leaderboard : Array<{
        /** 用户的beeId */
        beeId : string;
        /** 排名，下标1开始 */
        position : number;
        /** 参与排名的数值 */
        value : number;
        /** 用户昵称 */
        displayName? : string;
        /** 用户头像地址 */
        avatarUrl? : string;
    }>;
    /** 排行榜更新的UTC时间，ISO 8601标准,YYYY-MM-DDTHH:MM:SSZ, 2020-12-25T12:00:00Z */
    nextReset : string;
    /** 当前排行榜的版本号 */
    version : number;
    /** 排行榜总人数 */
    totalUser : number;
  }
	export class Response extends BeeResponse {
		request : Request;
		result : Result;
	}}
//###########################
/** 获取排行榜信息 */
//###########################
export function getLeaderboard (
  request : GetLeaderboard.Request,
  callBack?: (err:GetLeaderboard.Response, res:GetLeaderboard.Response)=>{}){
    return bee.executeRequest<GetLeaderboard.Response>("/getLeaderboard", request, callBack);
}
export namespace GetUserLeaderboard {
  /** 获取用户的排行榜信息 */
  export class Request {
    /** 获取某个玩家的信息，如果为空则默认请求自己的信息 */
    beeId? : string;
    /** 排行榜key */
    key : string;
    /** 指定版本号，不输入version则返回最新的排行榜 */
    version? : number;
  }
  /** 返回在排行榜的排名和数据 */
  export class Result {
    /** 目标的beeId */
    beeId : string;
    /** 排行榜版本号 */
    version : number;
    /** 我的排名，下标0开始算 */
    position : number;
    /** 排行榜总人数 */
    totalUser : number;
    /** 数值 */
    value : number;
    /** 用户头像地址 */
    avatarUrl? : string;
    /** 用户昵称 */
    displayName? : string;
  }
	export class Response extends BeeResponse {
		request : Request;
		result : Result;
	}}
//###########################
/** 获取用户的排行榜信息 */
//###########################
export function getUserLeaderboard (
  request : GetUserLeaderboard.Request,
  callBack?: (err:GetUserLeaderboard.Response, res:GetUserLeaderboard.Response)=>{}){
    return bee.executeRequest<GetUserLeaderboard.Response>("/getUserLeaderboard", request, callBack);
}
export namespace GetAppData {
  /** 获取后台App的存储数据 */
  export class Request {
    /** 存储数据的key数组，支持获取多个，如果不输入keys则返回app的所有存储数据 */
    keys? : Array<string>;
  }
  /** 根据keys返回后台app的存储数据 */
  export class Result {
    appData : BeeValue;
  }
	export class Response extends BeeResponse {
		request : Request;
		result : Result;
	}}
//###########################
/** 获取后台App的存储数据 */
//###########################
export function getAppData (
  request : GetAppData.Request,
  callBack?: (err:GetAppData.Response, res:GetAppData.Response)=>{}){
    return bee.executeRequest<GetAppData.Response>("/getAppData", request, callBack);
}
export namespace LogEvent {
  /** 事件上报 */
  export class Request {
    /** key:事件key, value:可以是对象字符串数组等可序列化的内容 */
    logData : {[k:string] : {
  }};
  }
  /** 成功 */
  export class Result {
  }
	export class Response extends BeeResponse {
		request : Request;
		result : Result;
	}}
//###########################
/** 事件上报 */
//###########################
export function logEvent (
  request : LogEvent.Request,
  callBack?: (err:LogEvent.Response, res:LogEvent.Response)=>{}){
    return bee.executeRequest<LogEvent.Response>("/logEvent", request, callBack);
}


}

