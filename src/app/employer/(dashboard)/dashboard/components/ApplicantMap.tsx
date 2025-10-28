
'use client';

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationInsight } from '../hooks/useEmployerDashboard';

interface ApplicantMapProps {
  data: LocationInsight[];
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function ApplicantMap({ data }: ApplicantMapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Origen Geográfico de Postulantes</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: "400x" }}>

          <ComposableMap
            projectionConfig={{
              scale: 200,
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EAEAEC"
                    stroke="#000000"
                  />
                ))
              }
            </Geographies>
            {data.map(({ location, count, latitude, longitude }) => (
              <Marker key={location} coordinates={[longitude, latitude]}>
                <circle r={Math.sqrt(count) * 3} fill="#FF5722" stroke="#fff" strokeWidth={1} />
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{ fontFamily: "system-ui", fill: "#000000", fontSize: "15px" }}
                >
                  {location} ({count})
                </text>
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </CardContent>
    </Card>
  );
}
