# 设置头像和昵称

设置头像地址和昵称后，在好友列表、排行表、getUserInfo等接口可以获取到avatarUrl和displayName

 bee只存储字符串，具体视觉呈现逻辑需要开发者自行实现。

## setAvatarUrl

```typescript
//设置用户头像地址
bee.client.setAvatarUrl:({
    avatarUrl : "头像地址或id"
});
```

## setDisplayName

```typescript
//设置用户昵称
bee.client.setDisplayName:({
    displayName : "玩家1"
});
```

