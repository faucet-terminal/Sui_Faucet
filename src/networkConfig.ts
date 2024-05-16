import {getFullnodeUrl} from "@mysten/sui.js/client";
import {createNetworkConfig} from "@mysten/dapp-kit";

const {networkConfig, useNetworkVariable, useNetworkVariables} =
    createNetworkConfig({
        testnet: {
            url: getFullnodeUrl("testnet")
        },
        devnet: {
            url: getFullnodeUrl("devnet")

        },
        localnet: {
            url: getFullnodeUrl("localnet")
        },
    });

export {useNetworkVariable, useNetworkVariables, networkConfig};
