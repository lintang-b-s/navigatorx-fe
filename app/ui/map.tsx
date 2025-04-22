"use client";

import * as React from "react";
import {
  Map,
  Marker,
  useMap,
  GeolocateControl,
  Source,
  Layer,
  NavigationControl,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css"; // See notes below
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MapComponentProps } from "../types/definition";
import { LineData } from "../page";
import Image from "next/image";

export function MapComponent({
  lineData,
  onUserLocationUpdateHandler,
  alternativeRoutes,
  activeRoute,
  isDirectionActive,
  routeData,
}: MapComponentProps) {
  const dummyRoute: LineData = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [-100, 40],
        [-100, 40],
      ],
    },
  };
  alternativeRoutes = [dummyRoute, ...alternativeRoutes!];
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
      <NavigationControl position="bottom-right" />

      {/* show shortest path route on below of active route  if sp path not activeRoute*/}
      {!isDirectionActive && activeRoute != 0 && lineData && (
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
              "line-color": "#D5ACFF",
              "line-width": 5,
            }}
          />
        </Source>
      )}

      {!isDirectionActive &&
        alternativeRoutes?.length != 0 &&
        alternativeRoutes
          ?.filter((_, i) => i !== 0 && i !== activeRoute)
          .map((route, index) => {
            return (
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
            );
          })}

      {/* active route is in alternative routes */}
      {activeRoute != 0 && alternativeRoutes?.[activeRoute] && (
        <>
          <Source
            id="active-route-source"
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates:
                  alternativeRoutes[activeRoute].geometry.coordinates,
              },
              properties: {},
            }}
          >
            <Layer
              id="active-route-layer"
              type="line"
              source="active-route-source"
              paint={{
                "line-color": "#6111C1",
                "line-width": 5,
              }}
            />
          </Source>
        </>
      )}

      {isDirectionActive &&
        routeData &&
        routeData[activeRoute].driving_directions.map((turn, i) => {
          const turnIcon = getTurnIconDirection(turn.turn_type);
          if (turnIcon == "") {
            return null;
          }
          return (
            <Marker
              key={`turn-${i}`}
              longitude={turn.turn_point.lon}
              latitude={turn.turn_point.lat}
              anchor="center"
              scale={0.55}
            >
              <Image
                src={turnIcon}
                alt="turn icon"
                width={30}
                height={30}
                style={{
                  transform: `rotate(${
                    (turn.turn_bearing * 180) / Math.PI
                  }deg)`,
                }}
              />
            </Marker>
          );
        })}

      {/* active route is shortest path route */}
      {activeRoute == 0 && lineData && (
        <>
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
        </>
      )}
    </Map>
  );
}

function getTurnIconDirection(turnType: string): string {
  switch (turnType) {
    case "TURN_RIGHT":
      return "/icons2/turn-right.png";
    case "TURN_SHARP_RIGHT":
      return "/icons2/turn-right.png";
    case "TURN_LEFT":
      return "/icons2/turn-left.png";
    case "TURN_SHARP_LEFT":
      return "/icons2/turn-left.png";
    case "U_TURN_RIGHT":
      return "/icons2/u-turn-right.png";
    case "U_TURN_LEFT":
      return "/icons2/u-turn-left.png";
    case "":
      return "/icons2/straight.png";
    case "KEEP_RIGHT":
      return "/icons2/turn-slight-right.png";
    case "KEEP_LEFT":
      return "/icons2/turn-slight-left.png";
  }
  return "";
}
