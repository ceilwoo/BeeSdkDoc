# 日志上报

## logEvent
事件上报
```typescript
bee.client.logEvent({
    logData: {
        event: "看广告"
    }
});
```
Request
| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| logData | any | false | key:事件key, value:可以是对象、字符串、数组等可序列化的内容 |
