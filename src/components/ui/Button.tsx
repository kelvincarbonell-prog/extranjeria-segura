"use client";

import * as React from "react";
import { Link } from "@/components/ui/Link";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion/primitives";

type Variant = "primary" | "secondary" | "ghost" | "subtle" | "inverse" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

const VARIANTS: Record<Variant, string> = {
  primary:
    "text-white bg-ink-950 hover:bg-ink-800 " +
    "shadow-[0_1px_0_0_rgba(255,255,255,.14)_inset,0_8px_24px_-8px_rgba(10,13,22,.55)] " +
    "hover:shadow-[0_1px_0_0_rgba(255,255,255,.18)_inset,0_14px_34px_-10px_rgba(10,13,22,.6)]",
  secondary:
    "text-ink-900 bg-surface hairline hover:bg-ink-50 " +
    "shadow-[0_1px_2px_rgba(10,13,22,.05)] hover:shadow-[0_4px_14px_-4px_rgba(10,13,22,.14)]",
  ghost: "text-ink-600 hover:text-ink-900 hover:bg-ink-50",
  subtle: "text-brand-700 bg-brand-50 hover:bg-brand-100",
  inverse:
    "text-ink-950 bg-white hover:bg-white/92 shadow-[0_8px_28px_-10px_rgba(0,0,0,.5)]",
  danger: "text-white bg-signal-risk hover:brightness-110",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5 rounded-[10px]",
  md: "h-11 px-5 text-[14.5px] gap-2 rounded-xs",
  lg: "h-[52px] px-6 text-[15.5px] gap-2 rounded-sm",
  xl: "h-[58px] px-7 text-base gap-2.5 rounded-sm",
};

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  variant?: Variant;
  size?: Size;
  href?: string;
  loading?: boolean;
  magnetic?: boolean;
  arrow?: boolean;
  block?: boolean;
  icon?: React.ReactNode;
  target?: string;
  rel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    href,
    loading = false,
    magnetic = false,
    arrow = false,
    block = false,
    icon,
    className,
    children,
    disabled,
    ...props
  },
  ref,
) {
  const reduce = useReducedMotion();

  const classes = cn(
    "group/btn relative inline-flex items-center justify-center overflow-hidden",
    "font-medium tracking-[-0.011em] whitespace-nowrap select-none",
    "transition-[background-color,box-shadow,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45",
    "outline-offset-2",
    VARIANTS[variant],
    SIZES[size],
    block && "w-full",
    className,
  );

  const content = (
    <>
      {/* Sheen — a single specular pass on hover. Primary/inverse only. */}
      {(variant === "primary" || variant === "inverse") && !reduce && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-none group-hover/btn:animate-[sheen_0.9s_cubic-bezier(0.25,1,0.5,1)] group-hover/btn:opacity-100"
          style={{
            background:
              variant === "primary"
                ? "linear-gradient(100deg, transparent, rgba(255,255,255,.16), transparent)"
                : "linear-gradient(100deg, transparent, rgba(36,56,232,.10), transparent)",
          }}
        />
      )}

      {loading ? (
        <Spinner />
      ) : (
        icon && <span className="relative shrink-0 [&>svg]:size-[1.15em]">{icon}</span>
      )}

      <span className={cn("relative", loading && "opacity-70")}>{children}</span>

      {arrow && (
        <span
          aria-hidden
          className="relative -mr-0.5 inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-[3px]"
        >
          <ArrowGlyph />
        </span>
      )}
    </>
  );

  const { target, rel, onClick, ...rest } = props as ButtonProps & {
    onClick?: React.MouseEventHandler<HTMLElement>;
  };

  const el = href ? (
    <Link
      href={href}
      className={classes}
      aria-busy={loading || undefined}
      target={target}
      rel={rel}
      onClick={onClick}
    >
      {content}
    </Link>
  ) : (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );

  if (magnetic) return <Magnetic strength={0.22}>{el}</Magnetic>;
  return el;
});

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
      <path
        d="M2.6 8h10.2M9.1 4.3 12.8 8l-3.7 3.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <motion.span
      aria-hidden
      className="relative mr-1 inline-block size-[1.05em] rounded-full border-2 border-current/25 border-t-current"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    />
  );
}

/** Icon-only control. Always requires an accessible label. */
export function IconButton({
  label,
  children,
  className,
  variant = "ghost",
  size = 40,
  ...props
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  variant?: "ghost" | "surface";
  size?: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      style={{ width: size, height: size }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xs transition-all duration-200",
        "active:scale-93 [&>svg]:size-[18px]",
        variant === "ghost"
          ? "text-ink-500 hover:bg-ink-50 hover:text-ink-900"
          : "text-ink-600 bg-surface hairline hover:text-ink-900 shadow-e1 hover:shadow-e2",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
