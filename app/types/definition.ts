import { Dispatch, MouseEvent, RefObject, SetStateAction } from "react";
import { Place } from "../lib/searchApi";
import { LineData } from "../page";
import { RouteResponse } from "../lib/navigatorxApi";

export type SearchBoxProps = {
  isSource: boolean;
  activate: (val: boolean) => void;
};

export type RouterProps = {
  sourceSearchActive: (val: boolean) => void;
  destinationSearchActive: (val: boolean) => void;
  onHandleStartRoute: (e: any) => void;
  isSourceFocused: boolean;
  isDestinationFocused: boolean;
  onHandleReverseGeocoding: (e: any, isSource: boolean) => void;
  routeData?: RouteResponse[];
  activeRoute: number;
  handleRouteClick: (index: number) => void;
  handleDirectionActive: (show: boolean) => void;
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
};
