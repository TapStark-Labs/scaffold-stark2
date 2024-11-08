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
/* import { useQuery } from '@tanstack/react-query'; */

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const [tokensToBuy, setTokensToBuy] = useState<string | bigint>("");

  function formatEther(weiValue: number) {
    const etherValue = weiValue / 1e18;
    return etherValue.toFixed(1);
  }

  const { data: bettingcontract } = useDeployedContractInfo("bettingcontract");

/*   const {
    data: playData,
    error: playError,
    isLoading: isPlayLoading,
    refetch: refetchPlayResult,
  } = useQuery({
    queryKey: ["play"],
    queryFn: async () => await fetchPlayResult(),
    enabled: false,
  }); */

  const fetchPlayResult = async () => {
    const txHash =
      "0x01a8731a6abf51cee46f8a32e277826fe78c2efa72ac17d6190e1f389cbbc74e"; // should be dynamic
  
    const response = await fetch(`api/play?txHash=${txHash}`);
    /* const response = await fetch(`/api/play`); */
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    console.log('test: ', {data});
    return data;
  };



  const { sendAsync: placebet } = useScaffoldMultiWriteContract({
    calls: [
      {
        contractName: "Eth",
        functionName: "approve",
        args: [bettingcontract?.address ?? "", 5 * 10 ** 17],
      },
      {
        contractName: "bettingcontract",
        functionName: "place_bet",
        args: [5 * 10 ** 17],
      },
    ],
  });

  const { data: prizepool } = useScaffoldReadContract({
    contractName: "bettingcontract",
    functionName: "get_prize_pool",
    watch: true,
  });

  const onBetClick = async () => {
    try {
      await placebet();
      await fetchPlayResult();
    } catch (e) {
      console.error("Error placing bet or handling play:", e);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="uppercase text-lg font-bold bg-gradient-to-r from-cyan-500 to-cyan-300 bg-clip-text text-transparent">
            TapStark
          </h1>

          <div className="flex flex-col items-center gap-1 mb-12">
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
          </div>

          {/* {isConnected && ( */}
          {/* <div className="mb-4">
            <p className="text-md font-bold glow-pulse sm:text-xl">
              Tap to play
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Home;
