import { AgreementInfo } from "@/components/agreement-info";
import React from "react";

export default async function AgreementInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AgreementInfo id={id} />;
}
