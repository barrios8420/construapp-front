"use client";

import TarjetaTrabajador, { Trabajador } from "@/components/ui/TarjetaTrabajador";

const trabajadoresDePrueba: Trabajador[] = [
  { id: "1", nombre: "Carlos Ramírez", oficio: "Albañil", rating: 4.8, distanciaKm: 1.2 },
  { id: "2", nombre: "Luz Marina Gómez", oficio: "Electricista", rating: 4.2, distanciaKm: 3.7 },
  { id: "3", nombre: "Andrés Torres", oficio: "Plomero", rating: 3.5, distanciaKm: 6.1 },
];

export default function PreviewTarjetasPage() {
  return (
    <div className="mx-auto max-w-md space-y-3 bg-neutral-50 p-6">
      <h1 className="mb-4 text-xl font-semibold">Vista previa de tarjetas</h1>
      {trabajadoresDePrueba.map((t) => (
        <TarjetaTrabajador
          key={t.id}
          trabajador={t}
          onClick={(id) => console.log("Click en trabajador:", id)}
        />
      ))}
    </div>
  );
}