import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { Connector } from "@starknet-react/core";
import { useEffect, useState } from "react";

export function ConnectWallet() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  const connector = connectors[0] as unknown as ControllerConnector;

  const [username, setUsername] = useState<string>();
  useEffect(() => {
    if (!address) return;
    connector.username()?.then((n) => setUsername(n));
  }, [address, connector]);

  return (
    <div>
      {address && (
        <>
          <p>Account: {address} </p>
          {username && <p>Username: {username}</p>}
        </>
      )}

      <button
        onClick={() => {
          address ? disconnect() : connect({ connector: connector as unknown as Connector });
        }}
      >
        {address ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}
