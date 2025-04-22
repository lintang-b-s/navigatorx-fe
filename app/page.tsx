"use client";
import Image from "next/image";
import { MapComponent } from "@/app/ui/map";
import { Router } from "@/app/ui/routing";
import { SearchResults } from "./ui/searchResult";
import { MouseEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { fetchReverseGeocoding, fetchSearch, Place } from "@/app/lib/searchApi";
import toast from "react-hot-toast";
import {
  fetchAlternativeRoutes,
  fetchRoute,
  RouteResponse,
} from "./lib/navigatorxApi";
import polyline from "@mapbox/polyline";
import { Layer, Source } from "@vis.gl/react-maplibre";

export type LineData = {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
};

export default function Home() {
  const [showResult, setShowResult] = useState(false);
  const [isSourceFocused, setIsSourceFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [polylineData, setPolylineData] = useState<LineData>();
  const [alternativeRoutesLineData, setAlternativeRoutesLineData] = useState<
    LineData[]
  >([]);

  const [isDirectionActive, setIsDirectionActive] = useState(false);

  const [activeRoute, setActiveRoute] = useState(0);

  const [routeData, setRouteData] = useState<RouteResponse[]>();

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
    replace(`${pathname}`);
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
    setSourceLoc(place);
    pushParam("source", place);
  };

  const onSelectDestination = (place: Place) => {
    setDestinationLoc(place);
    pushParam("destination", place);
  };

  const handleFocusSourceSearch = (val: boolean) => {
    setIsSourceFocused(val);
  };

  const onHandleStartRoute = async (
    e: MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log("sourceLoc", sourceLoc);
    console.log("destinationLoc", destinationLoc);
    if (!sourceLoc || !destinationLoc) {
      toast.error("Please select both source and destination");
    }
    console.log("tess");
    e.preventDefault();

    try {
      const reqBody = {
        srcLat: sourceLoc?.osm_object.lat!,
        srcLon: sourceLoc?.osm_object.lon!,
        destLat: destinationLoc?.osm_object.lat!,
        destLon: destinationLoc?.osm_object.lon!,
      };
      const [spRouteData, alternativeRouteData] = await Promise.all([
        fetchRoute(reqBody),
        fetchAlternativeRoutes(reqBody),
      ]);

      const coords = polyline.decode(spRouteData.path);
      const linedata: LineData = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coords.map((coord) => [coord[1], coord[0]]),
        },
      };

      console.log("linedata", linedata);
      setPolylineData(linedata);
      setAlternativeRoutesLineData(
        alternativeRouteData.routes.slice(1).map((route) => {
          const coords = polyline.decode(route.path);
          return {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: coords.map((coord) => [coord[1], coord[0]]),
            },
          };
        })
      );
      setRouteData([spRouteData, ...alternativeRouteData.routes.slice(1)]);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onHandleReverseGeocoding = async (
    e: MouseEvent<HTMLButtonElement, MouseEvent>,
    isSource: boolean
  ) => {
    if (!userLoc) {
      toast.error("Please select both source and destination");
    }
    try {
      const resp = await fetchReverseGeocoding({
        lat: userLoc.latitude,
        lon: userLoc.longitude,
      });

      const newUserLoc = {
        osm_object: {
          id: 0,
          name: resp.data.data.name,
          lat: resp.data.data.lat,
          lon: resp.data.data.lon,
          address: resp.data.data.address,
          type: "source",
        },
        distance: 0,
      };
      if (isSource) {
        console.log("push param source", newUserLoc);
        setSourceLoc(newUserLoc);

        pushParam("source", newUserLoc);
      } else {
        setDestinationLoc(newUserLoc);
        pushParam("destination", newUserLoc);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onUserLocationUpdateHandler = (lat: number, lon: number) => {
    setUserLoc({
      latitude: lat,
      longitude: lon,
    });
  };

  const handleRouteClick = (index: number) => {
    setActiveRoute(index);
  };

  const handleDirectionActive = (show: boolean) => {
    setIsDirectionActive(show);
  };

  return (
    <main className="flex relative  w-full overflow-hidden">
      <MapComponent
        lineData={polylineData}
        onUserLocationUpdateHandler={onUserLocationUpdateHandler}
        alternativeRoutes={alternativeRoutesLineData}
        activeRoute={activeRoute}
        isDirectionActive={isDirectionActive}
        routeData={routeData}
      />
      <Router
        sourceSearchActive={handleFocusSourceSearch}
        destinationSearchActive={setIsDestinationFocused}
        onHandleStartRoute={onHandleStartRoute}
        isSourceFocused={isSourceFocused}
        isDestinationFocused={isDestinationFocused}
        onHandleReverseGeocoding={onHandleReverseGeocoding}
        routeData={routeData}
        handleRouteClick={handleRouteClick}
        activeRoute={activeRoute}
        handleDirectionActive={handleDirectionActive}
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
