import Web3 from "web3";

export function parseID(id: string):  {
    ownerAddress: string;
    subscriberAddress: string;
    tokenAddress: string;
} {
    return {
        ownerAddress: Web3.utils.toChecksumAddress(id.slice(26, 66)),
        subscriberAddress: Web3.utils.toChecksumAddress(id.slice(90, 130)),
        tokenAddress: Web3.utils.toChecksumAddress(id.slice(154, 194)),
    }
}

