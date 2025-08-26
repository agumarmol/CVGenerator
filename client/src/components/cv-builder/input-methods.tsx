import { useRef } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CvData } from "@shared/schema";

interface InputMethodsProps {
  onDataImported: (data: Partial<CvData>) => void;
}

export function InputMethods({ onDataImported }: InputMethodsProps) {
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleJSONUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiRequest("POST", "/api/upload-json", formData);
      const data = await response.json();
      
      onDataImported(data.cvData);
      
      toast({
        title: "JSON Uploaded Successfully",
        description: "Your CV data has been imported",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload JSON file",
        variant: "destructive",
      });
    }

    // Reset input
    event.target.value = '';
  };

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      toast({
        title: "Processing PDF...",
        description: "AI is extracting data from your CV",
      });

      const response = await apiRequest("POST", "/api/upload-pdf", formData);
      const data = await response.json();
      
      onDataImported(data.cvData);
      
      toast({
        title: "PDF Processed Successfully",
        description: "Your CV has been analyzed and data extracted",
      });
    } catch (error: any) {
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process PDF file",
        variant: "destructive",
      });
    }

    // Reset input
    event.target.value = '';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <i className="fas fa-rocket text-primary"></i>
        </div>
        <h2 className="text-xl font-semibold text-foreground">Quick Start Your CV</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Upload JSON */}
        <button
          onClick={() => jsonInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
          data-testid="button-upload-json"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
              <i className="fas fa-file-code text-accent text-xl"></i>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Upload JSON Data</h3>
            <p className="text-sm text-muted-foreground mb-3">Import existing CV data from JSON file</p>
            <div className="text-xs text-muted-foreground bg-muted rounded px-2 py-1 inline-block">
              Supports .json format
            </div>
          </div>
          <input
            ref={jsonInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleJSONUpload}
          />
        </button>
        
        {/* Upload PDF with AI */}
        <button
          onClick={() => pdfInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors group relative"
          data-testid="button-upload-pdf"
        >
          <div className="premium-badge absolute -top-2 -right-2 text-xs text-white px-2 py-1 rounded-full font-medium">
            AI POWERED
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <i className="fas fa-file-pdf text-primary text-xl"></i>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Upload Existing CV</h3>
            <p className="text-sm text-muted-foreground mb-3">AI will extract and enhance your data</p>
            <div className="text-xs text-muted-foreground bg-muted rounded px-2 py-1 inline-block">
              Supports PDF format
            </div>
          </div>
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handlePDFUpload}
          />
        </button>
      </div>
    </div>
  );
}
