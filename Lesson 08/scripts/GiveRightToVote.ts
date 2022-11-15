import { Ballot, Ballot__factory } from "../typechain-types";
import { ethers } from "ethers";
import * as dotenv from 'dotenv'
dotenv.config()

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const provider = ethers.getDefaultProvider("goerli")
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  console.log(`Connected to the acount of address ${signer.address}\nThis account has a balance of ${balanceBN.toString()} Wei`);
  const args = process.argv;
  const proposals = args.slice(2);
  const contractAddress = args[0];
  const targetAccount = args[1];
  let ballotContract: Ballot;
  const ballotContractFactory = new Ballot__factory(signer);
  ballotContract = await ballotContractFactory.attach(
    contractAddress
  ) as Ballot;
  const tx = await ballotContract.giveRightToVote(targetAccount);
  const receipt = await tx.wait();
  console.log({ receipt })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
