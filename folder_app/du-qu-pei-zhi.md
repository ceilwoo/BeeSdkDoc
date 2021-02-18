# 读取配置

## getAppData

读取APP配置。用户可以在后台设置key value型配置，在sdk通过key读取对应的值。

```typescript
//读取APP配置
let res = await bee.client.getAppData({
    keys: ["config", "config_ver"]
});
const {config, config_ver} = res3.result.appData;
console.log(config); //输出后台配置的config的值
console.log(config_ver);
```

Request:

| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| keys | Array<string> | false |  |

Result:

| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| appData | {\[k:string\]:string} | false | App配置 |
