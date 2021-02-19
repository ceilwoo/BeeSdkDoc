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

## getUserLeaderboard

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

