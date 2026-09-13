import { api } from "./axios";
import type {
  BookingRequest,
  BookingResponse,
  Car,
  CarFilterOptions,
  CarsResponse,
  FetchCarsParams,
} from "@/types/car";

/** The backend rejects any `perPage` above 12. */
export const CARS_PER_PAGE = 12;

export async function fetchCars({
  page = 1,
  perPage = CARS_PER_PAGE,
  brand,
  price,
  minMileage,
  maxMileage,
}: FetchCarsParams = {}): Promise<CarsResponse> {
  const { data } = await api.get<CarsResponse>("/cars", {
    params: {
      page,
      perPage,
      ...(brand && { brand }),
      ...(price && { price }),
      ...(minMileage && { minMileage }),
      ...(maxMileage && { maxMileage }),
    },
  });

  return data;
}

export async function fetchCarById(id: string): Promise<Car> {
  const { data } = await api.get<Car>(`/cars/${encodeURIComponent(id)}`);

  return data;
}

export async function fetchCarFilterOptions(): Promise<CarFilterOptions> {
  const { data } = await api.get<CarFilterOptions>("/cars/filters");

  return data;
}

export async function createBookingRequest(
  carId: string,
  booking: BookingRequest,
): Promise<BookingResponse> {
  const { data } = await api.post<BookingResponse>(
    `/cars/${encodeURIComponent(carId)}/booking-requests`,
    booking,
  );

  return data;
}
