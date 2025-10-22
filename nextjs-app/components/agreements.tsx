"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Agreement, indexerUrl } from "@/lib/indexer";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

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
    <Link href={`/agreement/${agreement.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>
            #{agreement.id}: {agreement.title}
          </CardTitle>
          <CardDescription>{agreement.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
