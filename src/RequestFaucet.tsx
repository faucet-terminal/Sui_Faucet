import { Button, Container } from "@radix-ui/themes";
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui.js/faucet';

export function RequestFaucet({
                                  id,
                                  network,
                                  onCreated,
                                  onError,
                              }: {
    id: string;
    network: 'testnet' | 'devnet' | 'localnet';
    onCreated: (id: string) => void;
    onError: (error: string) => void;
}) {
    const handleButtonClick = async () => {
        try {
            await create(id, network);
            onCreated(id);
        } catch (error) {
            console.error('Failed to request faucet:', error);
            onError('Failed to request faucet. Please try again.');
        }
    };

    async function create(address: string, network: 'testnet' | 'devnet' | 'localnet') {
        await requestSuiFromFaucetV1({
            host: getFaucetHost(network),
            recipient: address,
        });
    }

    return (
        <Container>
            <Button size="3" onClick={handleButtonClick}>
                Request for Faucet
            </Button>
        </Container>
    );
}
