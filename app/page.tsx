"use client";
import Image from "next/image";
import { MapComponent } from "@/app/ui/map";
import { Router } from "@/app/ui/route";
import { SearchResults } from "./ui/searchResult";
import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { fetchSearch, Place } from "@/app/lib/searchApi";
import toast from "react-hot-toast";

export default function Home() {
  const [showResult, setShowResult] = useState(false);
  const [isSourceFocused, setIsSourceFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const destination = searchParams.get("destination");

  const [searchResults, setSearchResults] = useState<Place[]>([]);

  const [sourceLoc, setSourceLoc] = useState<Place>();
  const [destinationLoc, setDestinationLoc] = useState<Place>();
  const pathname = usePathname();

  const { replace } = useRouter();

  const [userLoc, setUserLoc] = useState<UserLocation>({
    longitude: -100,
    latitude: 40,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLoc({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          toast.error(error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (
      !(isSourceFocused && source) &&
      !(isDestinationFocused && destination)
    ) {
      setShowResult(false);
    }
    if (isSourceFocused && source) {
      fetchSearch(source, userLoc.latitude, userLoc.longitude)
        .then((resp) => setSearchResults(resp.data))
        .catch((e) => toast.error(e.error));
      setShowResult(true);
    }

    if (isDestinationFocused && destination) {
      fetchSearch(destination, userLoc.latitude, userLoc.longitude)
        .then((resp) => setSearchResults(resp.data))
        .catch((e) => toast.error(e.error));
      setShowResult(true);
    }
  }, [isSourceFocused, searchParams, isDestinationFocused]);

  const pushParam = (key: "source" | "destination", place: Place) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set(key, `${place.osm_object.name}, ${place.osm_object.address}`);
    replace(`${pathname}?${p.toString()}`);
  };

  const onSelectSource = (place: Place) => {
    console.log("palce", place);
    setSourceLoc(place);
    pushParam("source", place);
  };
  const onSelectDestination = (place: Place) => {
    console.log("palce", place);
    setDestinationLoc(place);
    pushParam("destination", place);
  };

  return (
    <main className="flex relative  w-full overflow-hidden">
      <MapComponent />
      <Router
        sourceSearchActive={setIsSourceFocused}
        destinationSearchActive={setIsDestinationFocused}
      />

      {showResult && isSourceFocused && (
        <SearchResults places={searchResults} select={onSelectSource} />
      )}
      {showResult && isDestinationFocused && (
        <SearchResults places={searchResults} select={onSelectDestination} />
      )}
    </main>
  );
}
