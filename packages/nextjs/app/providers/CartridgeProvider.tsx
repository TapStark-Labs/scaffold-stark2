/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  voyager,
  Connector,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { RpcProvider } from "starknet";

function provider() {
  return new RpcProvider({
      nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  });
}
export const connector = new ControllerConnector({
  policies: [
    {
      target: "0x001058B0fd2E63557DC7ee60DCe5F45fEbb49F59518F330688a321E95B6b2e46",
      method: "approve",
      description:
        "Approve to transfer ETH on your behalf.",
    },
    {
      target: "0x001058B0fd2E63557DC7ee60DCe5F45fEbb49F59518F330688a321E95B6b2e46",
      method: "place_bet",
    },
    
    // Add more policies as needed
  ],
  // Uncomment to use a custom theme
  // theme: "dope-wars",
  // colorMode: "light"

  rpc: "https://api.cartridge.gg/x/starknet/sepolia",

});

export function CartridgeProvider({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={provider}
      connectors={[connector as never as Connector]}
      explorer={voyager}

    >
      {children}
    </StarknetConfig>
  );
}