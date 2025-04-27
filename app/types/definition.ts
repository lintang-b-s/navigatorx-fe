import { Dispatch, MouseEvent, RefObject, SetStateAction } from "react";
import { Place } from "../lib/searchApi";
import { RouteResponse } from "../lib/navigatorxApi";

export type SearchBoxProps = {
  isSource: boolean;
  activate: (val: boolean) => void;
};

export type RouterProps = {
  sourceSearchActive: (val: boolean) => void;
  destinationSearchActive: (val: boolean) => void;
  onHandleGetRoutes: (e: any) => void;
  isSourceFocused: boolean;
  isDestinationFocused: boolean;
  onHandleReverseGeocoding: (e: any, isSource: boolean) => void;
  routeData?: RouteResponse[];
  activeRoute: number;
  routeStarted: boolean;
  handleRouteClick: (index: number) => void;
  handleDirectionActive: (show: boolean) => void;
  handleSetNextTurnIndex: (index: number) => void;
  handleStartRoute: (start: boolean) => void;
  distanceFromNextTurnPoint: number;
  currentDirectionIndex: number;
  userLoc: UserLocation;
  sourceLoc?: Place;
  handleSetRouteData: (routeData: RouteResponse[]) => void;
};

export type SearchSelectorProps = {
  places: Place[];
  select: (place: Place) => void;
};

export type MapComponentProps = {
  lineData?: LineData;
  alternativeRoutes?: LineData[];
  onUserLocationUpdateHandler: (lat: number, lon: number) => void;
  activeRoute: number;
  isDirectionActive: boolean;
  routeData?: RouteResponse[];
  nextTurnIndex: number;
  onSelectSource: (place: Place) => void;
  onSelectDestination: (place: Place) => void;
  snappedGPSLoc: GPSTrace | undefined;
  routeStarted: boolean;
  gpsHeading: number;
};

export type LineData = {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
};

export type GPSTrace = {
  lat: number;
  lon: number;
};
