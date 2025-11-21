"use client";

import { useQuery } from "@tanstack/react-query";
import { Agreement, indexerUrl } from "@/lib/indexer";
import MDEditor from "@uiw/react-md-editor";
import { Separator } from "./ui/separator";
import { useAccount, useSignMessage } from "wagmi";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Link from "next/link";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Address, keccak256, toBytes } from "viem";
import { CheckCircle2, X } from "lucide-react";

export function AgreementInfo({ id }: { id: string }) {
  const { address } = useAccount();
  const { data: info, refetch: refetchInfo } = useQuery({
    queryKey: ["info", id],
    queryFn: async () => {
      return fetch(`${indexerUrl}/api/agreement/${id}/info`)
        .then((res) => res.json())
        .then((data) => data as Agreement);
    },
  });

  const { signMessageAsync } = useSignMessage();

  if (!info) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4 place-items-center">
        <span className="text-4xl">
          #{info.id}: {info.title}
        </span>
        {info.signature && info.signed_at ? (
          <CheckCircle2 className="text-green-600" />
        ) : (
          <X className="text-red-600" />
        )}
        {info.signature && info.signed_at && (
          <Dialog>
            <DialogTrigger>
              <span className="underline text-blue-500">Verify Signature</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verify Signable #{info.id}</DialogTitle>
                <DialogDescription>
                  You can verify this signature for example on platforms like{" "}
                  <Link
                    className="underline text-blue-500"
                    href="https://etherscan.io/verifiedSignatures"
                    target="_blank"
                  >
                    Etherscan
                  </Link>
                  . The hash can be verified using tools such as{" "}
                  <Link
                    className="underline text-blue-500"
                    href="https://emn178.github.io/online-tools/keccak_256.html"
                    target="_blank"
                  >
                    Online Keccak-256
                  </Link>
                  .
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 place-items-center">
                <div className="flex flex-col gap-1 w-full">
                  <Label htmlFor="verify-agreement-address">Address</Label>
                  <Input
                    id="verify-agreement-address"
                    value={info.for_account}
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <Label htmlFor="verify-agreement-message">Message</Label>
                  <Textarea
                    id="verify-agreement-message"
                    value={`I agree to ${keccak256(
                      toBytes(`${info.description} titled ${info.title}`)
                    )} at ${info.signed_at}`}
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <Label htmlFor="verify-agreement-unhashed">
                    Unhashed Message
                  </Label>
                  <Textarea
                    id="verify-agreement-unhashed"
                    value={`${info.description} titled ${info.title}`}
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <Label htmlFor="verify-agreement-signature">Signature</Label>
                  <Input
                    id="verify-agreement-signature"
                    value={info.signature}
                    readOnly
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {info.signature && info.signed_at ? (
        <span>
          This signable got signed by {info.for_account} on{" "}
          {new Date(info.signed_at * 1000).toLocaleString()}.
        </span>
      ) : (
        <div className="flex gap-3">
          <span>
            This signable is awaiting a signature from {info.for_account}.
          </span>
          {address?.toLowerCase() === info.for_account.toLowerCase() && (
            <Button
              onClick={() => {
                const signedAt = Math.round(Date.now() / 1000);

                let hash = keccak256(
                  toBytes(`${info.description} titled ${info.title}`)
                );
                signMessageAsync({
                  account: info.for_account as Address,
                  message: `I agree to ${hash} at ${signedAt}`,
                })
                  .then((signature) =>
                    fetch(`${indexerUrl}/api/agreement/sign`, {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        agreement: info.id,
                        signature,
                        signed_at: signedAt,
                      }),
                    })
                  )
                  .then(() => refetchInfo())
                  .catch(console.error);
              }}
            >
              Sign
            </Button>
          )}
        </div>
      )}
      <Separator className="bg-black/80" />
      <MDEditor.Markdown
        wrapperElement={{ "data-color-mode": "light" }}
        source={info.description}
      />
    </div>
  );
}
