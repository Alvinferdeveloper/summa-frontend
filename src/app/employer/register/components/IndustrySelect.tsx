import { Briefcase } from "lucide-react";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const industries = [
    "Desarrollo de software",
    "Inteligencia artificial y datos",
    "Telecomunicaciones",
    "Ciberseguridad",
    "Hospitales y clínicas",
    "Educación y formación",
    "Manufactura",
    "Comercio minorista",
    "Fintech",
    "Turismo y hospitalidad",
    "Transporte y logística",
    "Construcción e infraestructura",
    "Medios y comunicación",
    "Gobierno y ONG",
    "Agricultura y medio ambiente",
    "Otra",
];

export default function IndustrySelect({ field }: { field: any }) {
    return (
        <FormItem>
            <FormLabel className="flex items-center gap-2 text-base font-medium">
                <Briefcase className="h-4 w-4 text-secondary" />
                Industria
            </FormLabel>
            <FormControl>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                >
                    <SelectTrigger className="py-6 text-md border-2 focus:border-primary rounded-sm transition-all">
                        <SelectValue placeholder="Selecciona una industria" />
                    </SelectTrigger>
                    <SelectContent>
                        {industries.map((industry) => (
                            <SelectItem key={industry} value={industry} className="[&:hover]:bg-primary/10 [&:hover]:text-primary data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary">
                                {industry}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}
