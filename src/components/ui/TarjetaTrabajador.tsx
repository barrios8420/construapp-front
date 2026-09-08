"use client";

import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface Trabajador {
  id: string;
  nombre: string;
  oficio: string;
  fotoUrl?: string;
  rating: number; // 0 a 5
  distanciaKm: number;
}

interface TarjetaTrabajadorProps {
  trabajador: Trabajador;
  onClick?: (id: string) => void;
}

export default function TarjetaTrabajador({ trabajador, onClick }: TarjetaTrabajadorProps) {
  const { id, nombre, oficio, fotoUrl, rating, distanciaKm } = trabajador;

  const estrellasLlenas = Math.round(rating);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(id);
      }}
      className="cursor-pointer transition hover:shadow-md"
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-neutral-200">
          {fotoUrl ? (
            <img src={fotoUrl} alt={nombre} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-medium text-neutral-500">
              {nombre.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{nombre}</p>
          <p className="truncate text-sm text-muted-foreground">{oficio}</p>

          <div className="mt-1 flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < estrellasLlenas
                      ? "fill-amber-400 text-amber-400"
                      : "fill-neutral-200 text-neutral-200"
                  }
                />
              ))}
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span>{distanciaKm.toFixed(1)} km</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}