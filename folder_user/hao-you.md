# 好友

## addFriend
添加好友，添加后会自动成为对方的好友。
```typescript
bee.client.addFriend({
    beeId : "BEE_ID"
}, (err,res)=>{
    if(!err) console.log("添加成功");
})
```
Request
| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| beeId | string | false | 目标的beeId |

## removeFriend
删除好友
```typescript
bee.client.removeFriend({
    beeId : "BEE_ID"
}, (err,res)=>{
    if(!err) console.log("删除成功成功");
})
```
Request
| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| beeId | string | false | 目标的beeId |

## getFriendList
获取好友列表
```typescript
let res = bee.client.getFriendList({});
console.log(res.result.friendList);
```
Request
| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
|maxResultsCount|number|true|长度，默认30， Max 100|

Result
| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
|friendList|Array&lt;BeeFriend&gt;|false|好友列表|


## getRandomUserList
获取随机20个用户列表
```typescript
let res = bee.client.getRandomUserList({});
console.log(res.result.userList);
```

Request
| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
|不需要额外参数

Result
| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
|userList|Array&lt;BeeFriend&gt;|false|好友列表|

## 备注：
BeeFriend
| 属性 | 类型 | optional | desc |
| :--- | :--- | :--- | :--- |
| beeId | string | false | 目标的beeId |
| avatarUrl | string | false | 用户头像地址 |
| displayName | string | false | 用户昵称 |
