import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { experienceSchema, type Experience } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const experiencesSchema = z.object({
  experiences: z.array(experienceSchema),
});

interface ExperienceFormProps {
  data: Experience[];
  onUpdate: (data: Experience[]) => void;
}

export function ExperienceForm({ data, onUpdate }: ExperienceFormProps) {
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<{ experiences: Experience[] }>({
    resolver: zodResolver(experiencesSchema),
    defaultValues: { experiences: data.length > 0 ? data : [getDefaultExperience()] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  function getDefaultExperience(): Experience {
    return {
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    };
  }

  // Update parent when form changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.experiences) {
        onUpdate(values.experiences as Experience[]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  const handleEnhanceDescription = async (index: number) => {
    const experience = form.getValues(`experiences.${index}`);
    
    if (!experience.jobTitle || !experience.company || !experience.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in job title, company, and description before enhancing",
        variant: "destructive",
      });
      return;
    }

    setEnhancingIndex(index);
    
    try {
      const response = await apiRequest("POST", "/api/enhance-description", {
        description: experience.description,
        jobTitle: experience.jobTitle,
        company: experience.company,
      });
      
      const data = await response.json();
      form.setValue(`experiences.${index}.description`, data.enhancedDescription);
      
      toast({
        title: "Description Enhanced",
        description: "AI has improved your job description",
      });
    } catch (error: any) {
      toast({
        title: "Enhancement Failed",
        description: error.message || "Failed to enhance description",
        variant: "destructive",
      });
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-briefcase text-primary"></i>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Work Experience</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => append(getDefaultExperience())}
          data-testid="button-add-experience"
        >
          <i className="fas fa-plus mr-1"></i> Add Experience
        </Button>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Experience #{index + 1}
                  </CardTitle>
                  {fields.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive/80"
                      data-testid={`button-remove-experience-${index}`}
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
                    name={`experiences.${index}.jobTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Senior Software Engineer" 
                            {...field}
                            data-testid={`input-job-title-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., TechCorp Inc." 
                            {...field}
                            data-testid={`input-company-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.startDate`}
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
                    name={`experiences.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                            disabled={form.watch(`experiences.${index}.isCurrent`)}
                            data-testid={`input-end-date-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`experiences.${index}.isCurrent`}
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
                          <FormLabel className="text-sm">Currently working here</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name={`experiences.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Describe your responsibilities, achievements, and key contributions..."
                          {...field}
                          data-testid={`textarea-description-${index}`}
                        />
                      </FormControl>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <i className="fas fa-magic text-accent"></i>
                          <span>AI will enhance your description</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEnhanceDescription(index)}
                          disabled={enhancingIndex === index}
                          data-testid={`button-enhance-description-${index}`}
                        >
                          {enhancingIndex === index ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-1" />
                              Enhancing...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-wand-magic-sparkles mr-1"></i>
                              Enhance with AI
                            </>
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </Form>
    </div>
  );
}
