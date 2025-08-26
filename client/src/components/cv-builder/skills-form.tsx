import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { skillSchema, type Skill } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const skillsSchema = z.object({
  skills: z.array(skillSchema),
});

interface SkillsFormProps {
  data: Skill[];
  onUpdate: (data: Skill[]) => void;
}

const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
] as const;

const SKILL_CATEGORIES = [
  "Programming Languages",
  "Web Development",
  "Database",
  "Cloud Services",
  "DevOps",
  "Design",
  "Project Management",
  "Communication",
  "Languages",
  "Other",
];

export function SkillsForm({ data, onUpdate }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState({ name: "", level: "", category: "" });

  const form = useForm<{ skills: Skill[] }>({
    resolver: zodResolver(skillsSchema),
    defaultValues: { skills: data },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  // Update parent when form changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.skills) {
        onUpdate(values.skills as Skill[]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  const handleAddSkill = () => {
    if (newSkill.name && newSkill.level && newSkill.category) {
      append({
        name: newSkill.name,
        level: newSkill.level as Skill["level"],
        category: newSkill.category,
      });
      setNewSkill({ name: "", level: "", category: "" });
    }
  };

  const groupedSkills = fields.reduce((acc, skill, index) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ ...skill, index });
    return acc;
  }, {} as Record<string, (Skill & { index: number })[]>);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <i className="fas fa-cogs text-primary"></i>
        </div>
        <h2 className="text-xl font-semibold text-foreground">Skills</h2>
      </div>

      {/* Add New Skill */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Add New Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Skill Name</label>
              <Input
                placeholder="e.g., JavaScript"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                data-testid="input-new-skill-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <Select value={newSkill.level} onValueChange={(value) => setNewSkill({ ...newSkill, level: value })}>
                <SelectTrigger data-testid="select-new-skill-level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select value={newSkill.category} onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}>
                <SelectTrigger data-testid="select-new-skill-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddSkill}
                disabled={!newSkill.name || !newSkill.level || !newSkill.category}
                data-testid="button-add-skill"
              >
                <i className="fas fa-plus mr-1"></i>
                Add Skill
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills by Category */}
      <Form {...form}>
        <div className="space-y-6">
          {Object.keys(groupedSkills).map((category) => (
            <Card key={category}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{category}</span>
                  <Badge variant="secondary">
                    {groupedSkills[category].length} skill{groupedSkills[category].length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedSkills[category].map((skill) => (
                    <div 
                      key={skill.index} 
                      className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{skill.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{skill.level}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(skill.index)}
                        className="text-destructive hover:text-destructive/80 p-1"
                        data-testid={`button-remove-skill-${skill.index}`}
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8">
              <i className="fas fa-cogs text-4xl text-muted-foreground mb-4"></i>
              <p className="text-muted-foreground">No skills added yet. Add your first skill above!</p>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}
