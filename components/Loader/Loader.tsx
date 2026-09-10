import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.loader} role="status" aria-live="polite">
      <span className={css.loader__spinner} />
      <p className={css.loader__title}>Loading cars...</p>
      <p className={css.loader__description}>
        Please wait while we fetch the best cars for you
      </p>
    </div>
  );
}
