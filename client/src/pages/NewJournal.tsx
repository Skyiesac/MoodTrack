import { useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import NewEntry from "../components/NewEntry";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { api } from "@/utils/api";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

export default function NewJournal() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/signin');
    }
  }, [user, isLoading, setLocation]);

  const handleSubmit = useCallback(async (data) => {
    try {
      const result = await api.entries.create({
        mood: data.mood,
        content: data.content,
        date: new Date().toISOString().split('T')[0],
        tags: data.tags
      });

      if (!result.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error.message
        });
        return;
      }

      toast({
        title: "Success",
        description: "Journal entry saved successfully"
      });
      setLocation('/');
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save journal entry"
      });
    }
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
