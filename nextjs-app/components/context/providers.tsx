"use client";

import { Web3Provider } from "./web3-provider";

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) {
  return <Web3Provider cookies={cookies}>{children}</Web3Provider>;
}
