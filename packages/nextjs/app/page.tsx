"use client";

import type { NextPage } from "next";
import { useAccount } from "@starknet-react/core";
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { notification } from "~~/utils/scaffold-stark";
import { useState } from "react";
import Image from "next/image";
import { useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const [tokensToBuy, setTokensToBuy] = useState<string | bigint>("");
  const [betResult, setBetResult] = useState<any>({
    isWinner: false,
    message: "",
  });

  function formatEther(weiValue: number) {
    const etherValue = weiValue / 1e18;
    return etherValue.toFixed(1);
  }

  const { data: bettingcontract } = useDeployedContractInfo("BettingGameTest");

  console.log("check contract: ", { bettingcontract });

  const fetchPlayResult = async (txHash: string) => {
    const response = await fetch(`api/play?txHash=${txHash}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("testing frontend: ", { data });

    setBetResult({ isWinner: data.isWinner, message: data.message });
    return data;
  };

  const { sendAsync: placebet } = useScaffoldMultiWriteContract({
    calls: [
      {
        contractName: "Eth",
        functionName: "approve",
        args: ["0x001058B0fd2E63557DC7ee60DCe5F45fEbb49F59518F330688a321E95B6b2e46", 5 * 10 ** 15],
      },
      {
        contractName: "BettingGameTest",
        functionName: "place_bet",
        args: [1 * 10 ** 15],
      },
    ],
  });

  const { data: prizepool } = useScaffoldReadContract({
    contractName: "BettingGameTest",
    functionName: "get_prize_pool",
    watch: true,
  });

  const onBetClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      console.log("clicked");
      if (!isConnected) {
        console.log("Please connect");
        return;
      }

      await placebet();
      const txHash = await placebet();
      console.log("Transaction hash:", txHash);
      if (txHash) {
        await fetchPlayResult(txHash);
      } else {
        console.error("Transaction hash is undefined");
      }
    } catch (e) {
      console.error("Error placing bet or handling play:", e);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <div className="flex flex-col items-center gap-1 mb-12 justify-center">
            <p className="text-2xl text-gray-100 sm:text-3xl">
              Play to win the
            </p>
            <Image
              src="/gold.png"
              alt="gold pot prize pool"
              priority={true}
              width={80}
              height={80}
              className="cursor-pointer sm:w-24 sm:h-24"
            />
            <p className="text-2xl font-bold text-gray-100 sm:text-3xl mb-2">
              Grand Prize Pool
            </p>
            <p className="text-4xl font-bold text-cyan-400 glow-pulse sm:text-6xl">
              {formatEther(Number(prizepool))} {"ETH"}
            </p>
          </div>

          {!isConnected ? (
            <h1 className="uppercase text-lg font-bold bg-gradient-to-r from-cyan-500 to-cyan-300 bg-clip-text text-transparent text-center">
              Connect to play
            </h1>
          ) : (
            <div className="flex flex-col items-center mb-8 relative">
              <div onClick={onBetClick}>
                <Image
                  src="/star.png"
                  alt="Bet Button"
                  priority={true}
                  width={160}
                  height={160}
                  className="cursor-pointer sm:w-48 sm:h-48"
                />
              </div>
              <div className="mb-4">
                <p className="text-md font-bold glow-pulse sm:text-xl">
                  Tap to play
                </p>
              </div>
            </div>
          )}
          {betResult.isWinner && (
            <h1 className="uppercase text-lg font-bold bg-gradient-to-r from-cyan-500 to-cyan-300 bg-clip-text text-transparent text-center">
              {betResult.message}
            </h1>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
