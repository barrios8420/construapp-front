"use client";

import MapaCali, { TrabajadorMapa } from "@/components/ui/MapaCali";

const trabajadoresDePrueba: TrabajadorMapa[] = [
  { id: "1", nombre: "Carlos Ramírez", oficio: "Albañil", lat: 3.4516, lng: -76.532 },
  { id: "2", nombre: "Luz Marina Gómez", oficio: "Electricista", lat: 3.44, lng: -76.52 },
  { id: "3", nombre: "Andrés Torres", oficio: "Plomero", lat: 3.46, lng: -76.54 },
];

export default function PreviewMapaPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <h1 className="text-xl font-semibold">Vista previa: mapa de Cali</h1>
      <MapaCali
        trabajadores={trabajadoresDePrueba}
        onSelectTrabajador={(id) => console.log("Trabajador seleccionado:", id)}
      />
    </div>
  );
}