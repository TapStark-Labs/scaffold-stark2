import { NextRequest, NextResponse } from "next/server";
import { RpcProvider, Contract, Account } from "starknet";

const contract = [
  {
    type: "impl",
    name: "BettingContract",
    interface_name: "contracts::bettingcontract::IBettingContract",
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    type: "interface",
    name: "contracts::bettingcontract::IBettingContract",
    items: [
      {
        type: "function",
        name: "get_prize_pool",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_user_points",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "place_bet",
        inputs: [
          {
            name: "bet_amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "transfer_prize",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_remaining_allowance",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "initial_backend_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "currency",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "event",
    name: "contracts::bettingcontract::BettingContract::BetPlaced",
    kind: "struct",
    members: [
      {
        name: "user",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "amount",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "points_earned",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "remaining_allowance",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "contracts::bettingcontract::BettingContract::BettingApproved",
    kind: "struct",
    members: [
      {
        name: "user",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "amount",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "contracts::bettingcontract::BettingContract::PrizeTransferred",
    kind: "struct",
    members: [
      {
        name: "user",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "amount",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "timestamp",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "contracts::bettingcontract::BettingContract::Event",
    kind: "enum",
    variants: [
      {
        name: "BetPlaced",
        type: "contracts::bettingcontract::BettingContract::BetPlaced",
        kind: "nested",
      },
      {
        name: "BettingApproved",
        type: "contracts::bettingcontract::BettingContract::BettingApproved",
        kind: "nested",
      },
      {
        name: "PrizeTransferred",
        type: "contracts::bettingcontract::BettingContract::PrizeTransferred",
        kind: "nested",
      },
    ],
  },
]

const privateKey = process.env.ORIGIN_PRIVATE_KEY;
const accountAddress =
  "0x07701ed1a79e2672b5b83e68a7c0d9d120b4ade0549dab6272a8dfa3ad5da9bf";

const provider = new RpcProvider({
  nodeUrl: `https://starknet-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
});

const account = new Account(provider, accountAddress, privateKey as any);

/* async function transferPrize(recipient: any) {
  console.log("Initiating prize to: ", recipient);

  const bettingGameContractAddress =
    "0x044a14b61a797d551094d2c430b89391d7b83bd24bbd17ca0de39be9979e1510";
  const gameContract = new Contract(
    contract,
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
    const txReceipt = await provider.waitForTransaction(txResponse.transaction_hash);
    console.log(`Prize transferred to ${recipient}, Transaction hash: ${txReceipt.transaction_hash}`);

    console.log("Transfer transaction submitted:", transferTx.transaction_hash);

    if (txReceipt.execution_status !== "SUCCEEDED") {
      throw new Error(
        `Transfer failed with status: ${txReceipt.execution_status}`
      );
    }

    return txReceipt;
  } catch (error) {
    console.error("Error transferring prize:", error);
    throw new Error("Failed to transfer prize.", error.message);
  }
}

const determineWinner = () => {
  console.log('test - determining winner');
  return Math.random() < 0.7;
};
 */
export async function GET (req: NextRequest, res: NextResponse) {
    try {
      const searchParams = req.nextUrl.searchParams;
      const txHash = searchParams.get('txHash');
     /*  const txReceipt = await provider.getTransactionReceipt(txHash as string); */

      return NextResponse.json(
        {ok: true, message: 'test: ', txHash},
        {status: 200}
      )

      /* if (txReceipt.finality_status !== "ACCEPTED_ON_L1") {
        return res.status(202).json({
          status: "pending",
          message:
            "Transaction not yet confirmed on L1. Please try again later.",
        });
      }

      const txDetails = await provider.getTransaction(txHash);
      const recipientAddress = txDetails.sender_address;

      const isWinner = determineWinner();
      if (isWinner) {
        try {
          await transferPrize(recipientAddress);

          return res.json({
            status: "success",
            isWinner,
            message:
              "Congratulations! You won and the prize has been transferred.",
          });
        } catch (transferError) {
          console.error("Prize transfer failed:", transferError);

          return res.status(500).json({
            status: "error",
            isWinner,
            message:
              "You won, but prize transfer failed. Please contact support.",
            error: transferError.message,
          });
        }
      } else {
        return res.json({
          status: "success",
          isWinner,
          message: "Better luck next time!",
        });
      } */
    } catch (error) {
      console.error("Error fetching transaction:", error);
      return NextResponse.json(
        {ok: true, message: 'test: '},
        {status: 500}
      )
    }
}
