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

  return (
    <Card className="p-4">
      <CalendarUI
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className="rounded-md border"
        components={{
          DayContent: ({ date }) => {
            const dateStr = date.toISOString().split('T')[0];
            const mood = selectedMoods[dateStr];
            return (
              <div className="relative w-full h-full flex items-center justify-center">
                <span>{date.getDate()}</span>
                {mood && (
                  <span className="absolute bottom-0 right-0 text-xs">
                    {moodEmojis[mood]}
                  </span>
                )}
              </div>
            );
          }
        }}
      />
    </Card>
  );
}
