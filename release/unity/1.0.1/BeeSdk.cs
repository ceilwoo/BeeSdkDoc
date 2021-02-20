//****************************
// Bee SDK 1.0.1
// contact: support@beegame.io
// homepage: http://beegame.io
//****************************

using System;
using System.Text;
using System.Collections;
using System.Collections.Generic;

using UnityEngine;
using UnityEngine.Networking;

using bee;
using bee.model;

namespace bee {

    public static class sys {
        public static class settings {
          public static string appId = null;
          public static bool debug = false;
        }

        public static class internalSettings {
          public static string token = null;
          public static string sdkVersion = "1.0.0";
          public static string sdkPlatform = "typescript";
          public static string sdkPlatformVersion = "1.0.0";
          public static string productionServerUrl = "beeapi.taoqi001.com/client";
  
          public static string errorAppId = "Must be have bee.sys.settings.appId set to call this method";
          public static string errorLoggedIn = "Must be logged in to call this method";
          public static string errorEntityToken = "You must successfully call GetEntityToken before calling this";
        }

        public static BeeResponse<T1,T2> getResponse<T1,T2>(T1 request, UnityWebRequest uwr, long startTime) {
            var response = new BeeResponse<T1,T2>();
            var resMessage = uwr.downloadHandler.text;
            Debug.Log(resMessage);
            try {
                response = JsonUtility.FromJson<BeeResponse<T1,T2>>(resMessage);
            } catch {
                response.code = 503;
                response.message = resMessage;
            }
            response.callBackTimeMS = ((DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) / 10000000) - startTime;
            response.request = request;
            //Debug.Log(startTime);
            //Debug.Log(JsonUtility.ToJson(request));
            //Debug.Log(JsonUtility.ToJson(response));
            return response;
        }

        public static string getServerUrl(){
            if(string.IsNullOrEmpty(bee.sys.settings.appId)){
                Debug.Log(bee.sys.internalSettings.errorAppId);
                return "";
            }
            return string.Format($"https://{bee.sys.internalSettings.productionServerUrl}");
        }

        public static IEnumerator executeRequest<T1,T2>(string url, T1 request, Action<BeeResponse<T1,T2>> callback){
            bool isLogin = url.Contains("login");
            Debug.Log("url: " + url);
            var token = bee.sys.internalSettings.token;
            var sdkVersion = bee.sys.internalSettings.sdkVersion;
            var sdkPlatform = bee.sys.internalSettings.sdkPlatform;
            var sdkPlatformVersion = bee.sys.internalSettings.sdkPlatformVersion;

            if(string.IsNullOrEmpty(token) && !isLogin){
                throw new Exception(url + "/ " + bee.sys.internalSettings.errorLoggedIn);
            }

            long startTime = (DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) / 10000000;
            string requestBody = JsonUtility.ToJson(request);
            string completeUrl = getServerUrl()
                                    + url
                                    + $"?sdkPlatform={sdkPlatform}"
                                    + $"&sdkVersion={sdkVersion}"
                                    + $"sdkPlatformVersion=${sdkPlatformVersion}";

                       
            UnityWebRequest uwr = new UnityWebRequest(completeUrl, "POST");
            byte[] bodyRaw = Encoding.UTF8.GetBytes(requestBody);
            uwr.uploadHandler = (UploadHandler) new UploadHandlerRaw(bodyRaw);
            uwr.downloadHandler = (DownloadHandler) new DownloadHandlerBuffer();
            uwr.SetRequestHeader("Content-Type", "application/json");
            if(!string.IsNullOrEmpty(token)) uwr.SetRequestHeader("token", token);
            uwr.SetRequestHeader("appId", bee.sys.settings.appId);
            yield return uwr.SendWebRequest();

            var result = getResponse<T1,T2>(request, uwr, startTime);
            if (uwr.error != null){
                Debug.Log("Err: " + uwr.error);
            } else {
                Debug.Log("All OK");
                Debug.Log("Status Code: " + uwr.responseCode);
                Debug.Log(JsonUtility.ToJson(result));
                if(isLogin){
                    try {
                        dynamic t = ((dynamic)result.result).token;
                        if(!string.IsNullOrEmpty(t)) bee.sys.internalSettings.token = t;
                    } catch {}
                }
            }
            callback(result);
            yield return result;
        }
    }

    namespace model {
        [Serializable]
        public class BeeResponse <T1,T2> {
            public Int32 code;
            public string message;
            public long callBackTimeMS;
            public T1 request;
            public T2 result;
        }

[Serializable]
public enum BeeCode{
    /// <summary>
	/// 用户不存在
    /// </summary>
	NOT_EXISTS = 100,
    /// <summary>
	/// 用户被限制登录
    /// </summary>
	DISBAND = 101,
    /// <summary>
	/// 密码不对
    /// </summary>
	PASSWORD_NOT_RIGHT = 103,
    /// <summary>
	/// 验证码不正确
    /// </summary>
	AUTHCODE_NOT_RIGHT = 110,
    /// <summary>
	/// 渠道验证失败
    /// </summary>
	CHANNEL_AUTH_ERROR = 122,
    /// <summary>
	/// 正常返回
    /// </summary>
	OK = 200,
    /// <summary>
	/// 重复昵称，仅在App不允许重名的情况下返回
    /// </summary>
	DUPLICATION = 201,
    /// <summary>
	/// 字符串不合法
    /// </summary>
	ILLEGAL = 202,
    /// <summary>
	/// 超过长度限制(目前不返回，超长字符串会自动截断)
    /// </summary>
	OUT_OF_MAX_LENGTH = 203,
    /// <summary>
	/// 服务器异常
    /// </summary>
	SERVER_NOT_AVAILABLE = 503,
}
[Serializable]
public enum BeePlatformCode{
    /// <summary>
	/// 苹果
    /// </summary>
	APPLE = 100,
    /// <summary>
	/// google play
    /// </summary>
	GOOGLE_PLAY = 110,
    /// <summary>
	/// facebook
    /// </summary>
	FACEBOOK = 120,
    /// <summary>
	/// facebook 小游戏
    /// </summary>
	FACEBOOK_GAME = 121,
    /// <summary>
	/// wechat
    /// </summary>
	WECHAT = 130,
    /// <summary>
	/// 微信小游戏
    /// </summary>
	WECHAT_GAME = 131,
    /// <summary>
	/// QQ
    /// </summary>
	QQ = 140,
    /// <summary>
	/// QQ小游戏
    /// </summary>
	QQ_GAME = 141,
}
[Serializable]
public class BeeInfoRequest {
  /// <summary>
  /// 排行榜key的数组
  /// </summary>
  string[] getUserLeaderboards;
  /// <summary>
  /// 用户数据key的数组
  /// </summary>
  string[] getUserData;
  /// <summary>
  /// App数据key的数组
  /// </summary>
  string[] getAppData;
}
[Serializable]
public class BeeFriend {
  /// <summary>
  /// 用户的beeId
  /// </summary>
  string beeId;
  /// <summary>
  /// 用户昵称
  /// </summary>
  string displayName;
  /// <summary>
  /// 用户头像地址
  /// </summary>
  string avatarUrl;
}
[Serializable]
public class BeeUserLeaderboards {
  /// <summary>
  /// 排行榜当前的版本号
  /// </summary>
  int version;
  /// <summary>
  /// 排名，下标1开始
  /// </summary>
  int position;
  /// <summary>
  /// 排行榜总人数
  /// </summary>
  int totalUser;
  /// <summary>
  /// 用户提交到排行榜的数值
  /// </summary>
  int value;
}
[Serializable]
public class BeeInfoRespone {
  /// <summary>
  /// key-排行榜id，value-排行榜信息
  /// </summary>
  Dictionary<string, BeeUserLeaderboards> userLeaderboards;
  Dictionary<string, string> userData;
  Dictionary<string, string> appData;
}
[Serializable]
public class BeeLoginResult {
  string token;
  string beeId;
  BeeInfoRespone info;
  /// <summary>
  /// 如果用户被限制返回限制时间
  /// </summary>
  string releaseTime;
}
[Serializable]
public class BeeLeaderboard {
  /// <summary>
  /// 用户的beeId
  /// </summary>
  string beeId;
  /// <summary>
  /// 排名，下标1开始
  /// </summary>
  int position;
  /// <summary>
  /// 参与排名的数值
  /// </summary>
  int value;
  /// <summary>
  /// 用户昵称
  /// </summary>
  string displayName;
  /// <summary>
  /// 用户头像地址
  /// </summary>
  string avatarUrl;
}
[Serializable]
public class BeeMail {
  /// <summary>
  /// 该用户唯一的邮件id
  /// </summary>
  string mailId;
  /// <summary>
  /// 创建日期
  /// </summary>
  string createDate;
  /// <summary>
  /// 过期时间，过期后自动删除
  /// </summary>
  string expires;
  /// <summary>
  /// 标题
  /// </summary>
  string title;
  /// <summary>
  /// 内容
  /// </summary>
  string content;
  /// <summary>
  /// 是否已读
  /// </summary>
  bool isRead;
}
[Serializable]
public class LoginWithCustomId {
  /// <summary>
  /// 用唯一的自定义id登录，可以是设备id，idfa，gid等 
  /// </summary>
  public class Request {
    string customId;
    /// <summary>
    /// 如果用户不存在，是否自动创建账号
    /// </summary>
    bool createAccount;
    BeeInfoRequest infoRequest;
  }
public enum ErrorCode{
    /// <summary>
	/// 用户不存在
    /// </summary>
	NOT_EXISTS = 100,
    /// <summary>
	/// 用户被限制登录
    /// </summary>
	DISBAND = 101,
}
	public class Response : BeeResponse<Request, BeeLoginResult> {}
    }
[Serializable]
public class LoginWithEmail {
  /// <summary>
  /// 用邮箱和密码登录 
  /// </summary>
  public class Request {
    /// <summary>
    /// 邮箱
    /// </summary>
    string email;
    /// <summary>
    /// 密码
    /// </summary>
    string password;
    /// <summary>
    /// 如果用户不存在，是否自动创建账号
    /// </summary>
    bool createAccount;
    BeeInfoRequest infoRequest;
  }
public enum ErrorCode{
    /// <summary>
	/// 用户不存在
    /// </summary>
	NOT_EXISTS = 100,
    /// <summary>
	/// 用户被限制登录
    /// </summary>
	DISBAND = 101,
    /// <summary>
	/// 密码不对
    /// </summary>
	PASSWORD_NOT_RIGHT = 103,
}
	public class Response : BeeResponse<Request, BeeLoginResult> {}
    }
[Serializable]
public class LoginWithPhone {
  /// <summary>
  /// 用手机号和密码(或验证码)登录 
  /// </summary>
  public class Request {
    /// <summary>
    /// 手机号
    /// </summary>
    string phone;
    /// <summary>
    /// 使用手机+验证码登录
    /// </summary>
    string authCode;
    /// <summary>
    /// 使用手机+密码登录
    /// </summary>
    string password;
    /// <summary>
    /// 如果用户不存在，是否自动创建账号
    /// </summary>
    bool createAccount;
    BeeInfoRequest infoRequest;
  }
public enum ErrorCode{
    /// <summary>
	/// 用户不存在
    /// </summary>
	NOT_EXISTS = 100,
    /// <summary>
	/// 用户被限制登录
    /// </summary>
	DISBAND = 101,
    /// <summary>
	/// 密码不对
    /// </summary>
	PASSWORD_NOT_RIGHT = 103,
    /// <summary>
	/// 验证码不正确
    /// </summary>
	AUTHCODE_NOT_RIGHT = 110,
}
	public class Response : BeeResponse<Request, BeeLoginResult> {}
    }
[Serializable]
public class LoginWithPlatform {
  /// <summary>
  /// 用第三方渠道的唯一识别码登录，微信，facebook, apple id, twitter等 
  /// </summary>
  public class Request {
    BeePlatformCode platform;
    /// <summary>
    /// 渠道code
    /// </summary>
    string code;
    /// <summary>
    /// 如果用户不存在，是否自动创建账号
    /// </summary>
    bool createAccount;
    BeeInfoRequest infoRequest;
  }
public enum ErrorCode{
    /// <summary>
	/// 用户不存在
    /// </summary>
	NOT_EXISTS = 100,
    /// <summary>
	/// 用户被限制登录
    /// </summary>
	DISBAND = 101,
    /// <summary>
	/// 密码不对
    /// </summary>
	PASSWORD_NOT_RIGHT = 103,
    /// <summary>
	/// 验证码不正确
    /// </summary>
	AUTHCODE_NOT_RIGHT = 110,
    /// <summary>
	/// 渠道验证失败
    /// </summary>
	CHANNEL_AUTH_ERROR = 122,
}
	public class Response : BeeResponse<Request, BeeLoginResult> {}
    }
[Serializable]
public class SendRecoveryEmail {
  /// <summary>
  /// 发送重置邮件 
  /// </summary>
  public class Request {
    string email;
  }
  /// <summary>
  /// 返回发送邮件是否成功 
  /// </summary>
  public class Result {
  }
public enum ErrorCode{
    /// <summary>
	/// 用户不存在
    /// </summary>
	NOT_EXISTS = 100,
}
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class SendPhoneAuthMesssage {
  /// <summary>
  /// 发送验证码到手机 
  /// </summary>
  public class Request {
    string phone;
  }
  /// <summary>
  /// 发送验证码到手机 
  /// </summary>
  public class Result {
  }
public enum ErrorCode{
    /// <summary>
	/// 用户不存在
    /// </summary>
	NOT_EXISTS = 100,
}
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class ResetPhonePassword {
  /// <summary>
  /// 重置手机账号的密码 
  /// </summary>
  public class Request {
    /// <summary>
    /// 手机号码
    /// </summary>
    string phone;
    /// <summary>
    /// 需要重置为的密码
    /// </summary>
    string password;
    /// <summary>
    /// 手机收到的验证码
    /// </summary>
    string autoCode;
  }
  /// <summary>
  /// 返回重置手机账号的密码是否成功 
  /// </summary>
  public class Result {
  }
public enum ErrorCode{
    /// <summary>
	/// 用户不存在
    /// </summary>
	NOT_EXISTS = 100,
}
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class BindPhone {
  /// <summary>
  /// 绑定手机 
  /// </summary>
  public class Request {
    /// <summary>
    /// 手机号码
    /// </summary>
    string phone;
    /// <summary>
    /// 设置的密码
    /// </summary>
    string password;
    /// <summary>
    /// 手机收到的验证码
    /// </summary>
    string autoCode;
  }
  /// <summary>
  /// 是否成功 
  /// </summary>
  public class Result {
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class BindEmail {
  /// <summary>
  /// 绑定邮箱 
  /// </summary>
  public class Request {
    /// <summary>
    /// 邮箱
    /// </summary>
    string email;
    /// <summary>
    /// 密码
    /// </summary>
    string password;
  }
  /// <summary>
  /// 是否成功 
  /// </summary>
  public class Result {
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class BindPlatform {
  /// <summary>
  /// 绑定facebook, 微信等平台 
  /// </summary>
  public class Request {
    BeePlatformCode platform;
    /// <summary>
    /// 渠道码
    /// </summary>
    string code;
  }
  /// <summary>
  /// 是否成功 
  /// </summary>
  public class Result {
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class SetUserData {
  /// <summary>
  /// 更新用户的存储数据 
  /// </summary>
  public class Request {
    /// <summary>
    /// key value型
    /// </summary>
    Dictionary<string, string> userData;
  }
  /// <summary>
  /// undefined 
  /// </summary>
  public class Result {
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class GetUserData {
  /// <summary>
  /// 获取用户的存储数据 
  /// </summary>
  public class Request {
    /// <summary>
    /// 传入key数组，如果key为空则返回用户所有的数据
    /// </summary>
    string[] keys;
    /// <summary>
    /// 获取指定用户的存储信息，不会传入则返回自己
    /// </summary>
    string beeId;
  }
  /// <summary>
  /// undefined 
  /// </summary>
  public class Result {
    Dictionary<string, string> userData;
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class SetDisplayName {
  /// <summary>
  /// 更新用户昵称 
  /// </summary>
  public class Request {
    /// <summary>
    /// 昵称不大于30字
    /// </summary>
    string displayName;
  }
  /// <summary>
  /// undefined 
  /// </summary>
  public class Result {
  }
public enum ErrorCode{
    /// <summary>
	/// 重复昵称，仅在App不允许重名的情况下返回
    /// </summary>
	DUPLICATION = 201,
    /// <summary>
	/// 字符串不合法
    /// </summary>
	ILLEGAL = 202,
    /// <summary>
	/// 超过长度限制(目前不返回，超长字符串会自动截断)
    /// </summary>
	OUT_OF_MAX_LENGTH = 203,
}
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class SetAvatarUrl {
  /// <summary>
  /// 更新用户头像地址 
  /// </summary>
  public class Request {
    string avatarUrl;
  }
  /// <summary>
  /// undefined 
  /// </summary>
  public class Result {
  }
public enum ErrorCode{
    /// <summary>
	/// 字符串不合法
    /// </summary>
	ILLEGAL = 202,
    /// <summary>
	/// 超过长度限制(目前不返回，超长字符串会自动截断)
    /// </summary>
	OUT_OF_MAX_LENGTH = 203,
}
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class SetChannel {
  /// <summary>
  /// 设置渠道 
  /// </summary>
  public class Request {
    string channel;
  }
  /// <summary>
  /// undefined 
  /// </summary>
  public class Result {
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class GetUserInfo {
  /// <summary>
  /// 获取用户信息，如果不输入beeId则默认返回自己的信息 
  /// </summary>
  public class Request {
    string beeId;
    BeeInfoRequest infoRequest;
  }
  /// <summary>
  /// undefined 
  /// </summary>
  public class Result {
    /// <summary>
    /// 用户头像地址
    /// </summary>
    string avatarUrl;
    /// <summary>
    /// 用户昵称
    /// </summary>
    string displayName;
    BeeInfoRespone info;
  }
public enum ErrorCode{
    /// <summary>
	/// 用户不存在
    /// </summary>
	NOT_EXISTS = 100,
}
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class UpdateLeaderboards {
  /// <summary>
  /// 更新用户排行榜记录，可以同时更新多个排行榜，key(排行榜id)-value(数值) 
  /// </summary>
  public class Request {
    /// <summary>
    /// key(排行榜id)-value(数值)
    /// </summary>
    Dictionary<string, int> leaderboard;
  }
  /// <summary>
  /// 成功 
  /// </summary>
  public class Result {
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class GetLeaderboard {
  /// <summary>
  /// 获取排行榜信息 
  /// </summary>
  public class Request {
    /// <summary>
    /// 排行榜id
    /// </summary>
    string key;
    /// <summary>
    /// 获取排行榜长度，默认10， Max 100
    /// </summary>
    int maxResultsCount;
    /// <summary>
    /// 获取指定版本号的排行榜，不输入则返回最新的排行版内容
    /// </summary>
    int version;
  }
  /// <summary>
  /// 返回排行榜信息 
  /// </summary>
  public class Result {
    /// <summary>
    /// 排行榜topN的数组
    /// </summary>
    BeeLeaderboard[] leaderboard;
    /// <summary>
    /// 排行榜更新的UTC时间，ISO 8601标准,YYYY-MM-DDTHH:MM:SSZ, 2020-12-25T12:00:00Z
    /// </summary>
    string nextReset;
    /// <summary>
    /// 当前排行榜的版本号
    /// </summary>
    int version;
    /// <summary>
    /// 排行榜总人数
    /// </summary>
    int totalUser;
    /// <summary>
    /// 我的排名，下标1开始
    /// </summary>
    int position;
    /// <summary>
    /// 我的数值
    /// </summary>
    int value;
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class GetUserLeaderboard {
  /// <summary>
  /// 获取用户的排行榜信息 
  /// </summary>
  public class Request {
    /// <summary>
    /// 获取某个玩家的信息，如果为空则默认请求自己的信息
    /// </summary>
    string beeId;
    /// <summary>
    /// 排行榜key
    /// </summary>
    string key;
    /// <summary>
    /// 指定版本号，不输入version则返回最新的排行榜
    /// </summary>
    int version;
  }
  /// <summary>
  /// 返回在排行榜的排名和数据 
  /// </summary>
  public class Result {
    /// <summary>
    /// 目标的beeId
    /// </summary>
    string beeId;
    /// <summary>
    /// 排行榜版本号
    /// </summary>
    int version;
    /// <summary>
    /// 我的排名，下标1开始算
    /// </summary>
    int position;
    /// <summary>
    /// 排行榜总人数
    /// </summary>
    int totalUser;
    /// <summary>
    /// 数值
    /// </summary>
    int value;
    /// <summary>
    /// 用户头像地址
    /// </summary>
    string avatarUrl;
    /// <summary>
    /// 用户昵称
    /// </summary>
    string displayName;
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class GetAppData {
  /// <summary>
  /// 获取后台App的存储数据 
  /// </summary>
  public class Request {
    /// <summary>
    /// 存储数据的key数组，支持获取多个，如果不输入keys则返回app的所有存储数据
    /// </summary>
    string[] keys;
  }
  /// <summary>
  /// 根据keys返回后台app的存储数据 
  /// </summary>
  public class Result {
    Dictionary<string, string> appData;
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class LogEvent {
  /// <summary>
  /// 事件上报 
  /// </summary>
  public class Request {
    /// <summary>
    /// key:事件key, value:可以是对象、字符串、数组等可序列化的内容
    /// </summary>
    Dictionary<string, object> logData;
  }
  /// <summary>
  /// 成功 
  /// </summary>
  public class Result {
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class AddFriend {
  /// <summary>
  /// 添加好友 
  /// </summary>
  public class Request {
    string beeId;
  }
  /// <summary>
  /// 成功 
  /// </summary>
  public class Result {
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class DelFriend {
  /// <summary>
  /// 添加好友 
  /// </summary>
  public class Request {
    string beeId;
  }
  /// <summary>
  /// 成功 
  /// </summary>
  public class Result {
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class GetRandomUserList {
  /// <summary>
  /// 获取随机20个用户列表 
  /// </summary>
  public class Request {
  }
  /// <summary>
  /// 获取随机20个用户列表 
  /// </summary>
  public class Result {
    BeeFriend[] userList;
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class GetFriendList {
  /// <summary>
  /// 获取好友列表 
  /// </summary>
  public class Request {
    /// <summary>
    /// 长度，默认30， Max 100
    /// </summary>
    int maxResultsCount;
  }
  /// <summary>
  /// 返回好友列表 
  /// </summary>
  public class Result {
    BeeFriend[] friendList;
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class GetFriendLeaderboard {
  /// <summary>
  /// 获取好友排行榜信息 
  /// </summary>
  public class Request {
    /// <summary>
    /// 排行榜id
    /// </summary>
    string key;
    /// <summary>
    /// 获取排行榜长度，默认30， Max 100
    /// </summary>
    int maxResultsCount;
    /// <summary>
    /// 获取指定版本号的排行榜，不输入则返回最新的排行版内容
    /// </summary>
    int version;
  }
  /// <summary>
  /// 返回排行榜信息 
  /// </summary>
  public class Result {
    /// <summary>
    /// 排行榜topN的数组
    /// </summary>
    BeeLeaderboard[] leaderboard;
    /// <summary>
    /// 排行榜更新的UTC时间，ISO 8601标准,YYYY-MM-DDTHH:MM:SSZ, 2020-12-25T12:00:00Z
    /// </summary>
    string nextReset;
    /// <summary>
    /// 当前排行榜的版本号
    /// </summary>
    int version;
    /// <summary>
    /// 排行榜总人数
    /// </summary>
    int totalUser;
    /// <summary>
    /// 我的排名，下标1开始
    /// </summary>
    int position;
    /// <summary>
    /// 我的数值
    /// </summary>
    int value;
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class GetMailList {
  /// <summary>
  /// 获取邮件列表 
  /// </summary>
  public class Request {
  }
  /// <summary>
  /// 获取邮件列表 
  /// </summary>
  public class Result {
    BeeMail[] mails;
  }
	public class Response : BeeResponse<Request, Result> {}
    }
[Serializable]
public class GetMail {
  /// <summary>
  /// 读取邮件 
  /// </summary>
  public class Request {
    /// <summary>
    /// 邮件Id
    /// </summary>
    string mailId;
  }
  /// <summary>
  /// undefined 
  /// </summary>
  public class Result {
    BeeMail mail;
  }
	public class Response : BeeResponse<Request, Result> {}
    }


    }


    public static class client {
        public static void init(string appId) {
            bee.sys.settings.appId = appId;
        }

    /// <summary>
    /// 用唯一的自定义id登录，可以是设备id，idfa，gid等
    /// </summary>
        public static IEnumerator loginWithCustomId(LoginWithCustomId.Request request, Action<BeeResponse<LoginWithCustomId.Request, BeeLoginResult>> callback){
            yield return sys.executeRequest<LoginWithCustomId.Request, BeeLoginResult>("/loginWithCustomId", request, callback);
		 }
    /// <summary>
    /// 用邮箱和密码登录
    /// </summary>
        public static IEnumerator loginWithEmail(LoginWithEmail.Request request, Action<BeeResponse<LoginWithEmail.Request, BeeLoginResult>> callback){
            yield return sys.executeRequest<LoginWithEmail.Request, BeeLoginResult>("/loginWithEmail", request, callback);
		 }
    /// <summary>
    /// 用手机号和密码(或验证码)登录
    /// </summary>
        public static IEnumerator loginWithPhone(LoginWithPhone.Request request, Action<BeeResponse<LoginWithPhone.Request, BeeLoginResult>> callback){
            yield return sys.executeRequest<LoginWithPhone.Request, BeeLoginResult>("/loginWithPhone", request, callback);
		 }
    /// <summary>
    /// 用第三方渠道的唯一识别码登录，微信，facebook, apple id, twitter等
    /// </summary>
        public static IEnumerator loginWithPlatform(LoginWithPlatform.Request request, Action<BeeResponse<LoginWithPlatform.Request, BeeLoginResult>> callback){
            yield return sys.executeRequest<LoginWithPlatform.Request, BeeLoginResult>("/loginWithPlatform", request, callback);
		 }
    /// <summary>
    /// 发送重置邮件
    /// </summary>
        public static IEnumerator sendRecoveryEmail(SendRecoveryEmail.Request request, Action<BeeResponse<SendRecoveryEmail.Request, SendRecoveryEmail.Result>> callback){
            yield return sys.executeRequest<SendRecoveryEmail.Request, SendRecoveryEmail.Result>("/sendRecoveryEmail", request, callback);
		 }
    /// <summary>
    /// 发送验证码到手机
    /// </summary>
        public static IEnumerator sendPhoneAuthMesssage(SendPhoneAuthMesssage.Request request, Action<BeeResponse<SendPhoneAuthMesssage.Request, SendPhoneAuthMesssage.Result>> callback){
            yield return sys.executeRequest<SendPhoneAuthMesssage.Request, SendPhoneAuthMesssage.Result>("/sendPhoneAuthMesssage", request, callback);
		 }
    /// <summary>
    /// 重置手机账号的密码
    /// </summary>
        public static IEnumerator resetPhonePassword(ResetPhonePassword.Request request, Action<BeeResponse<ResetPhonePassword.Request, ResetPhonePassword.Result>> callback){
            yield return sys.executeRequest<ResetPhonePassword.Request, ResetPhonePassword.Result>("/resetPhonePassword", request, callback);
		 }
    /// <summary>
    /// 绑定手机
    /// </summary>
        public static IEnumerator bindPhone(BindPhone.Request request, Action<BeeResponse<BindPhone.Request, BindPhone.Result>> callback){
            yield return sys.executeRequest<BindPhone.Request, BindPhone.Result>("/bindPhone", request, callback);
		 }
    /// <summary>
    /// 绑定邮箱
    /// </summary>
        public static IEnumerator bindEmail(BindEmail.Request request, Action<BeeResponse<BindEmail.Request, BindEmail.Result>> callback){
            yield return sys.executeRequest<BindEmail.Request, BindEmail.Result>("/bindEmail", request, callback);
		 }
    /// <summary>
    /// 绑定facebook, 微信等平台
    /// </summary>
        public static IEnumerator bindPlatform(BindPlatform.Request request, Action<BeeResponse<BindPlatform.Request, BindPlatform.Result>> callback){
            yield return sys.executeRequest<BindPlatform.Request, BindPlatform.Result>("/bindPlatform", request, callback);
		 }
    /// <summary>
    /// 更新用户的存储数据
    /// </summary>
        public static IEnumerator setUserData(SetUserData.Request request, Action<BeeResponse<SetUserData.Request, SetUserData.Result>> callback){
            yield return sys.executeRequest<SetUserData.Request, SetUserData.Result>("/setUserData", request, callback);
		 }
    /// <summary>
    /// 获取用户的存储数据
    /// </summary>
        public static IEnumerator getUserData(GetUserData.Request request, Action<BeeResponse<GetUserData.Request, GetUserData.Result>> callback){
            yield return sys.executeRequest<GetUserData.Request, GetUserData.Result>("/getUserData", request, callback);
		 }
    /// <summary>
    /// 更新用户昵称
    /// </summary>
        public static IEnumerator setDisplayName(SetDisplayName.Request request, Action<BeeResponse<SetDisplayName.Request, SetDisplayName.Result>> callback){
            yield return sys.executeRequest<SetDisplayName.Request, SetDisplayName.Result>("/setDisplayName", request, callback);
		 }
    /// <summary>
    /// 更新用户头像地址
    /// </summary>
        public static IEnumerator setAvatarUrl(SetAvatarUrl.Request request, Action<BeeResponse<SetAvatarUrl.Request, SetAvatarUrl.Result>> callback){
            yield return sys.executeRequest<SetAvatarUrl.Request, SetAvatarUrl.Result>("/setAvatarUrl", request, callback);
		 }
    /// <summary>
    /// 设置渠道
    /// </summary>
        public static IEnumerator setChannel(SetChannel.Request request, Action<BeeResponse<SetChannel.Request, SetChannel.Result>> callback){
            yield return sys.executeRequest<SetChannel.Request, SetChannel.Result>("/setChannel", request, callback);
		 }
    /// <summary>
    /// 获取用户信息，如果不输入beeId则默认返回自己的信息
    /// </summary>
        public static IEnumerator getUserInfo(GetUserInfo.Request request, Action<BeeResponse<GetUserInfo.Request, GetUserInfo.Result>> callback){
            yield return sys.executeRequest<GetUserInfo.Request, GetUserInfo.Result>("/getUserInfo", request, callback);
		 }
    /// <summary>
    /// 更新用户排行榜记录，可以同时更新多个排行榜，key(排行榜id)-value(数值)
    /// </summary>
        public static IEnumerator updateLeaderboards(UpdateLeaderboards.Request request, Action<BeeResponse<UpdateLeaderboards.Request, UpdateLeaderboards.Result>> callback){
            yield return sys.executeRequest<UpdateLeaderboards.Request, UpdateLeaderboards.Result>("/updateLeaderboards", request, callback);
		 }
    /// <summary>
    /// 获取排行榜信息
    /// </summary>
        public static IEnumerator getLeaderboard(GetLeaderboard.Request request, Action<BeeResponse<GetLeaderboard.Request, GetLeaderboard.Result>> callback){
            yield return sys.executeRequest<GetLeaderboard.Request, GetLeaderboard.Result>("/getLeaderboard", request, callback);
		 }
    /// <summary>
    /// 获取用户的排行榜信息
    /// </summary>
        public static IEnumerator getUserLeaderboard(GetUserLeaderboard.Request request, Action<BeeResponse<GetUserLeaderboard.Request, GetUserLeaderboard.Result>> callback){
            yield return sys.executeRequest<GetUserLeaderboard.Request, GetUserLeaderboard.Result>("/getUserLeaderboard", request, callback);
		 }
    /// <summary>
    /// 获取后台App的存储数据
    /// </summary>
        public static IEnumerator getAppData(GetAppData.Request request, Action<BeeResponse<GetAppData.Request, GetAppData.Result>> callback){
            yield return sys.executeRequest<GetAppData.Request, GetAppData.Result>("/getAppData", request, callback);
		 }
    /// <summary>
    /// 事件上报
    /// </summary>
        public static IEnumerator logEvent(LogEvent.Request request, Action<BeeResponse<LogEvent.Request, LogEvent.Result>> callback){
            yield return sys.executeRequest<LogEvent.Request, LogEvent.Result>("/logEvent", request, callback);
		 }
    /// <summary>
    /// 添加好友
    /// </summary>
        public static IEnumerator addFriend(AddFriend.Request request, Action<BeeResponse<AddFriend.Request, AddFriend.Result>> callback){
            yield return sys.executeRequest<AddFriend.Request, AddFriend.Result>("/addFriend", request, callback);
		 }
    /// <summary>
    /// 添加好友
    /// </summary>
        public static IEnumerator delFriend(DelFriend.Request request, Action<BeeResponse<DelFriend.Request, DelFriend.Result>> callback){
            yield return sys.executeRequest<DelFriend.Request, DelFriend.Result>("/delFriend", request, callback);
		 }
    /// <summary>
    /// 获取随机20个用户列表
    /// </summary>
        public static IEnumerator getRandomUserList(GetRandomUserList.Request request, Action<BeeResponse<GetRandomUserList.Request, GetRandomUserList.Result>> callback){
            yield return sys.executeRequest<GetRandomUserList.Request, GetRandomUserList.Result>("/getRandomUserList", request, callback);
		 }
    /// <summary>
    /// 获取好友列表
    /// </summary>
        public static IEnumerator getFriendList(GetFriendList.Request request, Action<BeeResponse<GetFriendList.Request, GetFriendList.Result>> callback){
            yield return sys.executeRequest<GetFriendList.Request, GetFriendList.Result>("/getFriendList", request, callback);
		 }
    /// <summary>
    /// 获取好友排行榜信息
    /// </summary>
        public static IEnumerator getFriendLeaderboard(GetFriendLeaderboard.Request request, Action<BeeResponse<GetFriendLeaderboard.Request, GetFriendLeaderboard.Result>> callback){
            yield return sys.executeRequest<GetFriendLeaderboard.Request, GetFriendLeaderboard.Result>("/getFriendLeaderboard", request, callback);
		 }
    /// <summary>
    /// 获取邮件列表
    /// </summary>
        public static IEnumerator getMailList(GetMailList.Request request, Action<BeeResponse<GetMailList.Request, GetMailList.Result>> callback){
            yield return sys.executeRequest<GetMailList.Request, GetMailList.Result>("/getMailList", request, callback);
		 }
    /// <summary>
    /// 读取邮件
    /// </summary>
        public static IEnumerator getMail(GetMail.Request request, Action<BeeResponse<GetMail.Request, GetMail.Result>> callback){
            yield return sys.executeRequest<GetMail.Request, GetMail.Result>("/getMail", request, callback);
		 }



    }



}
