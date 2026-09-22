"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PortafolioPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">¡Bienvenido de nuevo!</CardTitle>
          <p className="text-sm text-muted-foreground">
            Esta es tu pantalla principal. Desde aquí vas a poder ver y administrar tu portafolio.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/portafolio/subir">
            <Button className="w-full">Subir fotos de trabajos</Button>
          </Link>
          {/* TODO: listar aquí las fotos ya subidas del portafolio */}
        </CardContent>
      </Card>
    </div>
  );
}