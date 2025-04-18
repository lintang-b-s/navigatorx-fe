import { CiSearch } from "react-icons/ci";
import { LiaSourcetree } from "react-icons/lia";
import { CiLocationOn } from "react-icons/ci";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Button } from "./button";
import { CiRoute } from "react-icons/ci";
import { SearchBox } from "./search";

export function Router() {
  return (
    <div
      className="flex px-4 py-4 h-[150px] w-[355px] md:h-[200px] md:w-[380px]  
       items-center gap-2 md:gap-4 absolute top-10 left-[5%] md:left-10 bg-white
        rounded-lg overflow-hidden"
    >
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
        <SearchBox isSource={true} />
        <SearchBox isSource={false} />
      </div>

      <Button>
        <CiRoute size={30} />
      </Button>
    </div>
  );
}
