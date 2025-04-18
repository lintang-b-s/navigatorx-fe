import { Dispatch, RefObject, SetStateAction } from "react";
import { Place } from "../lib/searchApi";

export type SearchBoxProps = {
  isSource: boolean;
  activate: Dispatch<SetStateAction<boolean>>;
};

export type RouterProps = {
  sourceSearchActive: Dispatch<SetStateAction<boolean>>;
  destinationSearchActive: Dispatch<SetStateAction<boolean>>;
};

export type SearchSelectorProps = {
  places: Place[];
  select: (place: Place) => void;
};
