# Demo

## demo.ts

```typescript
import { bee } from "./BeeSdk";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ServerBee extends cc.Component {

    start(){
        this.beeTest();
    }

    async beeTest(){
        //初始化sdk
        bee.client.init("BCEY8VETSA");
        //登录bee
        try {
            let login = await bee.client.loginWithCustomId({
                customId: "自定义ID", createAccount: true,
            });
            console.log("登录成功");
        } catch (e : bee.model.LoginWithCustomId.Response) {
            //登录异常
            console.log(e);
            return;
        }
        
        //设置用户数据
        bee.client.setUserData({
            userData : {
                "login_time" : 1,
                "save" : JSON.stringify({
                    lv : 1,
                    age : 10
                })}
        });
        
        //设置用户昵称
        bee.client.setUserDisplayName:({
            displayName : "玩家1"
        });
        
        //读取用户数据
        let res3 = await bee.client.getUserData({keys: ["login_time", "save"]});
        const {login_time, save} = res3.result.userData;
        console.log(login_time); //1
        console.log(save); // {lv:1, age:10}
        
        
    }
}
```

