import React from "react";
import AppTitle from '../components/AppTitle';
import MenuCard from "../components/MenuCard";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <AppTitle text="Abecedario Interactivo" className="mb-8"/>
      <div className="flex space-x-12">
        <MenuCard text="Sonidos" imgUrl="/images/volume.png" href="/soundboard"/>
        <MenuCard text="Trazos" imgUrl="/images/pencil.png" href="/letter-strokes"/>
      </div>
    </div>
  );
}
