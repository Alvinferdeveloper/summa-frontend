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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, Briefcase, Star, Calendar, Tag, DollarSign, Accessibility, X } from 'lucide-react';
import { useContractTypes } from "./hooks/useContractTypes";
import { useExperienceLevels } from "./hooks/useExperienceLevels";
import { useWorkSchedules } from '@/app/employer/(dashboard)/jobs/create/hooks/useWorkSchedules';
import { useWorkModels } from '@/app/employer/(dashboard)/jobs/create/hooks/useWorkModels';
import { useCategories } from '@/app/employer/(dashboard)/jobs/create/hooks/useCategories';

interface JobsApiResponse {
  data: Job[];
  next_page: boolean;
  page: number;
}

const fetchJobs = async (
  { pageParam = 1, queryKey }: QueryFunctionContext<['jobs', Record<string, string>], number>
): Promise<JobsApiResponse> => {
  const [, filters] = queryKey;
  const params = new URLSearchParams({ page: String(pageParam), limit: "12" });

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const response = await api.get<JobsApiResponse>(`/v1/jobs?${params.toString()}`);
  return response.data;
};


export default function JobsPage() {
  const { ref, inView } = useInView();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: contractTypes = [] } = useContractTypes();
  const { data: experienceLevels = [] } = useExperienceLevels();
  const { data: workSchedules = [] } = useWorkSchedules();
  const { data: workModels = [] } = useWorkModels();
  const { data: categories = [] } = useCategories();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<JobsApiResponse, Error, InfiniteData<JobsApiResponse, number>, ['jobs', Record<string, string>], number>({
    queryKey: ['jobs', filters],
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

  const dateOptions = ["Hoy", "Semana", "Mes", "Año"];
  const disabilityTypes = ["Discapacidad visual", "Discapacidad auditiva", "Discapacidad motriz", "Discapacidad mental"];

  return (
    <>
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          <FilterButton title="Jornada" icon={<Clock className="h-4 w-4" />} className={filters.work_schedule_id ? 'bg-blue-100' : ''}>
            <RadioGroup
              value={filters.work_schedule_id || ""}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, work_schedule_id: value }))}
              className="p-3 space-y-1 min-w-[200px]"
            >
              {workSchedules.map(item => (
                <Label 
                  key={item.id} 
                  htmlFor={`ws-${item.id}`}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <RadioGroupItem value={item.id.toString()} id={`ws-${item.id}`} className='border-primary' />
                  <span className="font-normal flex-1 group-hover:text-foreground transition-colors">{item.name}</span>
                </Label>
              ))}
            </RadioGroup>
            <div className="p-2 border-t"><Button variant="ghost" className="w-full cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, work_schedule_id: "" }))}>Limpiar</Button></div>
          </FilterButton>

          <FilterButton title="Modelo de Trabajo" icon={<Briefcase className="h-4 w-4" />} className={filters.work_model_id ? 'bg-blue-100' : ''}>
            <RadioGroup
              value={filters.work_model_id || ""}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, work_model_id: value }))}
              className="p-3 space-y-1 min-w-[200px]"
            >
              {workModels.map(item => (
                <Label 
                  key={item.id} 
                  htmlFor={`wm-${item.id}`}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <RadioGroupItem value={item.id.toString()} id={`wm-${item.id}`} className='border-primary' />
                  <span className="font-normal flex-1 group-hover:text-foreground transition-colors">{item.name}</span>
                </Label>
              ))}
            </RadioGroup>
            <div className="p-2 border-t"><Button variant="ghost" className="w-full cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, work_model_id: "" }))}>Limpiar</Button></div>
          </FilterButton>

          <FilterButton title="Tipo de Contrato" icon={<Briefcase className="h-4 w-4" />} className={filters.contract_type_id ? 'bg-blue-100' : ''}>
            <RadioGroup
              value={filters.contract_type_id || ""}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, contract_type_id: value }))}
              className="p-3 space-y-1 min-w-[200px]"
            >
              {contractTypes.map(item => (
                <Label 
                  key={item.id} 
                  htmlFor={`ct-${item.id}`}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <RadioGroupItem value={item.id.toString()} id={`ct-${item.id}`} className='border-primary' />
                  <span className="font-normal flex-1 group-hover:text-foreground transition-colors">{item.name}</span>
                </Label>
              ))}
            </RadioGroup>
            <div className="p-2 border-t"><Button variant="ghost" className="w-full cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, contract_type_id: "" }))}>Limpiar</Button></div>
          </FilterButton>

          <FilterButton title="Experiencia" icon={<Star className="h-4 w-4" />} className={filters.experience_level_id ? 'bg-blue-100' : ''}>
            <RadioGroup
              value={filters.experience_level_id || ""}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, experience_level_id: value }))}
              className="p-3 space-y-1 min-w-[200px]"
            >
              {experienceLevels.map(item => (
                <Label 
                  key={item.id} 
                  htmlFor={`el-${item.id}`}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <RadioGroupItem value={item.id.toString()} id={`el-${item.id}`} className='border-primary' />
                  <span className="font-normal flex-1 group-hover:text-foreground transition-colors">{item.name}</span>
                </Label>
              ))}
            </RadioGroup>
            <div className="p-2 border-t"><Button variant="ghost" className="w-full cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, experience_level_id: "" }))}>Limpiar</Button></div>
          </FilterButton>

          <FilterButton title="Fecha" icon={<Calendar className="h-4 w-4" />} className={filters.date_posted ? 'bg-blue-100' : ''}>
            <RadioGroup
              value={filters.date_posted || ""}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, date_posted: value }))}
              className="p-3 space-y-1 min-w-[200px]"
            >
              {dateOptions.map(item => (
                <Label 
                  key={item} 
                  htmlFor={`date-${item}`}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <RadioGroupItem value={item} id={`date-${item}`} className='border-primary' />
                  <span className="font-normal flex-1 group-hover:text-foreground transition-colors">{item}</span>
                </Label>
              ))}
            </RadioGroup>
            <div className="p-2 border-t"><Button variant="ghost" className="w-full cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, date_posted: "" }))}>Limpiar</Button></div>
          </FilterButton>

          <FilterButton title="Categoría" icon={<Tag className="h-4 w-4" />} className={filters.category_id ? 'bg-blue-100' : ''}>
            <RadioGroup
              value={filters.category_id || ""}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, category_id: value }))}
              className="p-3 space-y-1 min-w-[200px]"
            >
              {categories.map(item => (
                <Label 
                  key={item.id} 
                  htmlFor={`cat-${item.id}`}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <RadioGroupItem value={item.id.toString()} id={`cat-${item.id}`} className='border-primary' />
                  <span className="font-normal flex-1 group-hover:text-foreground transition-colors">{item.name}</span>
                </Label>
              ))}
            </RadioGroup>
            <div className="p-2 border-t"><Button variant="ghost" className="w-full cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, category_id: "" }))}>Limpiar</Button></div>
          </FilterButton>

          <FilterButton title="Salario" icon={<DollarSign className="h-4 w-4" />}>
            <div className="p-4 space-y-4 min-w-[240px]">
              <div className="space-y-2">
                <Label htmlFor="min-salary" className="text-sm font-medium">Mínimo</Label>
                <Input id="min-salary" type="number" placeholder="$1,000" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-salary" className="text-sm font-medium">Máximo</Label>
                <Input id="max-salary" type="number" placeholder="$5,000" className="h-10" />
              </div>
            </div>
          </FilterButton>

          <FilterButton title="Discapacidad" icon={<Accessibility className="h-4 w-4" />} className={filters.disability_type ? 'bg-blue-100' : ''}>
            <RadioGroup
              value={filters.disability_type || ""}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, disability_type: value }))}
              className="p-3 space-y-1 min-w-[200px]"
            >
              {disabilityTypes.map(item => (
                <Label 
                  key={item} 
                  htmlFor={`dis-${item}`}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
                >
                  <RadioGroupItem value={item} id={`dis-${item}`} className='border-primary' />
                  <span className="font-normal flex-1 group-hover:text-foreground transition-colors">{item}</span>
                </Label>
              ))}
            </RadioGroup>
            <div className="p-2 border-t"><Button variant="ghost" className="w-full cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, disability_type: "" }))}>Limpiar</Button></div>
          </FilterButton>

          <Button
            variant="outline"
            className="flex items-center gap-2 text-muted-foreground transition-colors cursor-pointer"
            onClick={() => setFilters({})}>
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
                  page.data?.map((job) => (
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