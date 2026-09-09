"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./Navigation.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
] as const;

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={css.navigation}>
      <ul className={css.navigation__list}>
        {links.map(({ href, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <li key={href} className={css.navigation__item}>
              <Link
                href={href}
                className={`${css.navigation__link} ${
                  isActive ? css["navigation__link--active"] : ""
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
