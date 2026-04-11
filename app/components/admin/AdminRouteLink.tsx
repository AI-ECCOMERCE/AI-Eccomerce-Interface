"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  forwardRef,
  useMemo,
} from "react";
import { useAdminNavigation } from "./AdminNavigationProvider";

type AnchorProps = Omit<ComponentPropsWithoutRef<typeof Link>, keyof LinkProps | "href">;

type AdminRouteLinkProps = LinkProps &
  AnchorProps & {
    children: ReactNode;
    pendingClassName?: string;
  };

function isExternalHref(value: string) {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value) || value.startsWith("//");
}

function normalizePath(value: string) {
  if (!value) {
    return "/";
  }

  const pathname = new URL(value, "http://localhost").pathname;
  return pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

const AdminRouteLink = forwardRef<HTMLAnchorElement, AdminRouteLinkProps>(function AdminRouteLink(
  { href, onClick, className, pendingClassName, children, target, ...props },
  ref
) {
  const pathname = usePathname();
  const { startNavigation, isHrefPending } = useAdminNavigation();

  const hrefValue = useMemo(() => String(href), [href]);
  const hrefPath = useMemo(() => normalizePath(hrefValue), [hrefValue]);
  const currentPath = useMemo(() => normalizePath(pathname ?? "/"), [pathname]);
  const isPending = isHrefPending(hrefPath);

  const mergedClassName = [className, isPending && pendingClassName].filter(Boolean).join(" ");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (target && target !== "_self") {
      return;
    }

    if (isModifiedEvent(event) || event.button !== 0) {
      return;
    }

    if (isExternalHref(hrefValue)) {
      return;
    }

    if (hrefPath === currentPath) {
      return;
    }

    if (!hrefPath.startsWith("/admin")) {
      return;
    }

    startNavigation(hrefPath);
  };

  return (
    <Link
      {...props}
      ref={ref}
      href={href}
      target={target}
      onClick={handleClick}
      data-admin-pending={isPending ? "true" : undefined}
      className={mergedClassName || undefined}
    >
      {children}
    </Link>
  );
});

export default AdminRouteLink;
