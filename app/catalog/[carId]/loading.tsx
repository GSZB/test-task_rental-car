import Loader from "@/components/Loader/Loader";
import css from "./CarDetails.module.css";

export default function Loading() {
  return (
    <div className={css.car__loading}>
      <Loader
        title="Loading car details..."
        description="Please wait while we fetch this car for you"
      />
    </div>
  );
}
