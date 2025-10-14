'use client';

import { useState, useEffect } from 'react';
import { useInfiniteQuery, type QueryFunctionContext, type InfiniteData } from '@tanstack/react-query';
import api from '@/lib/api';
import JobListItem, { Job } from './components/JobListItem';
import JobDetails from './components/JobDetails';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FilterButton from './components/FilterButton';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Clock, Briefcase, Star, Calendar, Tag, DollarSign, Accessibility, X } from 'lucide-react';

interface JobsApiResponse {
  data: Job[];
  next_page: boolean;
  page: number;
}

const fetchJobs = async (
  { pageParam }: QueryFunctionContext<['jobs'], number>
): Promise<JobsApiResponse> => {
  const page = pageParam ?? 1;
  const response = await api.get<JobsApiResponse>(`/v1/jobs?page=${page}&limit=12`);
  return response.data;
};

export default function JobsPage() {
  const { ref, inView } = useInView();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<JobsApiResponse, Error, InfiniteData<JobsApiResponse, number>, ['jobs'], number>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    getNextPageParam: (lastPage) => {
      if (lastPage?.next_page) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (!selectedJob && data?.pages[0]?.data[0]) {
      setSelectedJob(data.pages[0].data[0]);
    }
  }, [data, selectedJob]);

  const workSchedules = ["Tiempo completo", "Medio Tiempo", "Beca/Practicas", "Por horas"];
  const contractTypes = ["Indefinido", "Determinado", "Obra o labor", "Aprendizaje", "Otro"];
  const experienceLevels = ["Sin experiencia", "1 año", "2 años", "3-4 años", "5-10 años", "Más de 10 años"];
  const dateOptions = ["Hoy", "Semana", "Mes", "Año"];
  const categories = ["Tecnología", "Salud", "Educación", "Finanzas", "Marketing"];
  const disabilityTypes = ["Discapacidad visual", "Discapacidad auditiva", "Discapacidad motriz", "Discapacidad mental"];

  return (
    <>
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          <FilterButton title="Jornada" icon={<Clock className="h-4 w-4" />}>
            <div className="p-3 space-y-1 min-w-[200px]">
              {workSchedules.map(item => (
                <div
                  key={item}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <Checkbox id={`ws-${item}`} className="data-[state=checked]:bg-primary border-primary" />
                  <Label
                    htmlFor={`ws-${item}`}
                    className="font-normal cursor-pointer flex-1 group-hover:text-foreground transition-colors"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </FilterButton>

          <FilterButton title="Tipo de Contrato" icon={<Briefcase className="h-4 w-4" />}>
            <div className="p-3 space-y-1 min-w-[200px]">
              {contractTypes.map(item => (
                <div
                  key={item}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <Checkbox id={`ct-${item}`} className="data-[state=checked]:bg-primary border-primary" />
                  <Label
                    htmlFor={`ct-${item}`}
                    className="font-normal cursor-pointer flex-1 group-hover:text-foreground transition-colors"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </FilterButton>

          <FilterButton title="Experiencia" icon={<Star className="h-4 w-4" />}>
            <div className="p-3 space-y-1 min-w-[200px]">
              {experienceLevels.map(item => (
                <div
                  key={item}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <Checkbox id={`el-${item}`} className="data-[state=checked]:bg-primary border-primary" />
                  <Label
                    htmlFor={`el-${item}`}
                    className="font-normal cursor-pointer flex-1 group-hover:text-foreground transition-colors"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </FilterButton>

          <FilterButton title="Fecha" icon={<Calendar className="h-4 w-4" />}>
            <div className="p-3 space-y-1 min-w-[200px]">
              {dateOptions.map(item => (
                <div
                  key={item}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <Checkbox id={`date-${item}`} className="data-[state=checked]:bg-primary border-primary" />
                  <Label
                    htmlFor={`date-${item}`}
                    className="font-normal cursor-pointer flex-1 group-hover:text-foreground transition-colors"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </FilterButton>

          <FilterButton title="Categoría" icon={<Tag className="h-4 w-4" />}>
            <div className="p-3 space-y-1 min-w-[200px]">
              {categories.map(item => (
                <div
                  key={item}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <Checkbox id={`cat-${item}`} className="data-[state=checked]:bg-primary border-primary" />
                  <Label
                    htmlFor={`cat-${item}`}
                    className="font-normal cursor-pointer flex-1 group-hover:text-foreground transition-colors"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </FilterButton>

          <FilterButton title="Salario" icon={<DollarSign className="h-4 w-4" />}>
            <div className="p-4 space-y-4 min-w-[240px]">
              <div className="space-y-2">
                <Label htmlFor="min-salary" className="text-sm font-medium">Mínimo</Label>
                <Input
                  id="min-salary"
                  type="number"
                  placeholder="$1,000"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-salary" className="text-sm font-medium">Máximo</Label>
                <Input
                  id="max-salary"
                  type="number"
                  placeholder="$5,000"
                  className="h-10"
                />
              </div>
            </div>
          </FilterButton>

          <FilterButton title="Discapacidad" icon={<Accessibility className="h-4 w-4" />}>
            <div className="p-3 space-y-1 min-w-[200px]">
              {disabilityTypes.map(item => (
                <div
                  key={item}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <Checkbox id={`dis-${item}`} className="data-[state=checked]:bg-primary border-primary" />
                  <Label
                    htmlFor={`dis-${item}`}
                    className="font-normal cursor-pointer flex-1 group-hover:text-foreground transition-colors"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </FilterButton>

          <Button
            variant="outline"
            className="flex items-center gap-2 text-muted-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
            Limpiar Filtros
          </Button>
        </div>
      </div>
      <div className="h-[calc(100vh-6rem)] grid grid-cols-1 lg:grid-cols-5 gap-2 px-32">

        {/* Left Column: Job List */}
        <div className=" rounded-lg col-span-2">
          <ScrollArea className="h-[calc(100vh-6rem)]">
            {status === 'pending' ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : status === 'error' ? (
              <div className="p-4 text-center text-red-500">Error: {error.message}</div>
            ) : (
              <div>
                {data.pages.map((page) =>
                  page.data.map((job) => (
                    <JobListItem
                      key={job.id}
                      job={job}
                      isActive={selectedJob?.id === job.id}
                      onClick={() => setSelectedJob(job)}
                    />
                  ))
                )}
                <div ref={ref} className="flex justify-center items-center h-24">
                  {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                  {!hasNextPage && data.pages.length > 0 && <p className="text-sm text-muted-foreground">No hay más empleos</p>}
                </div>
              </div>
            )}
            <ScrollBar orientation="vertical" className="w-3" />
          </ScrollArea>
        </div>

        {/* Right Column: Job Details */}
        <div className="hidden lg:block lg:col-span-3">
          <ScrollArea className="h-[calc(100vh-6rem)]">
            <JobDetails job={selectedJob} />
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
