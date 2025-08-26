import { Card, CardContent } from "@/components/ui/card";
import type { CvData } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface CvPreviewProps {
  cvData: CvData;
  isWatermarked: boolean;
}

export function CvPreview({ cvData, isWatermarked }: CvPreviewProps) {
  const { personalInfo, experiences, education, skills } = cvData;

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Live Preview</h3>
          <div className="flex items-center space-x-2">
            {isWatermarked && (
              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                WATERMARKED
              </Badge>
            )}
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              <i className="fas fa-expand-alt"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative min-h-[400px] bg-white">
        {/* Watermark Overlay */}
        {isWatermarked && <div className="watermark-overlay" />}
        
        {/* CV Preview Content */}
        <div className="p-6 text-gray-800 relative">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {personalInfo.fullName || "Your Name"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {personalInfo.title || "Your Professional Title"}
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mt-2">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
            </div>
          </div>
          
          {/* Summary */}
          {personalInfo.summary && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                {personalInfo.summary}
              </p>
            </div>
          )}
          
          {/* Experience */}
          {experiences.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2">
                EXPERIENCE
              </h2>
              <div className="space-y-3">
                {experiences.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">{exp.jobTitle}</h3>
                        <p className="text-xs text-gray-600">{exp.company}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {exp.startDate} - {exp.isCurrent ? "Present" : (exp.endDate || "Present")}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {exp.description.length > 150 && isWatermarked 
                          ? `${exp.description.substring(0, 150)}...`
                          : exp.description
                        }
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education */}
          {education.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2">
                EDUCATION
              </h2>
              <div className="space-y-2">
                {education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-xs text-gray-600">{edu.institution}</p>
                        {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-xs text-gray-500">
                        {edu.startDate} - {edu.isCurrent ? "Present" : (edu.endDate || "Present")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Skills */}
          {Object.keys(skillsByCategory).length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-1 mb-2">
                SKILLS
              </h2>
              <div className="space-y-2">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">{category}</h4>
                    <div className="flex flex-wrap gap-1">
                      {categorySkills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {!personalInfo.fullName && experiences.length === 0 && education.length === 0 && skills.length === 0 && (
            <div className="text-center py-8">
              <i className="fas fa-file-alt text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-sm">Start filling out your information to see a preview</p>
            </div>
          )}
        </div>
        
        {/* Watermark Text */}
        {isWatermarked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-primary/10 text-6xl font-bold transform rotate-45">
              PREVIEW
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
