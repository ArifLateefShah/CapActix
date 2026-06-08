import React from "react";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";

export const EmptyState = ({ icon: Icon = Inbox, title, description, action, testId = "empty-state" }) => {
  return (
    <div data-testid={testId} className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-7 w-7 text-muted-foreground/60" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-md">{description}</p>}
      {action && (
        <Button data-testid="empty-state-cta" onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
