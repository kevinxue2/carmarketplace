import { ChevronFirst, ChevronLast } from "lucide-react"
import { createContext, useContext, useState, useEffect} from "react"
import { useSearchParams } from "react-router-dom"

const baseUrl = import.meta.env.VITE_API_URL;

interface SidebarContextType {
  expanded: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export default function FilterSideBar() {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const [minYear, setMinYear] = useState<string | null>(null);
  const [maxYear, setMaxYear] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<string | null>(null);
  const [minKilometers, setMinKilometers] = useState<string | null>(null);
  const [maxKilometers, setMaxKilometers] = useState<string | null>(null);


  const handleChanges = () => {
    searchParams.set("page", "1");

    const setRangeParam = (
      key: string,
      min: string | null,
      max: string | null
    ) => {
      if (min || max) {
        searchParams.set(key, `${min ?? ""},${max ?? ""}`);
      } else {
        searchParams.delete(key);
      }
    };

    setRangeParam("year", minYear, maxYear);
    setRangeParam("price", minPrice, maxPrice);
    setRangeParam("kilometers", minKilometers, maxKilometers);

    setSearchParams(searchParams);
  };

  return (
    <aside
        className={`fixed left-0 top-16 bottom-0 bg-gray-900 border-r shadow-sm z-20 transition-all duration-300 ${
          expanded ? "w-80" : "w-16"
        }`}
      >
      <nav className="h-full flex flex-col">
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            <FilterItem
            label='Make'
            paramKey='make'
            reset='model'
            fetchUrl={`${baseUrl}/api/filter/makes`}
            />
            <FilterItem
            label='Model'
            paramKey='model'
            fetchUrl={`${baseUrl}/api/filter/models`}
            />
            <FilterRange
            label='Year'
            value1={minYear}
            value2={maxYear}
            onChange1={setMinYear}
            onChange2={setMaxYear}
            />
            <FilterRange
            label='Price'
            value1={minPrice}
            value2={maxPrice}
            onChange1={setMinPrice}
            onChange2={setMaxPrice}
            />
            <FilterRange
            label='Kilometers'
            value1={minKilometers}
            value2={maxKilometers}
            onChange1={setMinKilometers}
            onChange2={setMaxKilometers}
            />
          </ul>
        </SidebarContext.Provider>

        {expanded && (
            <div className="px-3 pb-4 pt-2">
              <button
                onClick={handleChanges}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold shadow hover:bg-blue-700 transition"
              >
                Apply Filters
              </button>
            </div>
          )}
        <div className="p-1 border-t border-gray-700">
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-800 transition-colors text-white"
              title={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {expanded ? (
                <ChevronFirst className="w-5 h-5" />
              ) : (
                <ChevronLast className="w-5 h-5" />
              )}
            </button>
          </div>
      </nav>
    </aside>
  )
}

interface FilterItemProps {
  label: string
  paramKey: string
  reset?: string
  fetchUrl: string
  param?: string;
}

export function FilterItem({ label, paramKey, reset, fetchUrl}: FilterItemProps) {
  const context = useContext(SidebarContext)
  if (!context) throw new Error("SidebarItem must be used within FilterSideBar")
  const { expanded } = context
  
  const [searchParams, setSearchParams] = useSearchParams()
  const [options, setOptions] = useState<string[]>([])
  const [value, setValue] = useState(searchParams.get(paramKey))

  useEffect(() => {
    var make = searchParams.get("make");
    if (!expanded) return
    fetch(`${fetchUrl}?make=${make}`)
      .then(res => res.json())
      .then(setOptions)
  }, [fetchUrl, expanded, searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value)
    e.preventDefault()
    searchParams.set('page', '1')
    if (reset){
      searchParams.delete("model")
    }
    if (e.target.value) {
      searchParams.set(paramKey, e.target.value)
      setSearchParams(searchParams)
    } else {
      searchParams.delete(paramKey)
      setSearchParams(searchParams)
    }
  }

  return (
    <li className="flex flex-col px-3 py-2 my-1 rounded-lg">
      {expanded && <>
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <select
        value={value ?? ""}
        onChange={handleChange}
        disabled={!expanded}
        className="rounded-md border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-100"
      >
        <option value="">All</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      </>}
    </li>
  )
}

interface FilterRangeProps {
  label: string
  value1: string | null
  value2: string | null
  onChange1: (value: string | null) => void
  onChange2: (value: string | null) => void
}

export function FilterRange({ label, value1, value2, onChange1, onChange2}: FilterRangeProps) {
  const context = useContext(SidebarContext)
  if (!context) throw new Error("SidebarItem must be used within FilterSideBar")
  const { expanded } = context

  return (
    <li className="flex flex-col px-3 py-2 my-1 rounded-lg">
      {expanded && <>
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="flex space-x-2">
        <input
          type="number"
          value={value1 ?? ""}
          onChange={(e) => onChange1(e.target.value)}
          disabled={!expanded}
          placeholder="Min"
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-100"
        />
        <input
          type="number"
          value={value2 ?? ""}
          onChange={(e) => onChange2(e.target.value)}
          disabled={!expanded}
          placeholder="Max"
          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm disabled:bg-gray-100"
        />
      </div>
      </>}
    </li>
  )
}