import type { Car } from "./Car";

export interface ListingResponse {
  data: Car[];   // the list of listings
  page: number;      // current page
  pageSize: number;  // items per page
  totalItems: number;     // total listings
  totalPages: number; // total number of pages
}