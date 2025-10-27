
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PipelineStep } from '../hooks/useEmployerDashboard';

interface PipelineChartProps {
  data: PipelineStep[];
}

export default function PipelineChart({ data }: PipelineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline de Contratación</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="status" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" name="Candidatos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
