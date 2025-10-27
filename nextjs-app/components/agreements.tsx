"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Agreement, indexerUrl } from "@/lib/indexer";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { CheckCircle2, Plus, X } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

export function Agreements() {
  const { address } = useAccount();
  const { data: agreements } = useQuery({
    queryKey: ["agreements"],
    queryFn: async () => {
      return fetch(`${indexerUrl}/api/agreement/list`)
        .then((res) => res.json())
        .then((data) => data as Agreement[]);
    },
  });

  return (
    <div className="flex flex-col gap-3 place-items-center">
      {address?.toLowerCase() ===
        "0x3e166454c7781d3fD4ceaB18055cad87136970Ea".toLowerCase() && (
        <Link href="/signable/create">
          <Button className="flex place-items-center gap-2">
            <Plus />
            <span>Create</span>
          </Button>
        </Link>
      )}
      {agreements?.map((agreement) => (
        <AgreementSummery key={agreement.id} agreement={agreement} />
      ))}
    </div>
  );
}

function AgreementSummery({ agreement }: { agreement: Agreement }) {
  return (
    <Link className="w-full" href={`/signable/${agreement.id}`}>
      <Card>
        <CardHeader className="gap-4">
          <div className="flex gap-4 place-items-center">
            <CardTitle className="text-4xl">
              #{agreement.id}: {agreement.title}
            </CardTitle>
            {agreement.signature && agreement.signed_at ? (
              <CheckCircle2 className="text-green-600" />
            ) : (
              <X className="text-red-600" />
            )}
            {agreement.signature && agreement.signed_at && (
              <Dialog>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DialogTrigger>
                    <span className="underline text-blue-500">
                      Verify Signature
                    </span>
                  </DialogTrigger>
                </div>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Verify Signable #{agreement.id}</DialogTitle>
                    <DialogDescription>
                      You can verify this signature for example on platforms
                      like{" "}
                      <Link
                        className="underline text-blue-500"
                        href="https://etherscan.io/verifiedSignatures"
                        target="_blank"
                      >
                        Etherscan
                      </Link>
                      .
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 place-items-center">
                    <div className="flex flex-col gap-1 w-full">
                      <Label htmlFor="verify-agreement-address">Address</Label>
                      <Input
                        id="verify-agreement-address"
                        value={agreement.for_account}
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <Label htmlFor="verify-agreement-message">Message</Label>
                      <Textarea
                        id="verify-agreement-message"
                        value={`I agree to ${agreement.description} titled ${agreement.title} at ${agreement.signed_at}`}
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <Label htmlFor="verify-agreement-signature">
                        Signature
                      </Label>
                      <Input
                        id="verify-agreement-signature"
                        value={agreement.signature}
                        readOnly
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <CardDescription>
            {agreement.signature && agreement.signed_at ? (
              <span>
                This signable got signed by {agreement.for_account} on{" "}
                {new Date(agreement.signed_at * 1000).toLocaleString()}.
              </span>
            ) : (
              <span>
                This signable is awaiting a signature from{" "}
                {agreement.for_account}.
              </span>
            )}
          </CardDescription>
          <Separator className="bg-black/80" />
          <MDEditor.Markdown
            wrapperElement={{ "data-color-mode": "light" }}
            source={agreement.description.split("\n")[0]}
          />
        </CardHeader>
      </Card>
    </Link>
  );
}
