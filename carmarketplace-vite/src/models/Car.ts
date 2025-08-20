export interface Car {
  id: number;
  createdAt: string;
  title: string;
  brand: string;
  model: string;
  trim?: string | null;
  price: number;
  transmission: string;
  kilometers: number;
  color: string;
  fuelType: string;
  link: string;
  location: string;
  photos?: string[] | null;
  year: number;
}