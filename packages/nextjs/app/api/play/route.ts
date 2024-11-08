import { NextRequest, NextResponse } from "next/server";
import { RpcProvider, Contract, Account } from "starknet";
import betting_game_Abi from "./betting_game_abi.json";

const privateKey = process.env.ORIGIN_PRIVATE_KEY;
const accountAddress =
  "0x07701ed1a79e2672b5b83e68a7c0d9d120b4ade0549dab6272a8dfa3ad5da9bf";

const provider = new RpcProvider({
  nodeUrl: `https://starknet-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
});

const account = new Account(provider, accountAddress, privateKey as string);

async function transferPrize(recipient: any) {
  console.log("Initiating prize to: ", recipient);

  const bettingGameContractAddress =
    "0x044a14b61a797d551094d2c430b89391d7b83bd24bbd17ca0de39be9979e1510";
  const gameContract = new Contract(
    betting_game_Abi,
    bettingGameContractAddress,
    provider
  );

  // Connect the contract with the account to allow signing transactions
  gameContract.connect(account);

  try {
    const txResponse = await account.execute({
      contractAddress: bettingGameContractAddress,
      entrypoint: "transfer_prize",
      calldata: [recipient],
    });

    // Wait for transaction confirmation
    /* const txReceipt = await provider.waitForTransaction(txResponse.transaction_hash);
    console.log(`Prize transferred to ${recipient}, Transaction hash: ${txReceipt.transaction_hash}`);

    console.log("Transfer transaction submitted:", transferTx.transaction_hash);

    if (txReceipt.execution_status !== "SUCCEEDED") {
      throw new Error(
        `Transfer failed with status: ${txReceipt.execution_status}`
      );
    }

    return txReceipt; */
  } catch (error) {
    /* console.error("Error transferring prize:", error);
    throw new Error("Failed to transfer prize.", error.message); */
  }
}

const determineWinner = () => {
  console.log("test - determining winner");
  return Math.random() < 0.7;
};

export async function GET (req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const txHash = searchParams.get("txHash");
    console.log("test backend DDD - ", { searchParams, txHash }, );

    const txReceipt = await provider.getTransactionReceipt(txHash as string);

    console.log("test backend - ", { txReceipt });

    return NextResponse.json(
      {
        message:
          "Congratulations! You won and the prize has been transferred.",
      },
      { status: 200 }
    );

    /* return NextResponse.json(
        {ok: true, message: 'test: ', txHash},
        {status: 200}
      ) */

    /* if (txReceipt.finality_status !== "ACCEPTED_ON_L1") {
      return res.status(202).json({
        status: "pending",
        message: "Transaction not yet confirmed on L1. Please try again later.",
      });
    }

    const txDetails = await provider.getTransaction(txHash);
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

        return res.status(500).json({
          status: "error",
          isWinner,
          message:
            "You won, but prize transfer failed. Please contact support.",
          error: transferError.message,
        });
      } */
   /*  } else {
      return res.json({
        status: "success",
        isWinner,
        message: "Better luck next time!",
      });
    } */
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json({ ok: true, message: "test: " }, { status: 500 });
  }
}
