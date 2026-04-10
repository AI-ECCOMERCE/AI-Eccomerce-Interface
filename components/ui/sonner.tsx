"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border border-slate-200 shadow-lg",
          title: "text-sm font-semibold",
          description: "text-sm",
        },
      }}
      {...props}
    />
  );
}
