# 绑定邮箱、手机或平台

给用户绑定多种登录方式

## bindEmail
绑定后可以通过邮箱密码登录bee
```typescript
bee.client.bindEmail({
    email: "邮箱",
    password: "密码"
},(err,res)=>{
    if(err){
        //绑定失败，打印失败信息
        console.log(res.message)
    } else {
        //绑定成功 
    }
});
```
Request:
| 属性 | type | opational | desc |
| :--- | :--- | :--- | :--- |
| email | string | false | 邮箱 |
| password | string | false | 密码 |

## bindPhone
绑定后可以通过手机+验证码 (通过sendPhoneAuthMesssage获取) 或者手机+密码登录bee
```typescript
bee.client.bindPhone({
    phone: "手机号码",
    autoCode: "验证码", //手机+验证码
    password: "密码" //手机+密码
},(err,res)=>{
    if(err){
        //绑定失败，打印失败信息
        console.log(res.message)
    } else {
        //绑定成功 
    }
});
```
Request:
| 属性 | type | opational | desc |
| :--- | :--- | :--- | :--- |
| phone | string | false | 手机号码 |
| autoCode | string | true | 验证码，使用手机+验证码登录时使用 |
| password | string | true | 密码,使用手机+密码登录时使用|


## bindPlatform
绑定后可以通过渠道登录bee
```typescript
bee.client.bindPhone({
    platform: bee.model.BeePlatformCode.WECHAT_GAME,
    code: "渠道Code"
}, (err,res)=>{
    if(err){
        //绑定失败，打印失败信息
        console.log(res.message)
    } else {
        //绑定成功 
    }
});
```
Request:
| 属性 | type | opational | desc |
| :--- | :--- | :--- | :--- |
| platform | BeePlatformCode | false | 渠道枚举 |
| code | string | false | 从渠道获得的code |
