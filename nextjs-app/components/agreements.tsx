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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
      {address === "0x3e166454c7781d3fD4ceaB18055cad87136970Ea" && (
        <Link href="/agreement/create">
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
    <Link className="w-full" href={`/agreement/${agreement.id}`}>
      <Card>
        <CardHeader className="gap-4">
          <div className="flex gap-4 place-items-center">
            <CardTitle className="text-4xl">
              #{agreement.id}: {agreement.title}
            </CardTitle>
            {agreement.signature && agreement.signed_at ? (
              <Tooltip>
                <TooltipTrigger>
                  <CheckCircle2 className="text-green-600" />
                </TooltipTrigger>
                <TooltipContent>
                  This agreement got signed by {agreement.for_account} on{" "}
                  {new Date(agreement.signed_at * 1000).toLocaleString()}.
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <X className="text-red-600" />
                </TooltipTrigger>
                <TooltipContent>
                  This agreement is awaiting a signature from{" "}
                  {agreement.for_account}.
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <Separator className="bg-black/80" />
          <CardDescription>
            <div className="max-h-[200px] overflow-hidden">
              <MDEditor.Markdown
                wrapperElement={{ "data-color-mode": "light" }}
                source={agreement.description}
              />
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
