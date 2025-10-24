"use client";

import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky flex place-items-center place-content-between border-b p-4">
      <Link href="/">
        <div className="flex place-items-center gap-2">
          <Image
            className="size-[40px]"
            src="/icon.png"
            alt="icon"
            width={40}
            height={40}
          />
          <span className="text-xl">{siteConfig.name}</span>
        </div>
      </Link>
      <appkit-button />
    </header>
  );
}
