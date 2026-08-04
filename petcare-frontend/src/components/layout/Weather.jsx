import { CloudSun, Droplets, Thermometer, Wind } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Weather() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CloudSun className="h-5 w-5 text-yellow-500" />
          Weather
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold">22°C</p>

            <p className="text-sm text-slate-500">
              Ptuj, Slovenia
            </p>
          </div>

          <CloudSun className="h-14 w-14 text-yellow-500" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />

              <span className="text-sm">Humidity</span>
            </div>

            <span className="font-medium">55%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-cyan-500" />

              <span className="text-sm">Wind</span>
            </div>

            <span className="font-medium">12 km/h</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-red-500" />

              <span className="text-sm">Feels like</span>
            </div>

            <span className="font-medium">24°C</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}