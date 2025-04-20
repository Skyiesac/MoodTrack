import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface Entry {
  date: string;
  mood: string;
  content: string;
  tags: string[];
}

interface MoodsByDate {
  [key: string]: string;
}
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Calendar from "../components/Calendar";
import JournalEntry from "../components/JournalEntry";
import MoodVisualizations from "../components/MoodVisualizations";
import { QuoteCard } from "@/components/ui/quote-card";
import { PlusCircle } from "lucide-react";

export default function JournalEntries() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock data - in real app would come from API
  const entries = [
    {
      date: "2024-03-20",
      mood: "great",
      content: "Had a wonderful day! Everything went smoothly.",
      tags: ["productive", "happy"]
    },
    {
      date: "2024-03-19",
      mood: "good",
      content: "Regular day at work, got some tasks done.",
      tags: ["work"]
    },
    {
      date: "2024-03-18",
      mood: "neutral",
      content: "Just an ordinary day.",
      tags: ["routine"]
    },
    {
      date: "2024-03-17",
      mood: "bad",
      content: "Feeling under the weather.",
      tags: ["sick"]
    },
    {
      date: "2024-03-16",
      mood: "great",
      content: "Weekend was amazing!",
      tags: ["weekend", "relaxing"]
    }
  ];

  const moodsByDate: MoodsByDate = entries.reduce((acc, entry) => {
    acc[entry.date] = entry.mood;
    return acc;
  }, {} as MoodsByDate);

  const filteredEntries = selectedDate
    ? entries.filter(entry => entry.date === selectedDate.toISOString().split('T')[0])
    : entries;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#3c3c3c]">Mood Journal</h2>
            <Link to="/new">
          <Button className="bg-[#6b8aaf] text-white hover:bg-[#5a769c]">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </div>

      {/* Daily Quote Card */}
      <QuoteCard className="mb-6" source="random" />

      <Tabs defaultValue="journal" className="space-y-6">
        <TabsList className="w-full justify-start bg-white border-b border-[#e4e2de] p-0 h-auto">
          <TabsTrigger
            value="journal"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#6b8aaf] data-[state=active]:text-[#2d3748] rounded-none px-4 py-2"
          >
            Journal Entries
          </TabsTrigger>
          <TabsTrigger
            value="visualizations"
            className="data-[state=active]:border-b-2 data-[state=active]:border-[#6b8aaf] data-[state=active]:text-[#2d3748] rounded-none px-4 py-2"
          >
            Mood Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Calendar
                onSelectDate={setSelectedDate}
                selectedMoods={moodsByDate}
              />
            </div>
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => (
                <JournalEntry key={index} entry={entry} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="visualizations" className="mt-6">
          <MoodVisualizations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
