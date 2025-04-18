"use client";

import * as React from "react";
import { Map, Marker, useMap, GeolocateControl } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css"; // See notes below
import { useEffect, useState } from "react";

import { FaRegDotCircle } from "react-icons/fa";

export function MapComponent() {
  const { current: map } = useMap();
  const [viewState, setViewState] = React.useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
  });
  const [error, setError] = useState<any>(null);

  const centerLocOnClick = () => {
    map?.flyTo({
      center: [viewState.longitude, viewState.latitude],
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 15,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);
  return (
    <Map
      {...viewState}
      style={{ width: "100vw", height: "100vh" }}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
    >
      <GeolocateControl position="bottom-right" />
    </Map>
  );
}
