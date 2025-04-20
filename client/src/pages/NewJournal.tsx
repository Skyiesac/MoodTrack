import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewEntry from "../components/NewEntry";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { api } from "@/utils/api";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

interface EntryData {
  mood: string;
  content: string;
  tags: string[];
}

const moodToNumber = (mood: string): number => {
  const moodMap: Record<string, number> = {
    'terrible': 1,
    'bad': 2,
    'neutral': 3,
    'good': 4,
    'great': 5
  };
  return moodMap[mood] || 3;
};

export default function NewJournal() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/signin');
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = useCallback(async (data: EntryData) => {
    try {
      const result = await api.entries.create({
        mood: moodToNumber(data.mood),
        content: data.content,
        date: new Date(),
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
      navigate('/');
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save journal entry"
      });
    }
  }, [navigate, toast]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
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
