import Link from "next/link";
import { Wrench, MapPin, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between">
      {/* Header institucional */}
      <header className="border-b border-neutral-200 bg-white px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl text-neutral-900 tracking-tight">ConstruApp</span>
          <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
            Cali, Colombia
          </span>
        </div>
        <Link
          href="/auth"
          className="text-sm font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-300 px-4 py-2 rounded-lg transition hover:bg-neutral-50"
        >
          Iniciar Sesión
        </Link>
      </header>

      {/* Sección Principal / Hero */}
      <main className="max-w-4xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-block mb-4 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold tracking-wide uppercase">
          Plataforma de Ingeniería y Obras
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4 leading-tight">
          Conectando talento y proyectos de construcción con precisión
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mb-10">
          Una solución tecnológica moderna orientada a optimizar la búsqueda de profesionales calificados, geolocalización de obras y gestión eficiente de portafolios en terreno.
        </p>

        {/* Tarjetas de Acceso Rápido a los Módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full text-left">
          <Link
            href="/preview-tarjetas"
            className="p-5 bg-white rounded-xl border border-neutral-200 shadow-xs hover:border-neutral-400 transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition">
                <Wrench size={22} />
              </div>
              <h2 className="font-semibold text-neutral-900">Directorio y Filtros</h2>
            </div>
            <p className="text-sm text-neutral-500">Explora fichas de trabajadores filtradas por oficio y distancia geográfica.</p>
          </Link>

          <Link
            href="/mapa"
            className="p-5 bg-white rounded-xl border border-neutral-200 shadow-xs hover:border-neutral-400 transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100 transition">
                <MapPin size={22} />
              </div>
              <h2 className="font-semibold text-neutral-900">Mapa Geolocalizado</h2>
            </div>
            <p className="text-sm text-neutral-500">Visualiza puntos de interés y recursos activos en el mapa interactivo.</p>
          </Link>

          <Link
            href="/portafolio"
            className="p-5 bg-white rounded-xl border border-neutral-200 shadow-xs hover:border-neutral-400 transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition">
                <Briefcase size={22} />
              </div>
              <h2 className="font-semibold text-neutral-900">Portafolio de Obra</h2>
            </div>
            <p className="text-sm text-neutral-500">Sube evidencias fotográficas con registro de coordenadas automáticas.</p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 text-center text-xs text-neutral-500">
        ConstruApp • Desarrollado con Next.js, React, TypeScript, Tailwind CSS y Supabase.
      </footer>
    </div>
  );
}