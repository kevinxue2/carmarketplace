import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL;


export default function CarSelectorCard() {
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${baseUrl}/api/filter/makes`)
      .then(res => res.json())
      .then(setMakes)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!make) {
      setModels([]);
      return;
    }

    fetch(`${baseUrl}/api/filter/models?make=${make}`)
      .then(res => res.json())
      .then(setModels)
      .catch(console.error);
  }, [make]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-700 shadow-xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Find Your Car</h2>
        <select
          value={make}
          onChange={(e) => {
            setMake(e.target.value);
            setModel("");
          }}
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Make</option>
          {makes.map((makeItem) => (
            <option key={makeItem} value={makeItem}>
              {makeItem}
            </option>
          ))}
        </select>

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!make}
        >
          <option value="">{make ? "Select Model" : "Select Make First"}</option>
          {models.map((modelItem) => (
            <option key={modelItem} value={modelItem}>
              {modelItem}
            </option>
          ))}
        </select>

        <button
          className="mt-6 w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-gray-300"
          onClick={() => {
            let url = `/cars?make=${encodeURIComponent(make)}`;
            if (model) {
            url += `&model=${encodeURIComponent(model)}`;
            }
            navigate(url);
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}