// import {Signer, ethers, BrowserProvider} from "ethers";
import {Signer,ethers} from "ethers"
import {JsonRpcSigner} from "@ethersproject/providers";

const contractAddress = '0xF5023a04022B6f8a2C95AAd16d430ED2805B928C';
const contractAbi = [{"inputs":[{"internalType":"address","name":"_genofusionAssetAddress","type":"address"},{"components":[{"internalType":"uint256","name":"startTimestamp","type":"uint256"},{"internalType":"uint256","name":"endTimestamp","type":"uint256"},{"internalType":"uint64","name":"price","type":"uint64"},{"internalType":"enum GenofusionEntry.SalePhase","name":"salePhase","type":"uint8"}],"internalType":"struct GenofusionEntry.SaleConfig","name":"_saleConfig","type":"tuple"},{"components":[{"internalType":"address","name":"ContractAddress","type":"address"},{"internalType":"uint16","name":"TokenTypeId","type":"uint16"}],"internalType":"struct GenofusionEntry.ParentContract[]","name":"_parentTokens","type":"tuple[]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_sender","type":"address"},{"indexed":true,"internalType":"uint256","name":"_fusionIndex","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"_status","type":"uint256"},{"components":[{"internalType":"address","name":"AOwner","type":"address"},{"components":[{"internalType":"address","name":"ContractAddress","type":"address"},{"internalType":"uint16","name":"TokenTypeId","type":"uint16"}],"internalType":"struct GenofusionEntry.ParentContract","name":"AContractAddress","type":"tuple"},{"internalType":"uint16","name":"ATokenId","type":"uint16"},{"internalType":"address","name":"BOwner","type":"address"},{"components":[{"internalType":"address","name":"ContractAddress","type":"address"},{"internalType":"uint16","name":"TokenTypeId","type":"uint16"}],"internalType":"struct GenofusionEntry.ParentContract","name":"BContractAddress","type":"tuple"},{"internalType":"uint16","name":"BTokenId","type":"uint16"}],"indexed":false,"internalType":"struct GenofusionEntry.Parents","name":"_parents","type":"tuple"},{"indexed":false,"internalType":"uint256[2]","name":"tokenIds","type":"uint256[2]"}],"name":"MintBabyEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_sender","type":"address"},{"indexed":true,"internalType":"uint256","name":"_fusionIndex","type":"uint256"}],"name":"RansomEvent","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint256","name":"startTimestamp","type":"uint256"},{"internalType":"uint256","name":"endTimestamp","type":"uint256"},{"internalType":"uint64","name":"price","type":"uint64"},{"internalType":"enum GenofusionEntry.SalePhase","name":"salePhase","type":"uint8"}],"indexed":false,"internalType":"struct GenofusionEntry.SaleConfig","name":"_saleConfig","type":"tuple"}],"name":"SaleConfigEvent","type":"event"},{"inputs":[],"name":"collectionSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fusionIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"fusionParents","outputs":[{"internalType":"address","name":"AOwner","type":"address"},{"components":[{"internalType":"address","name":"ContractAddress","type":"address"},{"internalType":"uint16","name":"TokenTypeId","type":"uint16"}],"internalType":"struct GenofusionEntry.ParentContract","name":"AContractAddress","type":"tuple"},{"internalType":"uint16","name":"ATokenId","type":"uint16"},{"internalType":"address","name":"BOwner","type":"address"},{"components":[{"internalType":"address","name":"ContractAddress","type":"address"},{"internalType":"uint16","name":"TokenTypeId","type":"uint16"}],"internalType":"struct GenofusionEntry.ParentContract","name":"BContractAddress","type":"tuple"},{"internalType":"uint16","name":"BTokenId","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"genofusionAsset","outputs":[{"internalType":"contract IGenofusionAsset","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"proposerContractAddress","type":"address"},{"internalType":"address","name":"proposerAddress","type":"address"},{"internalType":"uint16","name":"proposerTokenId","type":"uint16"},{"internalType":"uint32","name":"expireAt","type":"uint32"}],"internalType":"struct GenofusionEntry.MatingRequest","name":"_mating","type":"tuple"},{"internalType":"uint256","name":"_fusionIndex","type":"uint256"},{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"mintMaxPerAddr","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"mintedCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"parentContractSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"parentContracts","outputs":[{"internalType":"address","name":"ContractAddress","type":"address"},{"internalType":"uint16","name":"TokenTypeId","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"quantity","type":"uint256"}],"name":"publicMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleConfig","outputs":[{"internalType":"uint256","name":"startTimestamp","type":"uint256"},{"internalType":"uint256","name":"endTimestamp","type":"uint256"},{"internalType":"uint64","name":"price","type":"uint64"},{"internalType":"enum GenofusionEntry.SalePhase","name":"salePhase","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_collectionSize","type":"uint256"}],"name":"setCollectionSize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mintMaxPerAddr","type":"uint256"}],"name":"setMintMaxPerAddr","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"startTimestamp","type":"uint256"},{"internalType":"uint256","name":"endTimestamp","type":"uint256"},{"internalType":"uint64","name":"price","type":"uint64"},{"internalType":"enum GenofusionEntry.SalePhase","name":"salePhase","type":"uint8"}],"internalType":"struct GenofusionEntry.SaleConfig","name":"_saleConfig","type":"tuple"}],"name":"setSaleConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"beneficiary","type":"address"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]

// 用于签名的数据类型
const MatingRequestType = {
    MatingRequest: [
        { name: 'proposerContractAddress', type: 'address' },
        { name: 'proposerAddress', type: 'address' },
        { name: 'proposerTokenId', type: 'uint16' },
        { name: 'expireAt', type: 'uint32' },
    ]
}



// ethers 6.3.0
// async function eip712Signature(signer: Signer,proposerContractAddress: string,proposerTokenId: number,expireAt: number,chainId:number){
//     try {
//         // 获取当前签名者的地址
//         // EIP-712 域
//         const domain: ethers.TypedDataDomain = {
//             name: "GenofusionEntry",
//             version: "1.0",
//             chainId: chainId, // 用您的链 ID 替换
//             verifyingContract: contractAddress, // 用您的合约地址替换
//         };
//         const signerAddress = await signer.getAddress();
//         console.log("Signer address:", signerAddress);
//         // 签名 EIP-712 数据
//         // const signature = await signer.signTypedData(signer, {
//         //     primaryType: "Content",
//         //     types,
//         //     domain,
//         //     value: data,
//         //     version: "V4",
//         // });
//
//         const signature = await signer.signTypedData(domain,MatingRequestType,{
//             proposerContractAddress: proposerContractAddress,
//             proposerAddress: signerAddress,
//             proposerTokenId: proposerTokenId,
//             expireAt: expireAt,
//         })
//
//         console.log("Signature:", signature);
//         return signature
//         // // 在前端验证签名
//         // const recoveredAddress = ethers.recoverAddress(ethers.TypedDataEncoder.hashDomain(domain), signature);
//         // console.log("Recovered address:", recoveredAddress);
//         // console.log("Signer address",signerAddress)
//         // if (signerAddress === recoveredAddress) {
//         //     console.log("Signature is valid");
//         // } else {
//         //     console.log("Signature is invalid");
//         // }
//     } catch (error) {
//         console.error("Error signing EIP-712 data:", error);
//     }
// }

// ethers 6.3.0
// export async function connectMetaMask(proposerContractAddress: string,  proposerTokenId: number,account: string) {
//     try {
//         await window.ethereum.request({ method: "eth_requestAccounts" });
//         const provider = new BrowserProvider(window.ethereum);
//         const chainId = await provider.getNetwork().then((network) => network.chainId);
//         const signer = await provider.getSigner();
//         const nowStamp = Math.floor(Date.now() / 1000);
//         const signature = await eip712Signature(await signer,proposerContractAddress,proposerTokenId,nowStamp+600,Number(chainId));
//         const contractGenofusion = new ethers.Contract(contractAddress,contractAbi,signer);
//         console.log("contractGenofusion",contractGenofusion)
//         const mintParams = {
//             proposerContractAddress: proposerContractAddress,
//             proposerAddress: account,
//             proposerTokenId: proposerTokenId,
//             expireAt: nowStamp+600,
//         };
//         const result = await contractGenofusion.mint(mintParams,0,signature,{value:ethers.parseUnits("0.001", "ether")})
//         console.log('result',result)
//     } catch (error) {
//         console.error("Error connecting to MetaMask:", error);
//     }
// }

async function eip712Signature(signer: JsonRpcSigner,proposerContractAddress: string,proposerTokenId: number,expireAt: number,chainId:number){
    try {
        // 获取当前签名者的地址
        // EIP-712 域
        const domain: ethers.TypedDataDomain = {
            name: "GenofusionEntry",
            version: "1.0",
            chainId: chainId, // 用您的链 ID 替换
            verifyingContract: contractAddress, // 用您的合约地址替换
        };
        const signerAddress = await signer.getAddress();
        console.log("Signer address:", signerAddress);

        const signature = await signer._signTypedData(domain,MatingRequestType,{
            proposerContractAddress: proposerContractAddress,
            proposerAddress: signerAddress,
            proposerTokenId: proposerTokenId,
            expireAt: expireAt,
        })

        console.log("Signature:", signature);
        return signature
        // // 在前端验证签名
        // const recoveredAddress = ethers.recoverAddress(ethers.TypedDataEncoder.hashDomain(domain), signature);
        // console.log("Recovered address:", recoveredAddress);
        // console.log("Signer address",signerAddress)
        // if (signerAddress === recoveredAddress) {
        //     console.log("Signature is valid");
        // } else {
        //     console.log("Signature is invalid");
        // }
    } catch (error) {
        console.error("Error signing EIP-712 data:", error);
    }
}

export async function connectMetaMask(proposerContractAddress: string,  proposerTokenId: number,account: string,fusion_index:number) {
    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const chainId = await provider.getNetwork().then((network) => network.chainId);
        const signer = await provider.getSigner();
        const nowStamp = Math.floor(Date.now() / 1000);
        const signature = await eip712Signature(await signer,proposerContractAddress,proposerTokenId,nowStamp+600,Number(chainId));
        const contractGenofusion = new ethers.Contract(contractAddress,contractAbi,signer);
        console.log("contractGenofusion",contractGenofusion)
        const mintParams = {
            proposerContractAddress: proposerContractAddress,
            proposerAddress: account,
            proposerTokenId: proposerTokenId,
            expireAt: nowStamp+600,
        };
        const result = await contractGenofusion.mint(mintParams,fusion_index,signature,{value:ethers.utils.parseEther("0.01"),gasLimit:5000000})
        console.log('result',result)
    } catch (error) {
        console.error("Error connecting to MetaMask:", error);
    }
}

// connectMetaMask();
