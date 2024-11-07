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

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const [tokensToBuy, setTokensToBuy] = useState<string | bigint>("");

  const { sendAsync: placebeat } = useScaffoldWriteContract({
    contractName: "bettingcontract",
    functionName: "place_bet",
    args: [2],
  });

  const { data: pricepool, refetch } = useScaffoldReadContract({
    contractName: "bettingcontract",
    functionName: "get_prize_pool",
    watch: true,
  });


  const { sendAsync: placebeat2 } = useScaffoldWriteContract({
        contractName: "Eth",
        functionName: "approve",
        args: ["0x034930182d3d70e06b1739Fb66679e5C616D433734654806545B5Ba162CA78d7",  5 * 10 ** 17],
  });
  const handleBetClick = () => {
    console.log("bet click");
  };

  const { sendAsync: placebeat3 } = useScaffoldWriteContract({
    contractName: "bettingcontract",
    functionName: "place_bet",
    args: [  5 * 10 ** 17],
});
const handleBetClick2 = () => {
console.log("bet click");
};



  return (
    <>
     <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
        <h1 className="uppercase text-lg font-bold bg-gradient-to-r from-cyan-500 to-cyan-300 bg-clip-text text-transparent">
            TapStark
          </h1>
          
        <div className="flex flex-col items-center gap-1 mb-12">
          <p className="text-2xl text-gray-100 sm:text-3xl">Play to win the</p>
          <Image
            src="/pote-de-ouro.png"
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
            1000
          </p>
        </div>

        <div className="flex flex-col items-center mb-8 relative">
          <button
            onClick={handleBetClick2}
            style={{ borderRadius: "50%", padding: 0 }}
          >
            <Image
              src="/star.png"
              alt="Bet Button"
              priority={true}
              width={160}
              height={160}
              className="cursor-pointer sm:w-48 sm:h-48"
            />
          </button>

          <button
  className="btn btn-primary"
  onClick={async () => {
    try {
      await placebeat3();
    } catch (e) {
      console.error("Error sending transactions:", e);
    }
  }}
>
  Send Transactions
</button>
          {/*           <div>{showPoints && <div points={addedPoints} />}</div>
           */}
        </div>

        {/* {isConnected && ( */}
        <div className="mb-4">
          <p className="text-md font-bold glow-pulse sm:text-xl">Tap to play</p>
        </div>
        </div>
        
      </div>
   

    </>
  );
};

export default Home;