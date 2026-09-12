import { PiWarningCircle } from "react-icons/pi";
import css from "./ErrorState.module.css";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "We could not load this page. Check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
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
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  );
}
