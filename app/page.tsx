import Image from "next/image";
import { MapComponent } from "@/app/ui/map";
import { Router } from "@/app/ui/route";

export default function Home() {
  return (
    <main className="flex relative w-full">
      <MapComponent />
      <Router />
    </main>
  );
}
