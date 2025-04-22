import { useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import "../components/ui/calendar";

const moodEmojis = {
  great: "😄",
  good: "🙂",
  neutral: "😐",
  bad: "😕",
  terrible: "😢"
};

export default function Calendar({ onSelectDate, selectedMoods = {} }) {
  const [date, setDate] = useState(new Date());

  const handleDateSelect = (date) => {
    setDate(date);
    onSelectDate?.(date);
  };

  const modifiers = {
    mood: Object.keys(selectedMoods).map(dateStr => new Date(dateStr))
  };

  const modifiersStyles = {
    mood: {
      color: '#3c3c3c',
      fontWeight: 'bold'
    }
  };

  const moodColors = {
    great: 'bg-green-50 text-green-700',
    good: 'bg-blue-50 text-blue-700',
    neutral: 'bg-gray-50 text-gray-700',
    bad: 'bg-orange-50 text-orange-700',
    terrible: 'bg-red-50 text-red-700'
  };

  return (
    <Card className="p-6 bg-white shadow-lg h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Mood Calendar</h3>
        <p className="text-sm text-gray-500">Track your daily emotional journey</p>
      </div>
      <CalendarUI
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className="rounded-lg border shadow-sm w-full"
        components={{
          DayContent: ({ date }) => {
            const dateStr = date.toISOString().split('T')[0];
            const mood = selectedMoods[dateStr];
            return (
              <div className={`relative w-full h-full flex items-center justify-center rounded-md transition-colors ${mood ? moodColors[mood] : ''}`}>
                <span className="text-sm font-medium">{date.getDate()}</span>
                {mood && (
                  <span className="absolute -bottom-1 -right-1 text-xs transform scale-75">
                    {moodEmojis[mood]}
                  </span>
                )}
              </div>
            );
          }
        }}
      />
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
        {Object.entries(moodEmojis).map(([mood, emoji]) => (
          <div key={mood} className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${moodColors[mood]}`}>
            <span>{emoji}</span>
            <span className="capitalize">{mood}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
