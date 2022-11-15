import { ethers, Wallet } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

async function main(){
    const provider = ethers.getDefaultProvider("goerli", {
      infura: process.env.INFURA_API_KEY,
      etherscan: process.env.ETHERSCAN_API_KEY,
      alchemy: process.env.ALCHEMY_API_KEY,});
    const args = process.argv;
    const params = args.slice(2);
    const contractAddress = params[0];
    const delegateTo = params[1];
    const walletIndex = params[2];
    const path = `m/44'/60'/0'/0/${walletIndex}`; //set wallet path  
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "", path);
    //const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();

    console.log(`Connected to the account of ${signer.address}
    \nThis account has a balance of ${balanceBN.toString()}} Wei`);

    if (params.length < 3) throw new Error("Specifiy deployed contract address, delegate to address and wallet path")
    console.log("Delegating signer vote");
    console.log("Params: ");
    params.forEach((element, index) => {
      console.log(`Param N. ${index + 1}: ${element}`);
    });

    let ballotContract: Ballot;
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = ballotContractFactory.attach(contractAddress);
    const tx = await ballotContract.delegate(delegateTo, {gasLimit:30000});
    const receipt = await tx.wait();
    console.log({ receipt });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});