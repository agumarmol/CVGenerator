import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { educationSchema, type Education } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

const educationsSchema = z.object({
  education: z.array(educationSchema),
});

interface EducationFormProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
}

export function EducationForm({ data, onUpdate }: EducationFormProps) {
  const form = useForm<{ education: Education[] }>({
    resolver: zodResolver(educationsSchema),
    defaultValues: { education: data.length > 0 ? data : [getDefaultEducation()] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  function getDefaultEducation(): Education {
    return {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      gpa: "",
    };
  }

  // Update parent when form changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.education) {
        onUpdate(values.education as Education[]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-graduation-cap text-primary"></i>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Education</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => append(getDefaultEducation())}
          data-testid="button-add-education"
        >
          <i className="fas fa-plus mr-1"></i> Add Education
        </Button>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Education #{index + 1}
                  </CardTitle>
                  {fields.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive/80"
                      data-testid={`button-remove-education-${index}`}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Harvard University" 
                            {...field}
                            data-testid={`input-institution-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Bachelor of Science" 
                            {...field}
                            data-testid={`input-degree-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name={`education.${index}.field`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Computer Science" 
                          {...field}
                          data-testid={`input-field-${index}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name={`education.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            data-testid={`input-start-date-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            disabled={form.watch(`education.${index}.isCurrent`)}
                            data-testid={`input-end-date-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${index}.gpa`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPA (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="3.8" 
                            {...field}
                            data-testid={`input-gpa-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${index}.isCurrent`}
                    render={({ field }) => (
                      <FormItem className="flex items-end pb-2">
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid={`checkbox-is-current-${index}`}
                            />
                          </FormControl>
                          <FormLabel className="text-sm">Currently studying</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Form>
    </div>
  );
}
