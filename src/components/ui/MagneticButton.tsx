"use client";
import { useRef } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "gold" | "ghost" | "dark";
  external?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const styles = {
  gold: "bg-gold text-ink hover:bg-gold-light",
  ghost: "border-2 border-brown text-brown hover:bg-brown hover:text-papyrus",
  dark: "bg-ink text-papyrus hover:bg-brown",
};

/** Link-button whose body is pulled toward the cursor. */
export default function MagneticButton({ href, children, variant = "gold", external, className = "", onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerMove={move}
      onPointerLeave={leave}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold uppercase tracking-wider transition-[transform,background-color,color] duration-200 ease-out ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
