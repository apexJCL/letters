import React from "react";
import AppTitle from '../components/AppTitle';
import LetterDraw from '../components/LetterDraw';

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <AppTitle text="Abecedario Interactivo" />
      <LetterDraw character="o" />
    </div>
  );
}
