import { useCallback } from "react";
import { useLocation } from "wouter";
import NewEntry from "../components/NewEntry";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewJournal() {
  const [, setLocation] = useLocation();

  const handleSubmit = useCallback((data) => {
    // In a real app, this would make an API call
    console.log('Submitting entry:', data);
    setLocation('/');
  }, [setLocation]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="text-[#3c3c3c]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Journal
        </Button>
      </div>
      <NewEntry onSubmit={handleSubmit} />
    </div>
  );
}
