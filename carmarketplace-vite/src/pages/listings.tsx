import { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from '../components/CarCard';
import type { ListingResponse } from '../models/ListingResponse';
import type { Car } from '../models/Car'
import PageNavigator from '../components/PageNavigator';
import FilterSideBar from '../components/FilterSideBar';
import { useSearchParams } from 'react-router-dom';

function Listings() {
  const [data, setData] = useState<ListingResponse>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 30;

  const make = searchParams.get('make') || undefined;
  const model = searchParams.get('model') || undefined;
  const year = searchParams.get('year') || undefined;
  const price = searchParams.get('price') || undefined;
  const kilometers = searchParams.get('kilometers') || undefined;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<ListingResponse>('https://carmarketplace-api.onrender.com/api/listing/all',
          {
            params: {
                  page,
                  pageSize,
                  ...(make ? { make } : {}),
                  ...(model ? { model } : {}),
                  ...(year ? { year } : {}),
                  ...(price ? { price } : {}),
                  ...(kilometers ? { kilometers } : {}),
            }
          }
        );
        setData(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, pageSize, make, model, year, price, kilometers]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="flex">
        <div>
          <FilterSideBar/>
        </div>
        <div className="flex-1 p-4">
          <PageNavigator
            page={data?.page ?? 1}
            pageSize={data?.pageSize ?? 30}
            total={data?.totalItems ?? 0}
            totalPages={data?.totalPages ?? 1}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {Array.isArray(data?.data) &&
              data.data.map((car: Car) => <CarCard key={car.id} car={car} />)}
          </div>
        </div>
      </div>
    </>
    
  );
}

export default Listings;