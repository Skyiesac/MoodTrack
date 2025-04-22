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
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import Calendar from "../components/Calendar";
import JournalEntry from "../components/JournalEntry";
import MoodVisualizations from "../components/MoodVisualizations";
import { QuoteCard } from "../components/ui/quote-card";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mood Journal</h1>
            <p className="mt-1 text-sm text-gray-600">
              Track and reflect on your daily emotions
            </p>
          </div>
          <Link to="/new">
            <Button className="bg-gradient-to-r from-[#6b8aaf] to-[#5a769c] text-white hover:from-[#5a769c] hover:to-[#496b8c] shadow-lg">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Total Entries</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{entries.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Most Common Mood</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">Great</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">Streak</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">5 days</p>
          </div>
        </div>

        {/* Daily Quote */}
        <QuoteCard className="shadow-lg" source="random" />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100">
          <Tabs defaultValue="journal" className="w-full">
            <TabsList className="flex w-full bg-gray-50 p-1 rounded-t-lg">
              <TabsTrigger
                value="journal"
                className="flex-1 py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
              >
                Journal Entries
              </TabsTrigger>
              <TabsTrigger
                value="visualizations"
                className="flex-1 py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
              >
                Mood Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="journal" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Calendar
                  onSelectDate={setSelectedDate}
                  selectedMoods={moodsByDate}
                />
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry, index) => (
                      <JournalEntry key={index} entry={entry} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No entries found for the selected date
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visualizations" className="p-6">
              <MoodVisualizations />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
