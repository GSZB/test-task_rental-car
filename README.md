# RentalCar

Front-end for RentalCar, a car rental service. Browse the catalog, narrow it
down by brand, price and mileage, open a car to see its full specification, and
book it through a form.

**Live version:** https://test-task-rental-car.vercel.app

## Features

- **Home page** with a hero section and a call to action leading to the catalog.
- **Catalog** with a car grid loaded from the API. Filtering runs on the
  backend: brand, price and a mileage range are sent as query parameters, so the
  server returns only matching cars.
- **Load more pagination** built on `useInfiniteQuery`. New pages respect the
  active filters, and the button disappears on the last page.
- **Car details** with the photo, rental conditions, specifications and
  features. Opens in a new tab from the catalog.
- **Booking form** with validation and a notification showing the response from
  the API.
- Loading and error states for every asynchronous request, plus an empty state
  when no car matches the filters.

## Tech stack

- [Next.js](https://nextjs.org) with the App Router and TypeScript
- [TanStack Query](https://tanstack.com/query) for fetching, caching and
  infinite pagination
- [Axios](https://axios-http.com) as the HTTP client
- CSS Modules with BEM class names
- [Formik](https://formik.org) and [Yup](https://github.com/jquense/yup) for the
  booking form
- [React Icons](https://react-icons.github.io/react-icons/) and
  [React Hot Toast](https://react-hot-toast.com)

## Getting started

Requires Node.js 20 or newer.

```bash
git clone https://github.com/GSZB/test-task_rental-car.git
cd test-task_rental-car
npm install
cp .env.example .env.local
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable              | Description             | Default                             |
| --------------------- | ----------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend | `https://car-rental-api.goit.study` |

### Scripts

| Command          | Description                      |
| ---------------- | -------------------------------- |
| `npm run dev`    | Start the development server     |
| `npm run build`  | Create a production build        |
| `npm run start`  | Serve the production build       |
| `npm run lint`   | Run ESLint                       |
| `npm run format` | Format the project with Prettier |

## Project structure

```
app/                    routes (App Router)
  page.tsx              home page
  catalog/              catalog page and its client part
  catalog/[carId]/      car details page
components/             UI components, one folder per component
lib/api/                axios instance and API requests
lib/queries/            TanStack Query options and query keys
lib/                    formatting and filter helpers
types/                  shared TypeScript types
```

## API

The app talks to the public Rental Car API.

| Endpoint                          | Description                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| `GET /cars`                       | Car list. Accepts `brand`, `price`, `minMileage`, `maxMileage`, `page` and `perPage` |
| `GET /cars/filters`               | Available brands and the price range                                                 |
| `GET /cars/:id`                   | A single car                                                                         |
| `POST /cars/:id/booking-requests` | Sends a booking request                                                              |

Two details worth knowing: `perPage` cannot exceed 12, and `price` is an upper
bound rather than an exact match, so choosing 50 also returns cheaper cars.

## Author

Szabolcs Gonczy, [@GSZB](https://github.com/GSZB)
