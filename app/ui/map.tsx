"use client";

import * as React from "react";
import {
  Map,
  Marker,
  useMap,
  GeolocateControl,
  Source,
  Layer,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css"; // See notes below
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MapComponentProps } from "../types/definition";

export function MapComponent({
  lineData,
  onUserLocationUpdateHandler,
  alternativeRoutes,
}: MapComponentProps) {
  const [viewState, setViewState] = React.useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
  });

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
          toast.error(error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <Map
      {...viewState}
      style={{ width: "100vw", height: "100vh" }}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
    >
      <GeolocateControl
        position="bottom-right"
        onGeolocate={(e) => {
          onUserLocationUpdateHandler(e.coords.latitude, e.coords.longitude);
        }}
      />

      {alternativeRoutes?.length != 0 &&
        alternativeRoutes?.map((route, index) => (
          <Source
            key={`route-${index}`}
            id={`polyline-source-${index}`}
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: route.geometry.coordinates,
              },
              properties: {},
            }}
          >
            <Layer
              id={`polyline-layer-${index}`}
              type="line"
              source={`polyline-source-${index}`}
              paint={{
                "line-color": "#D5ACFF",
                "line-width": 4,
              }}
            />
          </Source>
        ))}

      {lineData && (
        <Source
          id="polyline-source"
          type="geojson"
          data={{
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: lineData.geometry.coordinates,
            },
            properties: {},
          }}
        >
          <Layer
            id="polyline-layer"
            type="line"
            source="polyline-source"
            paint={{
              "line-color": "#6111C1",
              "line-width": 5,
            }}
          />
        </Source>
      )}
    </Map>
  );
}
