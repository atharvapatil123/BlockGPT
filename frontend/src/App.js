import { RouterProvider, createBrowserRouter } from "react-router-dom";

import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
} from "@thirdweb-dev/react";

import { Mumbai } from "@thirdweb-dev/chains";
import { AnonAadhaarProvider } from "anon-aadhaar-react";

import AddPost from "./pages/AddPost";

import { ContentPairProvider, LightNodeProvider } from "@waku/react";
import { Protocols } from "@waku/sdk";

import { wakuDnsDiscovery, enrTree } from "@waku/dns-discovery";

const app_id = "1309218895344287769287806253054282764963406675968";
const NODE_OPTIONS = {
    libp2p: {
        peerDiscovery: [
            wakuDnsDiscovery([enrTree["PROD"]], {
                store: 30,
                filter: 30,
                lightPush: 30,
            }),
        ],
    },
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/add",
      element: (
          <ContentPairProvider contentTopic="/crime-miners/2/report/0x1234">
              <AddPost />
          </ContentPairProvider>
      ),
  },
  ])
  return (
    <LightNodeProvider
            options={NODE_OPTIONS}
            protocols={[Protocols.LightPush, Protocols.Filter, Protocols.Store]}
        >
            <AnonAadhaarProvider _appId={app_id}>
                <ThirdwebProvider
                    supportedWallets={[
                        metamaskWallet(),
                        coinbaseWallet(),
                        walletConnect(),
                    ]}
                    activeChain={Mumbai}
                    clientId="2ca083eafd3ceae4cf0dfb62ff3acb5b"
                >
                    <RouterProvider router={router}></RouterProvider>
                </ThirdwebProvider>
            </AnonAadhaarProvider>
        </LightNodeProvider>
  );
}

export default App;
