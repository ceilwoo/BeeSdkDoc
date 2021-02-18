# 登录

玩家需要登录后才能使用其他功能，bee提供了多种登录方式适配不同的使用场合。支持匿名登录和常用平台的服务端二次验证。

## loginWithCustomId

[API](https://app.swaggerhub.com/apis/BeeSDK/BeeClientSDK/1.0.0#/LoginWithCustomId)

用唯一的自定义id登录，可以是生成的随机字符串、设备id，idfa，gid等。主要用于匿名登录。

```typescript
//样例1 callback example
bee.client.loginWithCustomId({customId: "自定义ID"}, (err,res)=>{
    if(err){
        //登录失败
        console.log(err);
        return;
    }
    //登录成功，打印登录信息
    /*
    {
        code: 200,
        message: "success",
        callBackTimeMS: 100
        result: {
            beeId: "XXXX",
            token: "XXXX"
        }
    }
    */
    console.log(res.result);
})

//样例2 promise example
let res = await bee.client.loginWithCustomId({customId: "自定义ID"});
//登录成功，打印登录信息
console.log(res.result);



//样例3 登录并返回用户详细的信息
let res2 = await bee.client.loginWithCustomId({
    customId: "自定义ID",
    createAccount: true,
    infoRequest: {
        getUserLeaderboards: ["top_score"],
        getUserData: ["save","login_time"],
        getAppData: ["config", "configVer"]
    }});
const {userLeaderboards, userdata, appdata} = res2.result.info;
//玩家自己在top_score排行榜的信息
console.log(userLeaderboards);
//读取存储数据, 获取setUserData对应的值
console.log(userdata);
//app配置
console.log(appdata);
```

Request

| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| customId | string | false | 用唯一的自定义id登录 |
| createAccount | boolean | true | 如果用户不存在，是否自动创建账号，默认false |
| infoRequest | BeeInfoRequest | true | 登录时需要获取的详细内容 |

## loginWithEmail

用邮箱和密码登录

```typescript
//callback example
bee.client.loginWithEmail({
    email: "邮箱",
    password: "密码"
    createAccount: true
}, (err,res)=>{
    if(err){
        //登录失败
        console.log(err);
        return;
    }
    //登录成功，打印登录信息
    console.log(res.result);
})
```

Request

| 属性 | type | opational | desc |
| :--- | :--- | :--- | :--- |
| email | string | false | 邮箱 |
| password | string | false | 密码 |
| createAccount | string | true | 如果用户不存在，是否自动创建账号，默认false |
| infoRequest | BeeInfoRequest | true | 登录时需要获取的详细内容 |

## loginWithPhone

用手机+验证码登录 或者 手机+密码登录

```typescript
bee.client.loginWithPhone({
    phone: "13800138000",
    authCode: "123456"
}, (err,res)=>{
    if(err){
        //登录失败
        console.log(err);
        return;
    }
    //登录成功，打印登录信息
    console.log(res.result);
})
```

Request

| 属性 | type | opational | desc |
| :--- | :--- | :--- | :--- |
| phone | string | false | 邮箱 |
| authCode | string | false | 验证码 |
| password | string | true | 使用手机+密码登录时需要的密码 |
| createAccount | string | true | 如果用户不存在，是否自动创建账号，默认false |
| infoRequest | BeeInfoRequest | true | 登录时需要获取的详细内容 |

## loginWithPlatform

用第三方渠道的唯一识别码登录，微信，facebook, apple id, twitter等

```typescript
//微信小游戏登录
bee.client.loginWithPlatform({
    platform: bee.model.BeePlatformCode.WECHAT_GAME,
    code: "EXAMPLE_CODE_CODE_CODE_CODE_CODE", //使用微信login接口获得的code
    createAccount: true
}, (err,res)=>{
    if(err){
        //登录失败
        console.log(err);
        return;
    }
    //登录成功，打印登录信息
    console.log(res.result);
})
```

| 属性 | type | opational | desc |
| :--- | :--- | :--- | :--- |
| platform | BeePlatformCode | false | 平台的枚举 |
| code | string | false | 对应平台获得的code |
| createAccount | string | true | 如果用户不存在，是否自动创建账号，默认false |
| infoRequest | BeeInfoRequest | true | 登录时需要获取的详细内容 |

### 微信小游戏
使用前需要开发者在后台配置好微信小游戏的appid和密钥
```typescript
    wx.login({
        success: (res) => {
            bee.client.loginWithPlatform({
                platform: bee.model.BeePlatformCode.WECHAT_GAME,
                code: res.code
            }, (err,res)=>{
                if(err) return;
                console.log("登录成功");
            });
        },
        fail: (res) => { },
        complete: (res) => { }
    });
```
### QQ小游戏
使用前需要开发者在后台配置好QQ小游戏的appid和密钥
```typescript
    qq.login({
        success: (res) => {
            bee.client.loginWithPlatform({
                platform: bee.model.BeePlatformCode.QQ_GAME,
                code: res.code
            }, (err,res)=>{
                if(err) return;
                console.log("登录成功");
            });
        },
        fail: (res) => { },
        complete: (res) => { }
    });
```
## 登录返回

所有登录接口都返回相同的数据BeeLoginResult

#### Response

| 属性 | 类型 | desc |
| :--- | :--- | :--- |
| code | number | 状态码，正常返回是200 |
| message | string | 描叙，success或者错误描叙 |
| callBackTimeMS | string | 请求时长 |
| request | LoginWithCustomId.Request | 请求消息体 |
| result | BeeLoginResult | 返回消息体 |

#### BeeLoginResult

| 属性 | 类型 | desc |
| :--- | :--- | :--- |
| beeId | string | bee用户的唯一id |
| token | string | token，登录后用于bee客户端验证，一般情况下开发者不需要处理这个 |
| info | BeeInfoRespone | 用户信息 |

#### BeeInfoRespone

| 属性 | 类型 | desc |
| :--- | :--- | :--- |
| userLeaderboards | BeeUserLeaderboards | 用户的排行榜信息 |
| userData | {\[k:string\]:string} | 用户的存储信息 |
| appData | {\[k:string\]:string} | App的配置信息 |

#### BeePlatformCode (渠道代码)
* 100 - `APPLE` - 苹果
* 110 - `GOOGLE_PLAY` - google play
* 120 - `FACEBOOK` - facebook
* 121 - `FACEBOOK_GAME` - facebook 小游戏
* 130 - `WECHAT` - wechat
* 131 - `WECHAT_GAME` - 微信小游戏
* 140 - `QQ` - QQ
* 141 - `QQ_GAME` - QQ小游戏