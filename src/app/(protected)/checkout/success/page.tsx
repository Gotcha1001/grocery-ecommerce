// "use client";

// import FrontendLayout from "@/components/layouts/FrontendLayout";
// import { verifyStripeOrder } from "@/server-actions/checkout/verifyStripeOrder";
// import { useCartStore } from "@/store/cart-store";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { FiCheckCircle } from "react-icons/fi";

// export default function SuccessPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const clearCart = useCartStore((state) => state.clearCart);

//   const [timedOut, setTimedOut] = useState(false);

//   useEffect(() => {
//     const session_id = searchParams.get("session_id");

//     if (!session_id) {
//       router.replace("/");
//       return;
//     }

//     let attempts = 0;

//     const interval = setInterval(async () => {
//       attempts++;

//       const result = await verifyStripeOrder(session_id);

//       // Order has been created by the webhook

//       if (result.success && result.orderExists) {
//         clearInterval(interval);

//         toast.success("Order placed successfully.");

//         clearCart();

//         router.replace("/orders");

//         return;
//       }
//       if (attempts >= 10) {
//         clearInterval(interval);
//         setTimedOut(true);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [router, searchParams, clearCart]);
//   if (timedOut) {
//     <FrontendLayout>
//       <div className="flex min-h-[70vh items-center justify-center px-4]">
//         <div className="w-full max-w-md rounded-xl border border-border">
//           <div className="mx-auto flex h-16 w-16 items-center justify-center">
//             <FiCheckCircle size={32} className="text-green-600" />
//           </div>
//           <h1 className="mt-5 text-2xl font-semibold text-text">
//             Payment Received
//           </h1>
//           <p className="mt-3 text-sm leading-6 text-muted">
//             Your payment was successful, but we&apos;re still finalizing your
//             order. This usually only takes a few more seconds.
//           </p>
//           <button
//             type="button"
//             onClick={() => window.location.reload()}
//             className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm"
//           >
//             Check Again
//           </button>
//         </div>
//       </div>
//     </FrontendLayout>;
//   }

//   return (
//     <FrontendLayout>
//       <div className="flex min-h-[70vh] items-center justify-center px-4">
//         <div className="w-full max-w-md rounded-xl border border-border">
//           <div className="mx-auto flex h-16 w-16 items-center justify-center">
//             <FiCheckCircle size={32} className="text-green-600" />
//           </div>
//           <h1 className="mt-5 text-2xl font-semibold text-text">
//             Payment Successful
//           </h1>
//           <p className="mt-3 text-sm leading-6 text-muted">
//             Thank you for your order. Your payment has been successfully
//             processed and your order has been confirmed.
//           </p>
//           <div className="mt-6 flex flex-col gap-3 sm:flex-row">
//             <button
//               type="button"
//               onClick={() => router.replace("/orders")}
//               className="flex-1 rounded-lg bg-primary px-5 py-3 text-sm"
//             >
//               View My Orders
//             </button>
//             <button
//               type="button"
//               onClick={() => router.replace("/products")}
//               className="flex-1 rounded-lg border border-primary px-5 py-3"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         </div>
//       </div>
//     </FrontendLayout>
//   );
// }

"use client";

import FrontendLayout from "@/components/layouts/FrontendLayout";
import { verifyStripeOrder } from "@/server-actions/checkout/verifyStripeOrder";
import { useCartStore } from "@/store/cart-store";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertCircle, FiCheck, FiLoader, FiRefreshCw } from "react-icons/fi";

const MAX_ATTEMPTS = 10;

type StepStatus = "done" | "active" | "stalled" | "waiting";

function Step({
  status,
  title,
  detail,
  isLast,
}: {
  status: StepStatus;
  title: string;
  detail?: string;
  isLast?: boolean;
}) {
  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      {!isLast && (
        <span
          aria-hidden
          className={`absolute left-3 top-6 bottom-0 w-px -translate-x-1/2 ${
            status === "done" ? "bg-green-600/40" : "bg-border"
          }`}
        />
      )}

      <span
        aria-hidden
        className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
          status === "done"
            ? "border-green-600 bg-green-600 text-white"
            : status === "active"
              ? "border-primary text-primary"
              : status === "stalled"
                ? "border-amber-500 text-amber-500"
                : "border-border text-muted"
        }`}
      >
        {status === "done" && <FiCheck size={14} strokeWidth={3} />}
        {status === "active" && <FiLoader size={14} className="animate-spin" />}
        {status === "stalled" && <FiAlertCircle size={14} />}
      </span>

      <div className="min-w-0 pt-0.5">
        <p
          className={`text-sm font-medium ${
            status === "waiting" ? "text-muted" : "text-text"
          }`}
        >
          {title}
        </p>
        {detail && <p className="mt-0.5 text-sm text-muted">{detail}</p>}
      </div>
    </li>
  );
}

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  const [timedOut, setTimedOut] = useState(false);
  const [attempt, setAttempt] = useState(0); // bump to restart polling

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      router.replace("/");
      return;
    }

    let attempts = 0;
    let inFlight = false;
    let cancelled = false;

    const interval = setInterval(async () => {
      if (inFlight) return; // don't stack requests if one is slow
      inFlight = true;
      attempts++;

      try {
        const result = await verifyStripeOrder(sessionId);
        if (cancelled) return;

        // The webhook has created the order
        if (result.success && result.orderExists) {
          clearInterval(interval);
          toast.success("Order placed successfully.");
          clearCart();
          router.replace("/orders");
          return;
        }
      } catch {
        // Ignore and try again on the next tick
      } finally {
        inFlight = false;
      }

      if (!cancelled && attempts >= MAX_ATTEMPTS) {
        clearInterval(interval);
        setTimedOut(true);
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [router, searchParams, clearCart, attempt]);

  const handleCheckAgain = () => {
    setTimedOut(false);
    setAttempt((a) => a + 1);
  };

  const buttonBase =
    "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  const primaryButton = `${buttonBase} bg-primary text-white hover:opacity-90`;
  const secondaryButton = `${buttonBase} border border-border text-text hover:border-primary hover:text-primary`;

  return (
    <FrontendLayout>
      <style>{`
        @keyframes ring-pop {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes check-draw {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
        .ring-pop { animation: ring-pop 0.35s ease-out both; }
        .check-draw { stroke-dasharray: 24; animation: check-draw 0.6s 0.15s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .ring-pop, .check-draw { animation: none; }
        }
      `}</style>

      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md rounded-2xl border border-border p-6 shadow-sm sm:p-8"
          role="status"
          aria-live="polite"
        >
          {/* Check mark: draws itself once on load */}
          <div className="ring-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-600/10 text-green-600 ring-8 ring-green-600/5">
            <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden>
              <path
                className="check-draw"
                d="M5 12.5l4.5 4.5L19 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-center text-2xl font-semibold tracking-tight text-text">
            {timedOut ? "Payment received" : "Payment successful"}
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-muted">
            {timedOut
              ? "Your payment went through, but your order is taking longer than usual to show up. Check again, or look in My orders in a minute."
              : "Thank you for your order. We're confirming it now and will take you to your orders in a few seconds."}
          </p>

          {/* Progress: a real sequence, so steps are numbered by state, not decoration */}
          <ol className="mt-7 border-t border-border pt-6">
            <Step status="done" title="Payment received" />
            <Step
              status={timedOut ? "stalled" : "active"}
              title="Confirming your order"
              detail={
                timedOut
                  ? "Still waiting on confirmation."
                  : "This usually takes a few seconds."
              }
            />
            <Step status="waiting" title="Order ready" isLast />
          </ol>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {timedOut ? (
              <>
                <button
                  type="button"
                  onClick={handleCheckAgain}
                  className={primaryButton}
                >
                  <FiRefreshCw size={16} aria-hidden />
                  Check again
                </button>
                <button
                  type="button"
                  onClick={() => router.replace("/orders")}
                  className={secondaryButton}
                >
                  View my orders
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => router.replace("/orders")}
                  className={primaryButton}
                >
                  View my orders
                </button>
                <button
                  type="button"
                  onClick={() => router.replace("/products")}
                  className={secondaryButton}
                >
                  Continue shopping
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
}

// useSearchParams needs a Suspense boundary or `next build` will complain
export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
