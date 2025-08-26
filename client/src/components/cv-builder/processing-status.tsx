import { Card, CardContent } from "@/components/ui/card";

export function ProcessingStatus() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <h4 className="text-sm font-medium text-foreground">AI Processing</h4>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Analyzing content...</span>
            <span className="text-primary font-medium">Processing</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Please wait while we enhance your CV with AI technology
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
