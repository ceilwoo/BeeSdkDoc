# Cocos Creator使用简介

[下载](xia-zai-sdk.md) SDK后放在cocos creator项目的asset文件夹内的任意地方即可开始使用。

#### 引入typescript sdk

```typescript
import { bee } from "./BeeSdk";
```

#### 初始化SDK

```typescript
bee.init("APPID");
```

注册gamebee后在后台新建app，可以获得对应的appid

#### 代码约定

所有bee的方法都是小写开头驼峰式，与服务器通信的接口固定2个参数 requrest和 callback，返回 promise，同时支持callback和 promise，可按需调用。使用vscode等IDE可以获得详细的代码提示。

```typescript
//callback方式使用样例
bee.getUserData({keys:["login"]}, (err,res)=>{
    console.log(res.result);
});
```

```typescript
//promise方式使用样例
let res = await bee.getUserData({keys:["login"]});
console.log(res.result)
```

每个方法的请求和返回消息内容均定义在对应名字的命名空间内，如getUserData方法的request的声明在 GetUserData.Request, 返回消息的声明是 GetUserData.Response，如果返回code不是200，callback的err会不为空，同时给promise抛出reject\(\)，开发者可以在这里做异常处理。

```typescript
getUserData(request : GetUserData.Request, callBack?: (err:GetUserData.Response, res:GetUserData.Response)=>{}){}
```
