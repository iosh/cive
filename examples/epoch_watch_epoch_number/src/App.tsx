import { http, createPublicClient } from "cive";
import { mainnet } from "cive/chains";
import { useCallback, useEffect, useState } from "react";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});
export default function App() {
  const [epochNumber, setEpochNumber] = useState("");

  useEffect(() => {
    const unwatch = client.watchEpochNumber({
      onEpochNumber: (epochNumber) => {
        setEpochNumber(`${epochNumber}`);
      },
      pollingInterval: 1000,
    });
    return unwatch;
  }, []);

  return (
    <div className="block">
      <span className="is-size-5">Epoch number: {epochNumber}</span>
    </div>
  );
}
