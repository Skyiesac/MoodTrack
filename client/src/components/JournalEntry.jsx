import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { formatDate } from "../utils/formatDate";

export default function JournalEntry({ entry }) {
  const moodEmojis = {
    great: "😄",
    good: "🙂",
    neutral: "😐",
    bad: "😕",
    terrible: "😢"
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="font-semibold text-lg text-[#3c3c3c]">
          {formatDate(entry.date)}
        </div>
        <div className="text-2xl">{moodEmojis[entry.mood]}</div>
      </CardHeader>
      <CardContent>
        <p className="text-[#6d6d6d]">{entry.content}</p>
        {entry.tags && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {entry.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full text-sm bg-[#f4e3cf] text-[#3c3c3c]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
