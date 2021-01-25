# 数据读写

### setUserData

```typescript
//设置用户数据
bee.setUserData({
    userData : {
        "login_time" : 1,
        "save" : JSON.stringify({
            lv : 1,
            age : 10
        })}
});
```

## getUserData

```typescript
//读取用户数据
let res3 = await bee.getUserData({keys: ["login_time", "save"]});
const {login_time, save} = res3.result.userData;
console.log(login_time); //1
console.log(save); // {lv:1, age:10}
```



