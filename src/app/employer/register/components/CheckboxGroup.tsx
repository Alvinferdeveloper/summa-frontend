import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Control, FieldValues, Path } from 'react-hook-form';

interface Option {
    id: string;
    name: string;
}

interface CheckboxGroupProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    options: readonly Option[];
    label: string;
}

export default function CheckboxGroup<T extends FieldValues>({ control, name, options, label }: CheckboxGroupProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={() => (
                <FormItem className="md:col-span-3">
                    <div className="mb-4">
                        <FormLabel className="text-base font-medium">{label}</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {options.map((item) => (
                            <FormField
                                key={item.id}
                                control={control}
                                name={name}
                                render={({ field }) => {
                                    return (
                                        <FormItem
                                            key={item.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                                <Checkbox
                                                    className="border-primary"
                                                    checked={field.value?.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                        const currentValue = Array.isArray(field.value) ? field.value : [];
                                                        return checked
                                                            ? field.onChange([...currentValue, item.id])
                                                            : field.onChange(
                                                                currentValue.filter(
                                                                    (value) => value !== item.id
                                                                )
                                                            )
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {item.name}
                                            </FormLabel>
                                        </FormItem>
                                    )
                                }}
                            />
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
