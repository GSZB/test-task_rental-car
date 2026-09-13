export interface CarLocation {
  country: string;
  city: string;
  address: string;
}

export interface Car {
  id: string;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: number;
  engine: string;
  rentalPrice: string;
  rentalCompany: string;
  rentalConditions: string[];
  mileage: number;
  stockNumber: number;
  features: string[];
  location: CarLocation;
  createdAt: string;
  updatedAt: string;
}

export interface CarsResponse {
  cars: Car[];
  totalCars: number;
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CarFilters {
  brand?: string;
  price?: string;
  minMileage?: string;
  maxMileage?: string;
}

export interface FetchCarsParams extends CarFilters {
  page?: number;
  perPage?: number;
}

export interface CarFilterOptions {
  brands: string[];
  price: {
    min: number;
    max: number;
  };
}

export interface BookingRequest {
  name: string;
  email: string;
  comment: string;
}

export interface BookingResponse {
  message: string;
}
