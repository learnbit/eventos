"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavlLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: NavlLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`relative text-sm transition-colors ${
        isActive ? "text-foreground" : "text-muted hover:text-foreground"
      }`}
    >
      {children}
      {isActive && (
        <span
          className={`absolute left-0 right-0 -bottom-2 h-0.5 rounded-full bg-primary`}
        />
      )}
    </Link>
  );
}
