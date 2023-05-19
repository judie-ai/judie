import "@judie/styles/globals.scss";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import LoadingScreen from "@judie/components/LoadingScreen/LoadingScreen";
import { useEffect } from "react";
import theme from "@judie/styles/chakra/chakra";

const openSans = Open_Sans({
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (Component.displayName) {
      if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        window?.analytics?.page(Component.displayName);
      }
    }
  }, []);

  useEffect(() => {
    router.push("/waitlist");
  }, [router.asPath]);

  if (!router.isReady) {
    return <LoadingScreen />;
  }
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${openSans.style.fontFamily};
        }
      `}</style>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}
