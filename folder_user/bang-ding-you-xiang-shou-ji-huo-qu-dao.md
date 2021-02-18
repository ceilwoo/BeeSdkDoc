# 绑定邮箱、手机或平台

用于给用户绑定多种登录方式

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

## bindPhone
绑定后可以通过手机+验证码或者手机+密码登录bee
```typescript
bee.client.bindPhone({
    phone: "手机号码",
    code: "验证码"
},(err,res)=>{
    if(err){
        //绑定失败，打印失败信息
        console.log(res.message)
    } else {
        //绑定成功 
    }
});
```

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

