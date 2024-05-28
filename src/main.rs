use axum::{extract::Json, response::Json as AxumJson, routing::post, Router};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::result::Result as StdResult;
use std::string::ToString;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use thiserror::Error;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
struct TransferPost {
    address: String,
    network: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct FaucetResponse {
    task: String,
    error: Option<String>,
}

#[derive(Debug, Serialize)]
struct TransferRes {
    success: bool,
    tx_id: String,
    explorer_url: String,
}

#[derive(Debug, Serialize)]
struct TransferErrorRes {
    success: bool,
    message: String,
}

#[derive(Debug, Error)]
enum TransferError {
    #[error("Request params error: {0}")]
    ParamsError(String),
    #[error("Network connection error: {0}")]
    NetworkError(String),
    #[error("Invalid private key: {0}")]
    InvalidPrivateKey(String),
    #[error("Failed to get asset balance: {0}")]
    GetBalanceError(String),
    #[error("Invalid amount format: {0}")]
    InvalidAmountFormat(String),
    #[error("Invalid receiver address: {0}")]
    InvalidReceiverAddress(String),
    #[error("Transaction failed: {0}")]
    TransactionError(String),

}

impl Into<AxumJson<TransferErrorRes>> for TransferError {
    fn into(self) -> AxumJson<TransferErrorRes> {
        let message = self.to_string();
        let error_res = TransferErrorRes {
            success: false,
            message,
        };
        AxumJson(error_res)
    }
}


impl IntoResponse for TransferError {
    fn into_response(self) -> Response {
        let message = self.to_string();
        let error_res = TransferErrorRes {
            success: false,
            message,
        };
        let json = axum::Json(error_res);
        (StatusCode::INTERNAL_SERVER_ERROR, json).into_response()
    }
}

const VALID_NETWORKS: &[&str] = &["testnet", "devnet", "localnet"];

async fn transfer(data: Json<TransferPost>) -> StdResult<Json<TransferRes>, TransferError> {
    println!("data: {:#?}", data);

    if !VALID_NETWORKS.contains(&data.network.as_str()) {
        return Err(TransferError::ParamsError("network param not valid!".to_string()));
    };

    let mut request_body = HashMap::new();
    let mut inner_map = HashMap::new();
    inner_map.insert("recipient", &data.address);
    request_body.insert("FixedAmountRequest", inner_map);

    let client = Client::new();

    // 发送 POST 请求
    let response = client
        .post(format!("https://faucet.{}.sui.io/v1/gas", &data.network))
        .json(&request_body)
        .send()
        .await
        .map_err(|e| TransferError::NetworkError(e.to_string()))?;

    if response.status().is_success() {
        let faucet_response: FaucetResponse = response.json().await.map_err(|e| {
            TransferError::NetworkError(e.to_string())
        })?;

        Ok(Json(TransferRes {
            success: true,
            tx_id: faucet_response.task.clone(),
            explorer_url: explorer_url(&faucet_response.task, &data.network),
        }))
    } else {
        Err(TransferError::NetworkError(format!(
            "Response status: {}",
            response.status()
        )))
    }
}

fn explorer_url(tx_id: &str, network: &str) -> String {
    format!("https://suiscan.xyz/{}/tx/{}", network, tx_id)
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get("Hello, World!"))
        .route("/sui/request", post(transfer));

    let addr = "0.0.0.0:6002";
    println!("Serve running at http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
