import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewEntry from "../components/NewEntry";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { api } from "../utils/api";
import { useUser } from "../hooks/use-user";
import { useToast } from "../hooks/use-toast";

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Entry</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-700">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto">
        <NewEntry onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
