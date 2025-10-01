import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin } from "lucide-react";

export interface Job {
  ID: number;
  title: string;
  location: string;
  work_model: string;
  contract_type: string;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
          <Briefcase className="h-4 w-4" />
          <span>{job.contract_type}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{job.location}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{job.work_model}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}