# 数据读写

## setUserData

```typescript
//设置用户数据
bee.client.setUserData({
    userData : {
        "login_time" : 1,
        "save" : JSON.stringify({
            lv : 1,
            age : 10
        })}
});
```

Request

| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| userData | {\[k:string\]:string} | false | 写入用户的存储数据，一个key对应一条数据，可同时写入多条 |

## getUserData

```typescript
//读取用户数据
let res3 = await bee.client.getUserData({keys: ["login_time", "save"]});
const {login_time, save} = res3.result.userData;
console.log(login_time); //1
console.log(save); // {lv:1, age:10}
```

Request:

| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| keys | Array | false | 根据key读取用户数据，如果key为空数组则返回用户所有存在的数据 |

Result:

| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| userData | {\[k:string\]:string} | false | 用户数据 |

