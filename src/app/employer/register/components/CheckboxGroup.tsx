'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Control, FieldValues, Path } from 'react-hook-form';

interface Option {
    id: number;
    name: string;
}

interface CheckboxGroupProps<T extends FieldValues> {
    control?: Control<T>;
    name: Path<T>;
    options: readonly Option[];
    label: string;
}

export default function CheckboxGroup<T extends FieldValues>({ control, name, options, label }: CheckboxGroupProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="md:col-span-3">
                    <div className="mb-4">
                        <FormLabel className="text-base font-medium">{label}</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {options.map((item) => (
                            <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                    <Checkbox
                                        className="border-primary"
                                        checked={Array.isArray(field.value) ? field.value.includes(item.id) : false}
                                        onCheckedChange={(checked) => {
                                            const currentValue = Array.isArray(field.value) ? field.value : [];
                                            if (checked) {
                                                field.onChange([...currentValue, item.id]);
                                            } else {
                                                field.onChange(currentValue.filter((value: number) => value !== item.id));
                                            }
                                        }}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    {item.name}
                                </FormLabel>
                            </FormItem>
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}