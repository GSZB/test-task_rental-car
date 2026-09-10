import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container/Container";
import css from "./NotFound.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <Container>
      <div className={css["not-found"]}>
        <p className={css["not-found__code"]}>404</p>
        <h1 className={css["not-found__title"]}>This page does not exist</h1>
        <p className={css["not-found__description"]}>
          The page you are looking for was moved or never existed.
        </p>
        <Link href="/catalog" className={css["not-found__link"]}>
          Go to catalog
        </Link>
      </div>
    </Container>
  );
}
