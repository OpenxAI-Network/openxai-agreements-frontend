"use client";

import { useQuery } from "@tanstack/react-query";
import { Agreement, indexerUrl } from "@/lib/indexer";
import MDEditor from "@uiw/react-md-editor";

export function AgreementInfo({ id }: { id: string }) {
  const { data: info } = useQuery({
    queryKey: ["info", id],
    queryFn: async () => {
      return fetch(`${indexerUrl}/api/agreement/${id}/info`)
        .then((res) => res.json())
        .then((data) => data as Agreement);
    },
  });

  if (!info) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-3 place-items-center">
      <span className="text-4xl">
        #{info.id}: {info.title}
      </span>
      <MDEditor.Markdown source={info.description} />
    </div>
  );
}
