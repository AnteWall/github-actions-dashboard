import type { AppProps } from "next/app";
import { GlobalStateProvider } from "../context/GlobalState";
import Head from "next/head";
import { IoProvider } from "socket.io-react-hook";
import { MantineProvider } from "@mantine/core";
import WebhookListener from "../context/WebhookListener";
import { isClient } from "../utils/server";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Github Actions Dashboard</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <GlobalStateProvider>
        <IoProvider>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme: "dark",
            }}
          >
            <>
              {isClient() && <WebhookListener />}
              <Component {...pageProps} />
            </>
          </MantineProvider>
        </IoProvider>
      </GlobalStateProvider>
    </>
  );
}

export default App;
