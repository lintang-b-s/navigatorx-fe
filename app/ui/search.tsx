'use client';   
import { CiSearch } from "react-icons/ci";
import { SearchBoxProps } from "../types/definition";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchBox({ isSource }: SearchBoxProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term, isSource) => {
    console.log(`Source... ${term}`);

    const params = new URLSearchParams(searchParams);
    if (isSource) {
      if (term) {
        params.set("source", term);
      } else {
        params.delete("source");
      }
    } else {
      if (term) {
        params.set("destination", term);
      } else {
        params.delete("destination");
      }
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <input
        type="text"
        className="h-[40px] w-[220px] px-4 rounded focus:outline-none  bg-[#F2F4F7]
        text-[#869ca7] text-base "
        placeholder={`${isSource ? "Source" : "Destination"}`}
        onChange={(e) => {
          handleSearch(e.target.value, isSource);
        }}
        defaultValue={searchParams
          .get(`${isSource ? "source" : "destination"}`)
          ?.toString()}
      />
      <div className="absolute top-2 right-4">
        <CiSearch size={20} color="#959AA6" />
      </div>
    </div>
  );
}
