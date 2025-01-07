/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";
import { debounce } from "lodash";
import getData from "@/api/getData.api";

export default function Autocomplete({
  api,
  filtercb,
  onChange,
  className,
  nquery,
}: {
  api: string;
  onChange: Function;
  nquery: string;
  filtercb?: Function;
  className: string;
}) {
  const [options, setOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [query, setQuery] = React.useState(""); // Search input query
  // const [selected, setSelected] = React.useState<{
  //   value: string;
  //   label: string;
  // } | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Fetch data dynamically based on query
  const fetchData = async (searchQuery = "") => {
    setLoading(true);
    const filter = {
      limit: 10,
      fields: {
        name: true,
        id: true,
      },
      ...(searchQuery
        ? {
            where: {
              $a: {
                like: {
                  name: searchQuery,
                },
              },
            },
          }
        : {}),
    };

    try {
      const response: any = await getData(
        api,
        filtercb ? filtercb(searchQuery) : filter
      ); // Replace with your API logic
      const newOptions = response.data.map((item: any) => ({
        value: `${item.id}`,
        label: `${item.name}(${item.mobile})`,
      }));
      setOptions(newOptions);
    } catch (error) {
      setOptions([]); // Clear options on error
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch function
  const debouncedFetch = React.useCallback(
    debounce((searchQuery: string) => fetchData(searchQuery), 300),
    []
  );

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input); // Update query
    debouncedFetch(input); // Fetch options
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  React.useEffect(() => {
    setQuery(nquery);
  }, [nquery]);
  return (
    <>
      <div className={className}>
        {/* Input field */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search Customer"
          className="w-full px-2 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-8"
        />
        {query && (
          <div className="absolute z-10 mt-1 w-auto bg-white border border-gray-300 rounded-md shadow-lg">
            {loading ? (
              <div className="p-2 text-sm text-gray-500">Loading...</div>
            ) : options.length > 0 ? (
              <ul className="max-h-60 overflow-auto text-sm">
                {options.map((option) => (
                  <li
                    key={option.value}
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    onClick={() => {
                      onChange(option.value);
                      // setSelected(option);
                      setQuery(option.label); // Update input with selected value
                      setOptions([]); // Close dropdown
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            ) : (
              ""
              // <div className="text-200 text-gray-500 h-auto">No results found.</div>
            )}
          </div>
        )}

        {/* {selected && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: <span className="font-medium">{selected.label}</span>
          </div>
        )} */}
      </div>
    </>
  );
}
