import { NextRequest, NextResponse } from "next/server";
import { RpcProvider, Contract, Account } from "starknet";
import betting_game_Abi from "./betting_game_abi.json";

const privateKey = process.env.ORIGIN_PRIVATE_KEY;
const accountAddress =
  "0x07701ed1a79e2672b5b83e68a7c0d9d120b4ade0549dab6272a8dfa3ad5da9bf";

const provider = new RpcProvider({
  nodeUrl: `https://starknet-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
});

/* const provider = new RpcProvider({
  nodeUrl: "http://localhost:5050",
}); */

const account = new Account(provider, accountAddress, privateKey as string);

async function transferPrize(recipient: any) {
  console.log("Initiating prize to: ", recipient);

  const bettingGameContractAddress =
    "0x001058b0fd2e63557dc7ee60dce5f45febb49f59518f330688a321e95b6b2e46";

  console.log("test: ", { bettingGameContractAddress });

  const gameContract = new Contract(
    betting_game_Abi,
    bettingGameContractAddress,
    provider
  );

  // Connect the contract with the account to allow signing transactions
  gameContract.connect(account);

  console.log("test: ", { bettingGameContractAddress });

  try {
    const txResponse = await account.execute({
      contractAddress: bettingGameContractAddress,
      entrypoint: "transfer_prize",
      calldata: [recipient],
    });

    // Wait for transaction confirmation
    const txReceipt = await provider.waitForTransaction(
      txResponse.transaction_hash
    );

    console.log(`Prize transferred to ${recipient}`);

    if (
      "execution_status" in txReceipt &&
      txReceipt.execution_status !== "SUCCEEDED"
    ) {
      throw new Error(
        `Transfer failed with status: ${txReceipt.execution_status}`
      );
    }

    return txReceipt;
  } catch (error) {
    console.error("Error transferring prize:", error);
    throw new Error("Failed to transfer prize.");
  }
}

const determineWinner = () => {
  return Math.random() < 0.8;
};

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const txHash = searchParams.get("txHash");

    if (!txHash) {
      throw new Error("Transaction hash is required.");
    }

    console.log("testing backend 1 - ", { searchParams, txHash });

    const txReceipt = (await provider.waitForTransaction(txHash as string)) as {
      finality_status: string;
    };

    console.log("testing backend 2 - ", { txReceipt });

    if (txReceipt.finality_status !== "ACCEPTED_ON_L2") {
      return NextResponse.json(
        {
          status: "pending",
          message:
            "Transaction not yet confirmed on L1. Please try again later.",
        },
        { status: 202 }
      );
    }

    const txDetails = (await provider.getTransaction(txHash)) as any;
    const recipientAddress = txDetails.sender_address;
    const isWinner = determineWinner();

    if (isWinner) {
      try {
        await transferPrize(recipientAddress);

        return NextResponse.json(
          {
            isWinner,
            message:
              "Congratulations! You won and the prize has been transferred.",
          },
          { status: 200 }
        );
      } catch (transferError) {
        console.error("Prize transfer failed:", transferError);

        return NextResponse.json(
          {
            status: "error",
            isWinner,
            message:
              "You won, but prize transfer failed. Please contact support.",
          },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        {
          status: "success",
          isWinner,
          message: "Better luck next time!",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { ok: true, message: "Error fetching transaction: " },
      { status: 500 }
    );
  }
}
