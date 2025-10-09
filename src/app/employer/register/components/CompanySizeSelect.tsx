import { Briefcase } from "lucide-react";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const sizes = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001+",
];

export default function CompanySizeSelect({ field }: { field: any }) {
    return (
        <FormItem>
            <FormLabel className="flex items-center gap-2 text-base font-medium">
                <Briefcase className="h-4 w-4 text-secondary" />
                Tamaño de la empresa
            </FormLabel>
            <FormControl>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                >
                    <SelectTrigger className="py-6 text-md border-2 focus:border-primary rounded-sm transition-all">
                        <SelectValue placeholder="Selecciona el tamaño de la empresa" />
                    </SelectTrigger>
                    <SelectContent>
                        {sizes.map((size) => (
                            <SelectItem key={size} value={size} className="[&:hover]:bg-primary/10 [&:hover]:text-primary data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary">
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}
