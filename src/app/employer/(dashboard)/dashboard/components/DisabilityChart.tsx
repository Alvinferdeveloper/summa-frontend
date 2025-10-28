'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisabilityInsight } from '../hooks/useEmployerDashboard';

interface DisabilityChartProps {
  data: DisabilityInsight[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

// Local type to satisfy Recharts' ChartDataInput index signature
type ChartDataPoint = DisabilityInsight & { [key: string]: string | number };

export default function DisabilityChart({ data }: DisabilityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Tipo de Discapacidad</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={data as ChartDataPoint[]}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="count"
              nameKey="name"
              label={(props: PieLabelRenderProps) => {
                const { name, percent } = props;
                const pct = typeof percent === 'number' ? percent : 0;
                return `${String(name ?? '')} ${(pct * 100).toFixed(0)}%`;
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
