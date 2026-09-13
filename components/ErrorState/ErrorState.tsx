"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { PiWarningCircle } from "react-icons/pi";
import css from "./ErrorState.module.css";

interface ErrorStateProps {
  title?: string;
  description?: string;
  reset: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "We could not load this page. Check your connection and try again.",
  reset,
}: ErrorStateProps) {
  const router = useRouter();
  const [isRetrying, startTransition] = useTransition();

  // reset() alone re-renders the segment with the same failed server data, so
  // the route is refreshed first to make the server fetch again.
  const handleRetry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return (
    <div className={css["error-state"]} role="alert">
      <PiWarningCircle
        className={css["error-state__icon"]}
        aria-hidden="true"
      />
      <h2 className={css["error-state__title"]}>{title}</h2>
      <p className={css["error-state__description"]}>{description}</p>
      <button
        type="button"
        className={css["error-state__button"]}
        onClick={handleRetry}
        disabled={isRetrying}
      >
        {isRetrying ? "Retrying..." : "Try again"}
      </button>
    </div>
  );
}
