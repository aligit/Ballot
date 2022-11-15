import { ethers, Wallet } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

async function main(){
    const provider = ethers.getDefaultProvider("goerli", {
      infura: process.env.INFURA_API_KEY,
      etherscan: process.env.ETHERSCAN_API_KEY,
      alchemy: process.env.ALCHEMY_API_KEY,});

    const params = process.argv;
    const proposals = params.slice(2);
    const contractAddress = proposals[0];
    const proposal = proposals[1];
    const walletIndex = proposals[2];
    //set wallet path  
    const path = `m/44'/60'/0'/0/${walletIndex}`;
    //console.log(path);
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "", path);
    //const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    console.log(signer);
    const balanceBN = await signer.getBalance();
    console.log(`Connected to the account of ${signer.address}
    \nThis account has a balance of ${balanceBN.toString()}} Wei`);

    if (proposals.length < 1) throw new Error("not enough arguments")
    console.log("Submitting vote for proposal");
    console.log("Params: ");
    proposals.forEach((element, index) => {
      console.log(`Param N. ${index + 1}: ${element}`);
    });


    let ballotContract: Ballot;
  //  let accounts: SignerWithAddress[];
  //  accounts = await ethers.getSigners();
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = ballotContractFactory.attach(contractAddress);
    const tx = await ballotContract.vote(proposal);
    console.log("here");
    const receipt = await tx.wait();
    console.log({ receipt });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});