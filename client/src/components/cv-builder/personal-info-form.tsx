import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, type PersonalInfo } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
}

export function PersonalInfoForm({ data, onUpdate }: PersonalInfoFormProps) {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema.extend({
      summary: personalInfoSchema.shape.summary.optional(),
    })),
    defaultValues: data,
  });

  // Update form when data changes
  useEffect(() => {
    form.reset(data);
  }, [data, form]);

  // Auto-save on form changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (Object.keys(form.formState.dirtyFields).length > 0) {
        onUpdate(values as PersonalInfo);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <i className="fas fa-user text-primary"></i>
        </div>
        <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
      </div>

      <Form {...form}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., John Doe" 
                      {...field} 
                      data-testid="input-full-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Senior Software Engineer" 
                      {...field}
                      data-testid="input-title"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="john.doe@email.com" 
                      {...field}
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+1 (555) 123-4567" 
                      {...field}
                      data-testid="input-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="New York, NY" 
                      {...field}
                      data-testid="input-location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Summary (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Brief overview of your professional background and key achievements..."
                    {...field}
                    data-testid="textarea-summary"
                  />
                </FormControl>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <i className="fas fa-magic text-accent"></i>
                    <span>AI can generate this for you later</span>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
}
