"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSignMessage } from "wagmi";
import { checksumAddress, isAddress, keccak256, toBytes } from "viem";
import { indexerUrl } from "@/lib/indexer";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";

export function AgreementCreate() {
  const [forAccount, setForAccount] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();

  return (
    <div className="flex flex-col gap-3 place-items-center">
      <span className="text-4xl">Create Agreement</span>
      <div className="flex flex-col gap-1 w-full">
        <Label htmlFor="agreement-forAccount">For Account</Label>
        <Input
          id="agreement-forAccount"
          value={forAccount}
          onChange={(e) => setForAccount(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label htmlFor="agreement-title">Title</Label>
        <Input
          id="agreement-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <Label htmlFor="agreement-description">Description</Label>
        <MDEditor
          id="agreement-description"
          data-color-mode="light"
          height="300px"
          value={description}
          onChange={(e) => setDescription(e ?? "")}
        />
      </div>
      <Button
        onClick={() => {
          if (!isAddress(forAccount)) {
            console.error("Invalid For Address.");
            return;
          }
          if (!title) {
            console.error("Invalid Title.");
            return;
          }
          if (!description) {
            console.error("Invalid Description.");
            return;
          }

          let hash = keccak256(
            toBytes(
              `${description} with title ${title} for ${checksumAddress(
                forAccount
              )}`
            )
          );
          signMessageAsync({
            message: `Create agreement ${hash}`,
          })
            .then((signature) =>
              fetch(`${indexerUrl}/api/agreement/create`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  for_account: checksumAddress(forAccount),
                  title,
                  description,
                  signature,
                }),
              })
            )
            .then((res) => res.json())
            .then((data) => data as number)
            .then((id) => push(`/signable/${id}`))
            .catch(console.error);
        }}
      >
        Create
      </Button>
    </div>
  );
}
