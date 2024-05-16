import {ConnectButton, useCurrentAccount} from "@mysten/dapp-kit";
import {Box, Container, Flex, Heading} from "@radix-ui/themes";
import {useState} from "react";
import {RequestFaucet} from "./RequestFaucet.tsx";

type Network = 'testnet' | 'devnet' | 'localnet';

function isValidNetwork(network: string): network is Network {
    return ['testnet', 'devnet', 'localnet'].includes(network);
}

function App() {
    const currentAccount = useCurrentAccount();
    const [isSuccess, setIsSuccess] = useState(false);
    const [network, setNetwork] = useState('testnet');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleCreated = (id: string) => {
        window.location.hash = id;
        setIsSuccess(true);
        setErrorMessage(null);
    };

    const handleError = (error: string) => {
        setIsSuccess(false);
        setErrorMessage(error);
    };

    const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNetwork = event.target.value;
        if (isValidNetwork(selectedNetwork)) {
            setNetwork(selectedNetwork as Network);
            setIsSuccess(false);
            setErrorMessage(null);
        }
    };

    return (
        <>
            <Flex
                position="sticky"
                px="4"
                py="2"
                justify="between"
                style={{
                    borderBottom: "1px solid var(--gray-a2)",
                }}
            >
                <Box>
                    <Heading>Request SUI Faucet Coin dApp</Heading>
                </Box>

                <Box>
                    <ConnectButton/>
                </Box>
            </Flex>
            <Container>
                <Box>
                    <select
                        value={network}
                        onChange={handleNetworkChange}
                        style={{minWidth: 200, marginBottom: '1rem'}}
                    >
                        <option value="testnet">Testnet</option>
                        <option value="devnet">Devnet</option>
                        <option value="localnet">Localnet</option>
                    </select>
                    <p>请将钱包网络也切换到相应环境</p>
                </Box>
                <Container
                    mt="5"
                    pt="2"
                    px="4"
                    style={{background: "var(--gray-a2)", minHeight: 500}}
                >
                    {currentAccount ? (
                        <>
                            {isSuccess ? (
                                <Heading><p style={{color: 'green'}}>Success! Faucet request completed.</p></Heading>
                            ) : (
                                <>
                                    <RequestFaucet
                                        id={currentAccount.address}
                                        network={network}
                                        onCreated={handleCreated}
                                        onError={handleError}
                                    />
                                    {errorMessage && (
                                        <p style={{color: 'red'}}>{errorMessage}</p>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <Heading>Please connect your wallet</Heading>
                    )}
                </Container>
            </Container>
        </>
    );
}

export default App;
