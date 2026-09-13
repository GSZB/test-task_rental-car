import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container/Container";
import css from "./Home.module.css";

export default function HomePage() {
  return (
    <section className={css.hero}>
      <Image
        src="/hero.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className={css.hero__image}
      />
      <div className={css.hero__overlay} />

      <Container>
        <div className={css.hero__content}>
          <h1 className={css.hero__title}>Find your perfect rental car</h1>
          <p className={css.hero__subtitle}>
            Reliable and budget-friendly rentals for any journey
          </p>
          <Link href="/catalog" className={css.hero__button}>
            View Catalog
          </Link>
        </div>
      </Container>
    </section>
  );
}
