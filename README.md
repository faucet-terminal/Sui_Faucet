# 领取 sui faucet 

- 1.backend api in main branch

```json5
//POST http://localhost:6002/sui/request
//Content-Type: application/json
{
"network": "testnet",      // 网络环境
"address": "your address", // 地址
//"amount": "1111"         // 金额，sui rpc 固定 1 sui,因此该不支持自定义amount
}
```
- 2.frontend  in frontend branch