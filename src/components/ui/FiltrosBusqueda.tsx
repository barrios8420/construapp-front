"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const OFICIOS = [
  "Todos los oficios",
  "Albañil",
  "Carpintero",
  "Plomero",
  "Electricista",
  "Pintor",
  "Soldador",
  "Techista",
] as const;

export interface FiltrosValores {
  oficio: string;
  radioKm: number;
}

interface FiltrosBusquedaProps {
  valorInicial?: FiltrosValores;
  onChange: (valores: FiltrosValores) => void;
}

export default function FiltrosBusqueda({
  valorInicial = { oficio: "Todos los oficios", radioKm: 5 },
  onChange,
}: FiltrosBusquedaProps) {
  const [oficio, setOficio] = useState(valorInicial.oficio);
  const [radioKm, setRadioKm] = useState(valorInicial.radioKm);

  function actualizarOficio(valor: string | null) {
  if (!valor) return;
  setOficio(valor);
  onChange({ oficio: valor, radioKm });
}

  function actualizarRadio(valor: number | readonly number[]) {
  const nuevoRadio = Array.isArray(valor) ? valor[0] : valor;
  setRadioKm(nuevoRadio);
  onChange({ oficio, radioKm: nuevoRadio });
}

  return (
    <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="space-y-2">
        <Label htmlFor="filtro-oficio">Oficio</Label>
        <Select value={oficio} onValueChange={actualizarOficio}>
          <SelectTrigger id="filtro-oficio" className="w-full">
            <SelectValue placeholder="Selecciona un oficio" />
          </SelectTrigger>
          <SelectContent>
            {OFICIOS.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="filtro-radio">Radio de búsqueda</Label>
          <span className="text-sm font-medium text-muted-foreground">{radioKm} km</span>
        </div>
        <Slider
          id="filtro-radio"
          min={1}
          max={15}
          step={1}
          value={[radioKm]}
          onValueChange={actualizarRadio}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 km</span>
          <span>15 km</span>
        </div>
      </div>
    </div>
  );
}