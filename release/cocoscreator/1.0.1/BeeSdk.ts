//****************************
// Bee SDK 1.0.1
// contact: support@beegame.io
// homepage: http://beegame.io
//****************************

//  https://en.wikipedia.org/wiki/ISO_8601
//  时间格式： 使用ISO 8601 Dates标准
//  YYYY-MM-DDTHH:MM:SSZ
//  2020-12-25T12:00:00Z

export namespace bee {

    export namespace sys {/*{{{*/
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
            var result = new bee.model.BeeResponse();
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
		export function getServerUrl (){/*{{{*/
			if(!bee.sys.settings.appId){
				console.log(bee.sys.internalSettings.errorAppId);
				return;
			}

			return `https://${bee.sys.internalSettings.productionServerUrl}`;
		}/*}}}*/

		export function executeRequest<T>(url:string, request:{}, callback:(err,res)=>void = null){ ///{{{
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

				let completeUrl = getServerUrl() 
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
					const result = getResponse<T>(request, xhr, startTime);
					callback && callback(result, null);
					reject(result);
				}

				xhr.send(requestBody);
				xhr.onreadystatechange = function () {
					if (this.readyState === 4) {
						const result = getResponse<T>(request, this, startTime);
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
		}/*}}}*/
    }/*}}}*/

	export namespace model {
		  /** enumValues:
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
  /** * 100 - `APPLE` - 苹果
* 110 - `GOOGLE_PLAY` - google play
* 120 - `FACEBOOK` - facebook
* 121 - `FACEBOOK_GAME` - facebook 小游戏
* 130 - `WECHAT` - wechat
* 131 - `WECHAT_GAME` - 微信小游戏
* 140 - `QQ` - QQ
* 141 - `QQ_GAME` - QQ小游戏
 */
  export enum BeePlatformCode{
    /** 苹果 */
    APPLE = 100,
    /** google play */
    GOOGLE_PLAY = 110,
    /** facebook */
    FACEBOOK = 120,
    /** facebook 小游戏 */
    FACEBOOK_GAME = 121,
    /** wechat */
    WECHAT = 130,
    /** 微信小游戏 */
    WECHAT_GAME = 131,
    /** QQ */
    QQ = 140,
    /** QQ小游戏 */
    QQ_GAME = 141,
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
export class BeeFriend {
  /** 用户的beeId */
  beeId : string;
  /** 用户昵称 */
  displayName? : string;
  /** 用户头像地址 */
  avatarUrl? : string;
}
export class BeeUserLeaderboards {
  /** 排行榜当前的版本号 */
  version : number;
  /** 排名，下标1开始 */
  position : number;
  /** 排行榜总人数 */
  totalUser : number;
  /** 用户提交到排行榜的数值 */
  value? : number;
}
export class BeeInfoRespone {
  /** key-排行榜id，value-排行榜信息 */
  userLeaderboards? : {[k:string] : undefined};
  userData : BeeValue;
  appData : BeeValue;
}
export class BeeLoginResult {
  token : string;
  beeId : string;
  info : BeeInfoRespone;
  /** 如果用户被限制返回限制时间 */
  releaseTime? : string;
}
export class BeeLeaderboard {
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
}
export class BeeMail {
  /** 该用户唯一的邮件id */
  mailId : string;
  /** 创建日期 */
  createDate : string;
  /** 过期时间，过期后自动删除 */
  expires : string;
  /** 标题 */
  title : string;
  /** 内容 */
  content : string;
  /** 是否已读 */
  isRead : boolean;
}
export namespace LoginWithCustomId {
  /** 用唯一的自定义id登录，可以是设备id，idfa，gid等 */
  export class Request {
    customId : string;
    /** 如果用户不存在，是否自动创建账号 */
    createAccount? : boolean;
    infoRequest : BeeInfoRequest;
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
    result : BeeLoginResult;
    }
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
    result : BeeLoginResult;
    }
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
    result : BeeLoginResult;
    }
  }
export namespace LoginWithPlatform {
  /** 用第三方渠道的唯一识别码登录，微信，facebook, apple id, twitter等 */
  export class Request {
    platform : BeePlatformCode;
    /** 渠道code */
    code : string;
    /** 如果用户不存在，是否自动创建账号 */
    createAccount? : boolean;
    infoRequest : BeeInfoRequest;
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
    result : BeeLoginResult;
    }
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
    }
  }
export namespace SendPhoneAuthMesssage {
  /** 发送验证码到手机 */
  export class Request {
    phone : string;
  }
  /** 发送验证码到手机 */
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
    }
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
    }
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
    }
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
    }
  }
export namespace BindPlatform {
  /** 绑定facebook, 微信等平台 */
  export class Request {
    platform : BeePlatformCode;
    /** 渠道码 */
    code : string;
  }
  /** 是否成功 */
  export class Result {
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
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
    }
  }
export namespace GetUserData {
  /** 获取用户的存储数据 */
  export class Request {
    /** 传入key数组，如果key为空则返回用户所有的数据 */
    keys? : Array<string>;
    /** 获取指定用户的存储信息，不会传入则返回自己 */
    beeId? : string;
  }
  /** undefined */
  export class Result {
    userData : BeeValue;
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
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
    }
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
    }
  }
export namespace SetChannel {
  /** 设置渠道 */
  export class Request {
    channel : string;
  }
  /** undefined */
  export class Result {
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
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
    }
  }
export namespace UpdateLeaderboards {
  /** 更新用户排行榜记录，可以同时更新多个排行榜，key(排行榜id)-value(数值) */
  export class Request {
    /** key(排行榜id)-value(数值) */
    leaderboard : {[k:string] : number};
  }
  /** 成功 */
  export class Result {
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
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
    leaderboard : Array<BeeLeaderboard>;
    /** 排行榜更新的UTC时间，ISO 8601标准,YYYY-MM-DDTHH:MM:SSZ, 2020-12-25T12:00:00Z */
    nextReset : string;
    /** 当前排行榜的版本号 */
    version : number;
    /** 排行榜总人数 */
    totalUser : number;
    /** 我的排名，下标1开始 */
    position : number;
    /** 我的数值 */
    value : number;
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
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
    /** 我的排名，下标1开始算 */
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
    }
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
    }
  }
export namespace LogEvent {
  /** 事件上报 */
  export class Request {
    /** key:事件key, value:可以是对象、字符串、数组等可序列化的内容 */
    logData : {[k:string] : {
  }};
  }
  /** 成功 */
  export class Result {
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
  }
export namespace AddFriend {
  /** 添加好友 */
  export class Request {
    beeId : string;
  }
  /** 成功 */
  export class Result {
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
  }
export namespace DelFriend {
  /** 添加好友 */
  export class Request {
    beeId : string;
  }
  /** 成功 */
  export class Result {
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
  }
export namespace GetRandomUserList {
  /** 获取随机20个用户列表 */
  export class Request {
  }
  /** 获取随机20个用户列表 */
  export class Result {
    userList : Array<BeeFriend>;
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
  }
export namespace GetFriendList {
  /** 获取好友列表 */
  export class Request {
    /** 长度，默认30， Max 100 */
    maxResultsCount? : number;
  }
  /** 返回好友列表 */
  export class Result {
    friendList : Array<BeeFriend>;
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
  }
export namespace GetFriendLeaderboard {
  /** 获取好友排行榜信息 */
  export class Request {
    /** 排行榜id */
    key : string;
    /** 获取排行榜长度，默认30， Max 100 */
    maxResultsCount? : number;
    /** 获取指定版本号的排行榜，不输入则返回最新的排行版内容 */
    version? : number;
  }
  /** 返回排行榜信息 */
  export class Result {
    /** 排行榜topN的数组 */
    leaderboard : Array<BeeLeaderboard>;
    /** 排行榜更新的UTC时间，ISO 8601标准,YYYY-MM-DDTHH:MM:SSZ, 2020-12-25T12:00:00Z */
    nextReset : string;
    /** 当前排行榜的版本号 */
    version : number;
    /** 排行榜总人数 */
    totalUser : number;
    /** 我的排名，下标1开始 */
    position : number;
    /** 我的数值 */
    value : number;
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
  }
export namespace GetMailList {
  /** 获取邮件列表 */
  export class Request {
  }
  /** 获取邮件列表 */
  export class Result {
    mails : Array<BeeMail>;
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
  }
export namespace GetMail {
  /** 读取邮件 */
  export class Request {
    /** 邮件Id */
    mailId : string;
  }
  /** undefined */
  export class Result {
    mail : BeeMail;
  }
  export class Response extends BeeResponse {
    request : Request;
    result : Result;
    }
  }

	}

	export namespace client {
		/** bee初始化 */
		export function init(appId : string){
		  bee.sys.settings.appId = appId;
		  if(cc){
			cc.game.off(cc.game.EVENT_SHOW, bee.client.onFrontEnd, this);
			cc.game.off(cc.game.EVENT_HIDE, bee.client.onBackEnd, this);
			cc.game.on(cc.game.EVENT_SHOW, bee.client.onFrontEnd, this);
			cc.game.on(cc.game.EVENT_HIDE, bee.client.onBackEnd, this);
		  }
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
		  bee.client.logEvent({logData : { sys : 'back_end'}})
		}
		/** 记录游戏回到前台的事件，在cocos creator和unity会自动触发，不需要手动调用 */
		export function onFrontEnd(){
		  bee.client.logEvent({logData : { sys : 'front_end'}})
		}

		  //###########################
  /** 用唯一的自定义id登录，可以是设备id，idfa，gid等 */
  //###########################
  import LoginWithCustomId = bee.model.LoginWithCustomId;
  export function loginWithCustomId (
    request : LoginWithCustomId.Request,
    callBack?: (err:LoginWithCustomId.Response, res:LoginWithCustomId.Response) => void){
        return bee.sys.executeRequest<LoginWithCustomId.Response>("/loginWithCustomId", request, callBack);
  }
  //###########################
  /** 用邮箱和密码登录 */
  //###########################
  import LoginWithEmail = bee.model.LoginWithEmail;
  export function loginWithEmail (
    request : LoginWithEmail.Request,
    callBack?: (err:LoginWithEmail.Response, res:LoginWithEmail.Response) => void){
        return bee.sys.executeRequest<LoginWithEmail.Response>("/loginWithEmail", request, callBack);
  }
  //###########################
  /** 用手机号和密码(或验证码)登录 */
  //###########################
  import LoginWithPhone = bee.model.LoginWithPhone;
  export function loginWithPhone (
    request : LoginWithPhone.Request,
    callBack?: (err:LoginWithPhone.Response, res:LoginWithPhone.Response) => void){
        return bee.sys.executeRequest<LoginWithPhone.Response>("/loginWithPhone", request, callBack);
  }
  //###########################
  /** 用第三方渠道的唯一识别码登录，微信，facebook, apple id, twitter等 */
  //###########################
  import LoginWithPlatform = bee.model.LoginWithPlatform;
  export function loginWithPlatform (
    request : LoginWithPlatform.Request,
    callBack?: (err:LoginWithPlatform.Response, res:LoginWithPlatform.Response) => void){
        return bee.sys.executeRequest<LoginWithPlatform.Response>("/loginWithPlatform", request, callBack);
  }
  //###########################
  /** 发送重置邮件 */
  //###########################
  import SendRecoveryEmail = bee.model.SendRecoveryEmail;
  export function sendRecoveryEmail (
    request : SendRecoveryEmail.Request,
    callBack?: (err:SendRecoveryEmail.Response, res:SendRecoveryEmail.Response) => void){
        return bee.sys.executeRequest<SendRecoveryEmail.Response>("/sendRecoveryEmail", request, callBack);
  }
  //###########################
  /** 发送验证码到手机 */
  //###########################
  import SendPhoneAuthMesssage = bee.model.SendPhoneAuthMesssage;
  export function sendPhoneAuthMesssage (
    request : SendPhoneAuthMesssage.Request,
    callBack?: (err:SendPhoneAuthMesssage.Response, res:SendPhoneAuthMesssage.Response) => void){
        return bee.sys.executeRequest<SendPhoneAuthMesssage.Response>("/sendPhoneAuthMesssage", request, callBack);
  }
  //###########################
  /** 重置手机账号的密码 */
  //###########################
  import ResetPhonePassword = bee.model.ResetPhonePassword;
  export function resetPhonePassword (
    request : ResetPhonePassword.Request,
    callBack?: (err:ResetPhonePassword.Response, res:ResetPhonePassword.Response) => void){
        return bee.sys.executeRequest<ResetPhonePassword.Response>("/resetPhonePassword", request, callBack);
  }
  //###########################
  /** 绑定手机 */
  //###########################
  import BindPhone = bee.model.BindPhone;
  export function bindPhone (
    request : BindPhone.Request,
    callBack?: (err:BindPhone.Response, res:BindPhone.Response) => void){
        return bee.sys.executeRequest<BindPhone.Response>("/bindPhone", request, callBack);
  }
  //###########################
  /** 绑定邮箱 */
  //###########################
  import BindEmail = bee.model.BindEmail;
  export function bindEmail (
    request : BindEmail.Request,
    callBack?: (err:BindEmail.Response, res:BindEmail.Response) => void){
        return bee.sys.executeRequest<BindEmail.Response>("/bindEmail", request, callBack);
  }
  //###########################
  /** 绑定facebook, 微信等平台 */
  //###########################
  import BindPlatform = bee.model.BindPlatform;
  export function bindPlatform (
    request : BindPlatform.Request,
    callBack?: (err:BindPlatform.Response, res:BindPlatform.Response) => void){
        return bee.sys.executeRequest<BindPlatform.Response>("/bindPlatform", request, callBack);
  }
  //###########################
  /** 更新用户的存储数据 */
  //###########################
  import SetUserData = bee.model.SetUserData;
  export function setUserData (
    request : SetUserData.Request,
    callBack?: (err:SetUserData.Response, res:SetUserData.Response) => void){
        return bee.sys.executeRequest<SetUserData.Response>("/setUserData", request, callBack);
  }
  //###########################
  /** 获取用户的存储数据 */
  //###########################
  import GetUserData = bee.model.GetUserData;
  export function getUserData (
    request : GetUserData.Request,
    callBack?: (err:GetUserData.Response, res:GetUserData.Response) => void){
        return bee.sys.executeRequest<GetUserData.Response>("/getUserData", request, callBack);
  }
  //###########################
  /** 更新用户昵称 */
  //###########################
  import SetDisplayName = bee.model.SetDisplayName;
  export function setDisplayName (
    request : SetDisplayName.Request,
    callBack?: (err:SetDisplayName.Response, res:SetDisplayName.Response) => void){
        return bee.sys.executeRequest<SetDisplayName.Response>("/setDisplayName", request, callBack);
  }
  //###########################
  /** 更新用户头像地址 */
  //###########################
  import SetAvatarUrl = bee.model.SetAvatarUrl;
  export function setAvatarUrl (
    request : SetAvatarUrl.Request,
    callBack?: (err:SetAvatarUrl.Response, res:SetAvatarUrl.Response) => void){
        return bee.sys.executeRequest<SetAvatarUrl.Response>("/setAvatarUrl", request, callBack);
  }
  //###########################
  /** 设置渠道 */
  //###########################
  import SetChannel = bee.model.SetChannel;
  export function setChannel (
    request : SetChannel.Request,
    callBack?: (err:SetChannel.Response, res:SetChannel.Response) => void){
        return bee.sys.executeRequest<SetChannel.Response>("/setChannel", request, callBack);
  }
  //###########################
  /** 获取用户信息，如果不输入beeId则默认返回自己的信息 */
  //###########################
  import GetUserInfo = bee.model.GetUserInfo;
  export function getUserInfo (
    request : GetUserInfo.Request,
    callBack?: (err:GetUserInfo.Response, res:GetUserInfo.Response) => void){
        return bee.sys.executeRequest<GetUserInfo.Response>("/getUserInfo", request, callBack);
  }
  //###########################
  /** 更新用户排行榜记录，可以同时更新多个排行榜，key(排行榜id)-value(数值) */
  //###########################
  import UpdateLeaderboards = bee.model.UpdateLeaderboards;
  export function updateLeaderboards (
    request : UpdateLeaderboards.Request,
    callBack?: (err:UpdateLeaderboards.Response, res:UpdateLeaderboards.Response) => void){
        return bee.sys.executeRequest<UpdateLeaderboards.Response>("/updateLeaderboards", request, callBack);
  }
  //###########################
  /** 获取排行榜信息 */
  //###########################
  import GetLeaderboard = bee.model.GetLeaderboard;
  export function getLeaderboard (
    request : GetLeaderboard.Request,
    callBack?: (err:GetLeaderboard.Response, res:GetLeaderboard.Response) => void){
        return bee.sys.executeRequest<GetLeaderboard.Response>("/getLeaderboard", request, callBack);
  }
  //###########################
  /** 获取用户的排行榜信息 */
  //###########################
  import GetUserLeaderboard = bee.model.GetUserLeaderboard;
  export function getUserLeaderboard (
    request : GetUserLeaderboard.Request,
    callBack?: (err:GetUserLeaderboard.Response, res:GetUserLeaderboard.Response) => void){
        return bee.sys.executeRequest<GetUserLeaderboard.Response>("/getUserLeaderboard", request, callBack);
  }
  //###########################
  /** 获取后台App的存储数据 */
  //###########################
  import GetAppData = bee.model.GetAppData;
  export function getAppData (
    request : GetAppData.Request,
    callBack?: (err:GetAppData.Response, res:GetAppData.Response) => void){
        return bee.sys.executeRequest<GetAppData.Response>("/getAppData", request, callBack);
  }
  //###########################
  /** 事件上报 */
  //###########################
  import LogEvent = bee.model.LogEvent;
  export function logEvent (
    request : LogEvent.Request,
    callBack?: (err:LogEvent.Response, res:LogEvent.Response) => void){
        return bee.sys.executeRequest<LogEvent.Response>("/logEvent", request, callBack);
  }
  //###########################
  /** 添加好友 */
  //###########################
  import AddFriend = bee.model.AddFriend;
  export function addFriend (
    request : AddFriend.Request,
    callBack?: (err:AddFriend.Response, res:AddFriend.Response) => void){
        return bee.sys.executeRequest<AddFriend.Response>("/addFriend", request, callBack);
  }
  //###########################
  /** 添加好友 */
  //###########################
  import DelFriend = bee.model.DelFriend;
  export function delFriend (
    request : DelFriend.Request,
    callBack?: (err:DelFriend.Response, res:DelFriend.Response) => void){
        return bee.sys.executeRequest<DelFriend.Response>("/delFriend", request, callBack);
  }
  //###########################
  /** 获取随机20个用户列表 */
  //###########################
  import GetRandomUserList = bee.model.GetRandomUserList;
  export function getRandomUserList (
    request : GetRandomUserList.Request,
    callBack?: (err:GetRandomUserList.Response, res:GetRandomUserList.Response) => void){
        return bee.sys.executeRequest<GetRandomUserList.Response>("/getRandomUserList", request, callBack);
  }
  //###########################
  /** 获取好友列表 */
  //###########################
  import GetFriendList = bee.model.GetFriendList;
  export function getFriendList (
    request : GetFriendList.Request,
    callBack?: (err:GetFriendList.Response, res:GetFriendList.Response) => void){
        return bee.sys.executeRequest<GetFriendList.Response>("/getFriendList", request, callBack);
  }
  //###########################
  /** 获取好友排行榜信息 */
  //###########################
  import GetFriendLeaderboard = bee.model.GetFriendLeaderboard;
  export function getFriendLeaderboard (
    request : GetFriendLeaderboard.Request,
    callBack?: (err:GetFriendLeaderboard.Response, res:GetFriendLeaderboard.Response) => void){
        return bee.sys.executeRequest<GetFriendLeaderboard.Response>("/getFriendLeaderboard", request, callBack);
  }
  //###########################
  /** 获取邮件列表 */
  //###########################
  import GetMailList = bee.model.GetMailList;
  export function getMailList (
    request : GetMailList.Request,
    callBack?: (err:GetMailList.Response, res:GetMailList.Response) => void){
        return bee.sys.executeRequest<GetMailList.Response>("/getMailList", request, callBack);
  }
  //###########################
  /** 读取邮件 */
  //###########################
  import GetMail = bee.model.GetMail;
  export function getMail (
    request : GetMail.Request,
    callBack?: (err:GetMail.Response, res:GetMail.Response) => void){
        return bee.sys.executeRequest<GetMail.Response>("/getMail", request, callBack);
  }

	}



}

