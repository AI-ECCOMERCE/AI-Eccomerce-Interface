import { Suspense } from "react";
import PaymentPageClient from "./payment-client";

function PaymentPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentPageFallback />}>
      <PaymentPageClient />
    </Suspense>
  );
}
