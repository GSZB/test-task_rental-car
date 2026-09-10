import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  PiCalendarBlank,
  PiCar,
  PiCheckCircle,
  PiGasPump,
  PiGear,
  PiMapPin,
  PiRoadHorizon,
} from "react-icons/pi";
import BookingForm from "@/components/BookingForm/BookingForm";
import Container from "@/components/Container/Container";
import { fetchCarById } from "@/lib/api/cars";
import { formatMileage, formatPrice } from "@/lib/format";
import type { Car } from "@/types/car";
import css from "./CarDetails.module.css";

async function getCar(carId: string): Promise<Car> {
  try {
    return await fetchCarById(carId);
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/catalog/[carId]">): Promise<Metadata> {
  const { carId } = await params;

  try {
    const car = await fetchCarById(carId);
    const title = `${car.brand} ${car.model}, ${car.year}`;

    return {
      title,
      description: car.description,
      openGraph: {
        title,
        description: car.description,
        images: [{ url: car.img, alt: title }],
      },
    };
  } catch {
    return { title: "Car not found" };
  }
}

export default async function CarDetailsPage({
  params,
}: PageProps<"/catalog/[carId]">) {
  const { carId } = await params;
  const car = await getCar(carId);

  const specifications = [
    { icon: PiCalendarBlank, label: "Year", value: car.year },
    { icon: PiCar, label: "Type", value: car.type },
    { icon: PiGasPump, label: "Fuel Consumption", value: car.fuelConsumption },
    { icon: PiGear, label: "Engine", value: car.engine },
    {
      icon: PiRoadHorizon,
      label: "Mileage",
      value: formatMileage(car.mileage),
    },
  ];

  return (
    <Container>
      <div className={css.car}>
        <div className={css.car__media}>
          <div className={css["car__image-wrapper"]}>
            <Image
              src={car.img}
              alt={`${car.brand} ${car.model}`}
              fill
              sizes="640px"
              priority
              className={css.car__image}
            />
          </div>

          <BookingForm carId={car.id} />
        </div>

        <div className={css.car__panel}>
          <div className={css.car__intro}>
            <div className={css.car__heading}>
              <h1 className={css.car__title}>
                {car.brand} {car.model}, {car.year}
              </h1>
              <p className={css.car__article}>Article: {car.stockNumber}</p>
            </div>

            <p className={css.car__location}>
              <PiMapPin className={css.car__pin} aria-hidden="true" />
              {car.location.city}, {car.location.country}
            </p>

            <p className={css.car__price}>{formatPrice(car.rentalPrice)}</p>

            <p className={css.car__description}>{car.description}</p>
          </div>

          <div className={css.car__info}>
            <section className={css.car__section}>
              <h2 className={css["car__section-title"]}>Rental Conditions:</h2>
              <ul className={css.car__list}>
                {car.rentalConditions.map((condition) => (
                  <li key={condition} className={css.car__item}>
                    <PiCheckCircle
                      className={css.car__icon}
                      aria-hidden="true"
                    />
                    {condition}
                  </li>
                ))}
              </ul>
            </section>

            <hr className={css.car__divider} />

            <section className={css.car__section}>
              <h2 className={css["car__section-title"]}>Car Specifications:</h2>
              <ul className={css.car__list}>
                {specifications.map(({ icon: Icon, label, value }) => (
                  <li key={label} className={css.car__item}>
                    <Icon className={css.car__icon} aria-hidden="true" />
                    {label}: {value}
                  </li>
                ))}
              </ul>
            </section>

            <hr className={css.car__divider} />

            <section className={css.car__section}>
              <h2 className={css["car__section-title"]}>Features</h2>
              <ul className={css.car__list}>
                {car.features.map((feature) => (
                  <li key={feature} className={css.car__item}>
                    <PiCheckCircle
                      className={css.car__icon}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
}
