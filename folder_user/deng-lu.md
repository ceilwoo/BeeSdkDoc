# 登录

玩家需要登录后才能使用其他功能，bee提供了多种登录方式适配不同的场合和渠道。

## loginWithCustomId

用唯一的自定义id登录，可以是设备id，idfa，gid等。用于匿名登录。

```typescript
//样例1 callback example
bee.client.loginWithCustomId({customId: "自定义ID"}, (err,res)=>{
    if(err){
        //登录失败
        console.log(err);
        return;
    }
    //登录成功，打印登录信息
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

[Request](https://app.swaggerhub.com/apis/BeeSDK/BeeClientSDK/1.0.0) 

| 属性 | type | optional | desc |
| :--- | :--- | :--- | :--- |
| customId | string | false | 用唯一的自定义id登录 |
| createAccount | boolean | true | 如果用户不存在，是否自动创建账号，默认false |
| [infoRequest](https://app.swaggerhub.com/apis/BeeSDK/BeeClientSDK/1.0.0#/BeeInfoRespone) | BeeInfoRequest | true | 登录时需要获取的详细内容 |

[Response](https://app.swaggerhub.com/apis/BeeSDK/BeeClientSDK/1.0.0#/LoginWithCustomId) 

| 属性 | type | desc |
| :--- | :--- | :--- |
| [code](https://app.swaggerhub.com/apis/BeeSDK/BeeClientSDK/1.0.0#/BeeCode) | number | 状态码，正常返回是200 |
| message | string | 描叙，success或者错误描叙 |
| callBackTimeMS | string | 请求时长 |
| [request](https://app.swaggerhub.com/apis/BeeSDK/BeeClientSDK/1.0.0) | Request | 请求消息体 |
| [result](https://app.swaggerhub.com/apis/BeeSDK/BeeClientSDK/1.0.0) | Result | 返回消息体 |

&gt;&gt; [数据结构](https://app.swaggerhub.com/apis/BeeSDK/BeeClientSDK/1.0.0#/LoginWithCustomId)

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

## loginWithPlatform

