"use client";
import { LiaSourcetree } from "react-icons/lia";
import { CiLocationOn } from "react-icons/ci";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Button } from "./button";
import { CiRoute } from "react-icons/ci";
import { SearchBox } from "./search";
import { useEffect, useState } from "react";
import { RouterProps } from "../types/definition";
import { CiGps } from "react-icons/ci";
import { getArrivalTime } from "@/app/lib/util";
import { CumulativeDirection, RouteResponse } from "../lib/navigatorxApi";

export function Router(props: RouterProps) {
  const [isSourceFocused, setIsSourceFocused] = useState(false);
  const [activeRoute, setActiveRoute] = useState(0);
  const [showDirections, setShowDirections] = useState(false);

  const handleRouteClick = (index: number) => {
    setActiveRoute(index);
  };

  const handleShowDirections = () => {
    setShowDirections(true);
  };

  useEffect(() => {
    if (props.isSourceFocused) {
      setIsSourceFocused(true);
    }
    if (props.isDestinationFocused) {
      setIsSourceFocused(false);
    }
  }, [props.isSourceFocused, props.isDestinationFocused]);

  return (
    <>
      {props.routeData &&
      !props.isSourceFocused &&
      !props.isDestinationFocused ? (
        showRouteResult(
          props,
          activeRoute,
          handleRouteClick,
          showDirections,
          handleShowDirections
        )
      ) : (
        <div
          className={`flex flex-col  h-[150px] w-[355px] sm:h-[200px] sm:w-[440px]  
       items-center  absolute top-10 left-[5%] md:left-10 bg-white
        rounded-lg overflow-hidden shadow-lg props.routeData`}
        >
          <div className="flex flex-row items-center gap-2 pt-8 px-4 ">
            <div className="flex flex-col gap-1 items-center ">
              <LiaSourcetree
                className="w-[20px] h-[20px] md:w-[25px] md:h-[25px] "
                color="#00A4EB"
              />
              <BiDotsVerticalRounded
                className="w-[20px] h-[20px] md:w-[25px] md:h-[25px] "
                color="#869CA7"
              />
              <CiLocationOn
                className="w-[20px] h-[20px] md:w-[25px] md:h-[25px] "
                color="#FF4B28"
              />
            </div>

            <div className="flex flex-col gap-4 items-start justify-center">
              <SearchBox isSource={true} activate={props.sourceSearchActive} />
              <SearchBox
                isSource={false}
                activate={props.destinationSearchActive}
              />
            </div>

            <Button onClick={(e) => props.onHandleStartRoute(e)}>
              <CiRoute size={30} />
            </Button>
          </div>

          <button
            onClick={(e) => {
              console.log(
                "reverse geocode click, isSourceFocused:",
                isSourceFocused
              );
              props.onHandleReverseGeocoding(e, isSourceFocused);
            }}
            className={`flex flex-row px-4 mt-2  ${
              props.isSourceFocused || props.isDestinationFocused
                ? `opacity-100`
                : `opacity-0`
            }
          items-center space-x-4 cursor-pointer hover:bg-[#EDF3F6] w-full flex-1 `}
          >
            <CiGps size={25} color="#00A4EB" />{" "}
            <p className="text-sm ">Your Location</p>
          </button>
        </div>
      )}
    </>
  );
}

function showRouteResult(
  props: RouterProps,
  activeRoute: number,
  handleRouteClick: (index: number) => void,
  showDirections: boolean = false,
  handleShowDirections: () => void
) {
  return (
    <div
      className={`flex  flex-col  h-[150px] w-[355px] sm:h-full sm:w-[400px]  
   absolute top-0 md:left-0 bg-white
  rounded-lg overflow-hidden shadow-lg props.routeData`}
    >
      <div className="flex  px-4 flex-col items-center py-2">
        <h3 className="text-center text-lg font-bold text-[#202124] tracking-wide">
          Rute Jalan
        </h3>
        <div className="flex flex-row items-center gap-2 pt-8 px-4 ">
          <div className="flex flex-col gap-1 items-center ">
            <LiaSourcetree
              className="w-[20px] h-[20px] md:w-[25px] md:h-[25px] "
              color="#00A4EB"
            />
            <BiDotsVerticalRounded
              className="w-[20px] h-[20px] md:w-[25px] md:h-[25px] "
              color="#869CA7"
            />
            <CiLocationOn
              className="w-[20px] h-[20px] md:w-[25px] md:h-[25px] "
              color="#FF4B28"
            />
          </div>

          <div className="flex flex-col gap-4 items-start justify-center">
            <SearchBox isSource={true} activate={props.sourceSearchActive} />
            <SearchBox
              isSource={false}
              activate={props.destinationSearchActive}
            />
          </div>

          <Button onClick={(e) => props.onHandleStartRoute(e)}>
            <CiRoute size={30} />
          </Button>
        </div>
      </div>

      <div className="h-[20px] mt-8 w-full bg-[#E8EAED] "></div>

      {!showDirections ? (
        <div className="flex flex-col  py-2 flex-1">
          <p className="text-left text-base text-[#666666] mt-2 mb-2">Rute</p>

          {props.routeData &&
            props.routeData.map((route, index) => (
              <div
                key={`route-${index}`}
                className={`flex flex-row items-center border-t-[1px] ${
                  index == props.routeData!.length - 1 ? "border-b-[1px]" : ""
                }  border-[#D3DAE0] cursor-pointer group `}
                onClick={() => {
                  handleRouteClick(index);
                }}
              >
                <div
                  className={`w-1  h-full mr-4 ${
                    activeRoute == index && "bg-blue-500"
                  }  group-hover:bg-[#B7BABF]`}
                ></div>
                <div className="flex flex-col  py-2 gap-2  justify-start">
                  <p className="text-xs font-semibold  ">
                    <span className="text-lg font-bold">
                      {Math.round(route.ETA)} Menit
                    </span>
                    <span>&nbsp;&nbsp;&nbsp;</span>
                    Tiba pada {getArrivalTime(route.ETA)}{" "}
                  </p>
                  <p className="text-sm text-[#4C4C4C] ">{route.distance} KM</p>
                </div>

                <button
                  className={`flex ml-8 h-[30px] items-center rounded-lg bg-blue-500 px-2 
                  text-sm font-medium text-white transition-colors
                   hover:bg-blue-400 focus-visible:outline 
                     focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 
                     cursor-pointer aria-disabled:opacity-50`}
                  onClick={(e) => {
                    handleShowDirections();
                  }}
                >
                  Directions
                </button>
              </div>
            ))}
        </div>
      ) : (
        showRouteDirectionsComponent(
          props.routeData![activeRoute],
          showDirections,
          handleShowDirections
        )
      )}
    </div>
  );
}

function showRouteDirectionsComponent(
  route: RouteResponse,
  showDirections: boolean = false,
  handleShowDirections: () => void
) {
  const routeDirections = route.driving_directions.reduce<
    CumulativeDirection[]
  >((acc, currentDirection) => {
    const lastDirection = acc[acc.length - 1];
    const cumulativeEta = lastDirection
      ? lastDirection.cumulativeEta + currentDirection.ETA
      : currentDirection.ETA;
    const cumulativeDistance = lastDirection
      ? lastDirection.cumulativeDistance + currentDirection.Distance
      : currentDirection.Distance;

    return [
      ...acc,
      {
        ...currentDirection,
        cumulativeEta,
        cumulativeDistance,
      },
    ];
  }, []);

  return (
    <div className="flex flex-col  py-2 flex-1 overflow-y-scroll">
      <p className="text-left text-base text-[#666666] mt-2 mb-2">Directions</p>

      {routeDirections.map((direction, index) => (
        <div
          key={`route-${index}`}
          className={`flex flex-row items-center border-t-[1px] ${
            index == routeDirections!.length - 1 ? "border-b-[1px] mb-10" : ""
          }  border-[#D3DAE0] cursor-pointer group py2 `}
        >
          <div
            className={`w-1  h-full mr-4 bg-blue-500 group-hover:bg-[#B7BABF]`}
          ></div>
          <div className="flex flex-col  py-4 gap-2  justify-start">
            <div className="flex flex-row items-center gap-2">
              <p className="text-base font-regular  ">
                {direction.Instruction}
              </p>
            </div>
            <p className="text-sm font-light">
              {direction.cumulativeEta} menit ({Math.round(direction.Distance)}{" "}
              m)
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
