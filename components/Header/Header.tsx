import Link from "next/link";
import Container from "@/components/Container/Container";
import Navigation from "@/components/Navigation/Navigation";
import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.header}>
      <Container>
        <div className={css.header__inner}>
          <Link href="/" className={css.header__logo}>
            Rental<span className={css["header__logo-accent"]}>Car</span>
          </Link>

          <Navigation />
        </div>
      </Container>
    </header>
  );
}
