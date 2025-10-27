
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillInsight } from '../hooks/useEmployerDashboard';

interface SkillInsightsChartProps {
  data: SkillInsight[];
}

export default function SkillInsightsChart({ data }: SkillInsightsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Habilidades de los Candidatos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" name="Número de Candidatos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
