"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import type { Job } from "./JobListItem"
import { useRouter } from "next/navigation"

// 🔧 Configuración base del ícono de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
})

interface JobsMapProps {
  jobs: Job[]
}

export default function JobsMap({ jobs }: JobsMapProps) {
  const router = useRouter()

  const handleMarkerClick = (jobId: number) => {
    router.push(`/jobs/${jobId}?isAppliable=true`)
  }

  // 🔹 Función para crear un ícono con el logo encima del marcador
  const createCustomIcon = (logoUrl?: string) => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="flex flex-col items-center">
          <img
            src="${logoUrl || "/company_placeholder.png"}"
            alt="logo"
            class="w-8 h-8 mb-1 rounded-full border border-gray-300 bg-white object-cover shadow-md"
          />
        </div>
      `,
      iconAnchor: [12, 40], // punto de anclaje del pin
      popupAnchor: [0, -40], // posición del popup
    })
  }

  return (
    <div className="h-full w-full rounded-lg border-2 border-gray-200 overflow-hidden shadow-lg">
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {jobs.map(
          (job) =>
            job.latitude &&
            job.longitude && (
              <Marker
                key={job.id}
                position={[job.latitude, job.longitude]}
                icon={createCustomIcon(job.employer.logo_url)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={job.employer.logo_url || "/placeholder.svg"}
                        alt={job.employer.company_name}
                        className="w-12 h-12 object-contain rounded-md border border-gray-200 bg-white p-1"
                      />
                      <p className="text-sm font-medium text-gray-700">
                        {job.employer.company_name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleMarkerClick(job.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm shadow-sm"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </Popup>
              </Marker>
            ),
        )}
      </MapContainer>
    </div>
  )
}
