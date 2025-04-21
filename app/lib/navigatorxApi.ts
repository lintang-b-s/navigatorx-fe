import axios from "axios";

export interface Direction {
  Instruction: string;
  Point: {
    lat: number;
    lon: number;
  };
  StreetName: string;
  ETA: number;
  Distance: number;
}

export interface CumulativeDirection extends Direction {
  cumulativeEta: number;
  cumulativeDistance: number;
}

export interface RouteResponse {
  path: string;
  distance: number;
  ETA: number;
  driving_directions: Direction[];
  found: boolean;
  algorithm: string;
}

export interface RouteRequest {
  srcLat: number;
  srcLon: number;
  destLat: number;
  destLon: number;
}

export interface AlternativeRoutesResponse {
  routes: RouteResponse[];
}

export const fetchRoute = async ({
  srcLat,
  srcLon,
  destLat,
  destLon,
}: RouteRequest): Promise<RouteResponse> => {
  try {
    const { data } = await axios.get(
      `http://168.231.118.7:5000/api/navigations/shortest-path?src_lat=${srcLat}&src_lon=${srcLon}&dst_lat=${destLat}&dst_lon=${destLon}`,
      {}
    );

    return data;
  } catch (error) {
    throw new Error("Failed to fetch search results");
  }
};

export const fetchAlternativeRoutes = async ({
  srcLat,
  srcLon,
  destLat,
  destLon,
}: RouteRequest): Promise<AlternativeRoutesResponse> => {
  try {
    const { data } = await axios.get(
      `http://168.231.118.7:5000/api/navigations/shortest-path-alternative-routes?src_lat=${srcLat}&src_lon=${srcLon}&dst_lat=${destLat}&dst_lon=${destLon}`,
      {}
    );

    return data;
  } catch (error) {
    throw new Error("Failed to fetch search results");
  }
};
