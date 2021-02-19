# 用户资料

## getUserInfo
获取用户信息，如果不输入beeId则默认返回自己的信息
跟登录接口一样可以通过infoRequest获得更多详细信息
```typescript
let res = await bee.client.getUserInfo({
    beeId : "BEE_ID",
    infoRequest: {
        getUserLeaderboards: ["top_score"],
        getUserData: ["save","login_time"]
    }
});
const {userLeaderboards, userdata, appdata} = res.result.info;
//玩家在top_score排行榜的信息
console.log(userLeaderboards);
//读取存储数据
console.log(userdata);
```