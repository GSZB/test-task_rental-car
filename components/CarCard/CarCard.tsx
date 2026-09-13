import Image from "next/image";
import Link from "next/link";
import { formatMileage, formatPrice } from "@/lib/format";
import type { Car } from "@/types/car";
import css from "./CarCard.module.css";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <article className={css["car-card"]}>
      <div className={css["car-card__image-wrapper"]}>
        <Image
          src={car.img}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="244px"
          className={css["car-card__image"]}
        />
      </div>

      <div className={css["car-card__body"]}>
        <div className={css["car-card__heading"]}>
          <h2 className={css["car-card__title"]}>
            {car.brand}{" "}
            <span className={css["car-card__model"]}>{car.model}</span>,{" "}
            {car.year}
          </h2>
          <p className={css["car-card__price"]}>
            {formatPrice(car.rentalPrice)}
          </p>
        </div>

        <div className={css["car-card__meta"]}>
          <ul className={css["car-card__meta-row"]}>
            <li className={css["car-card__meta-item"]}>{car.location.city}</li>
            <li className={css["car-card__meta-item"]}>
              {car.location.country}
            </li>
            <li className={css["car-card__meta-item"]}>{car.rentalCompany}</li>
          </ul>
          <ul className={css["car-card__meta-row"]}>
            <li className={css["car-card__meta-item"]}>{car.type}</li>
            <li className={css["car-card__meta-item"]}>
              {formatMileage(car.mileage)}
            </li>
          </ul>
        </div>
      </div>

      {/* Opens in a new tab, so prefetching it in this one is wasted work. */}
      <Link
        href={`/catalog/${car.id}`}
        target="_blank"
        rel="noopener noreferrer"
        prefetch={false}
        aria-label={`Read more about ${car.brand} ${car.model}, ${car.year}, article ${car.stockNumber} (opens in a new tab)`}
        className={css["car-card__button"]}
      >
        Read more
      </Link>
    </article>
  );
}
