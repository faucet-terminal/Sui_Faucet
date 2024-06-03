# 领取 sui faucet 

- 1.backend api in main branch

API调用:<br>
POST http://localhost:6002/sui/request 

Content-Type: application/json

注：不支持自定义amount,testnet固定领取1sui
network： 测试环境：testnet, 开发环境：devnet, 环境：localnet
请求参数
```json5
{
"network": "testnet",      // 网络环境
"address": "your address", // 地址
}
```
响应参数
```json5
{
  "success": true,
  "tx_id": "abc5af0a-9cd1-4928-83aa-71ed0d2afd53",
  "explorer_url": "https://suiscan.xyz/testnet/tx/abc5af0a-9cd1-4928-83aa-71ed0d2afd53"
}
```


- 2.frontend  in frontend branch

# 部署流程
- 构建
```shell
cargo build --release
```
- 启动
```shell
nohup ./target/release/sui-faucet > output.log 2>&1 &
```