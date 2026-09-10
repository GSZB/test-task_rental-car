import Loader from "@/components/Loader/Loader";
import css from "./Catalog.module.css";

export default function Loading() {
  return (
    <div className={css.catalog__loading}>
      <Loader />
    </div>
  );
}
