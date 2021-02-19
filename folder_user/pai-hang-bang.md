# 排行榜

## getLeaderboard

获取排行榜

```typescript
let res = await bee.client.getLeaderboard({
    key: "LEADERBOARD_ID_1",
    maxResultsCount: 30,
});
/* 
//// res 
 {
     code:200,
     message: success,
     request: {
         key: "LEADERBOARD_ID_1",
         maxResultsCount: 30,
     }
     result: {
        leaderboard: [...], //前30的排行榜
        totalUser: 120,   //排行榜总用户
        position: 10,     //我的排名
        value: 5000       //我的数值       
    }
}
*/
console.log(res.result);
```
Request:
| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| key | string | false | bee后台设置的排行榜id |
| maxResultsCount| number | true | 获取排行榜长度，默认10， Max 100 |
| version | number | true | 获取指定版本号的排行榜，不输入则返回最新的排行榜 |

Result:

| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| leaderboard | Array&lt;BeeLeaderboard&gt; | false | 排行榜topN的数组 |
| nextReset| string | false | 排行榜更新的UTC时间 |
| version | number | false | 当前排行榜的版本号 |
| totalUser | number | false | 排行榜总人数 |
| position | number | false | 我的排名，下标1开始 |
| value | number | false | 我的数值 |

## updateLeaderboards

提交分数到排行榜，可以支持同时提交多个

```typescript
bee.client.updateLeaderboards({
    leaderboards: {
        LEADERBOARD_ID_1: 200, //提交200的分数到排行榜1
        LEADERBOARD_ID_2: 300  //提交300的分数到排行榜2
    }
})
```
| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| leaderboard | {[k:string]:string}| false | key(排行榜id)-value(数值) |


## getUserLeaderboard
获取用户的排行榜信息
```typescript
let res = await bee.client.getUserLeaderboard({
    key : "LEADERBOARD_ID_1"
});
console.log(res.result)
```
Request:

| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| beeId | string | true | 获取某个玩家的信息，如果为空则默认请求自己的信息|
| key | string | false | bee后台设置的排行榜id |
| version | number | true | 指定版本号，不输入version则返回最新的排行榜 |

Result:

| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| beeId | string | false | 目标的beeId |
| version | number | false | 排行榜版本号 |
| position | number | false | 排名，下标1开始算 |
| totalUser | number | false | 排行榜总人数 |
| value | number | false | 数值 |
| avatarUrl | string | false | 用户头像地址 |
| displayName | string | false | 用户昵称 |

## getFriendLeaderboard

获取好友排行榜

```typescript
let res = await bee.client.getFriendLeaderboard({
    key: "LEADERBOARD_ID_1",
    maxResultsCount: 30,
});
/*
    {
        leaderboard: [...], //前30个好友的排名
        totalUser: 120,   //排行榜总用户
        position: 10,     //我的排名
        value: 5000       //我的数值
        
    }
*/
console.log(res.result);
```

Request:
| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| key | string | false | bee后台设置的排行榜id |
| maxResultsCount| number | true | 获取排行榜长度，默认10， Max 100 |
| version | number | true | 获取指定版本号的排行榜，不输入则返回最新的排行榜 |

Result:

| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| leaderboard | Array&lt;BeeLeaderboard&gt; | false | 排行榜topN的数组 |
| nextReset| string | false | 排行榜更新的UTC时间 |
| version | number | false | 当前排行榜的版本号 |
| totalUser | number | false | 排行榜总人数 |
| position | number | false | 我的排名，下标1开始 |
| value | number | false | 我的数值 |