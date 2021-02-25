# 忘记密码

## sendRecoveryEmail

重置邮箱账号的密码

```typescript
bee.client.sendRecoveryEmail({
    email: "邮件地址"
});
```

## sendPhoneAuthMesssage

发送验证码到手机

```typescript
bee.client.sendPhoneAuthMesssage({
    phone: "手机号"
});
```

## resetPhonePassword

重置手机账号的密码

```typescript
bee.client.resetPhonePassword({
    phone: "手机号",
    password: "需要重置为的密码",
    autoCode: "手机收到的验证码"
});
```

