# 设置头像

## setAvatarUrl

设置头像地址后，在好友列表、排行表、getUserInfo等接口可以获取到avatarUrl
bee只存储avatarUrl的字符串，具体视觉呈现逻辑需要开发者自行实现。

```typescript
//设置用户头像地址
bee.client.setAvatarUrl:({
    avatarUrl : "头像地址或id"
});
```