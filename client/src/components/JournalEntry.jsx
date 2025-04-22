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

  const moodColors = {
    great: 'bg-green-50 border-green-200 text-green-700',
    good: 'bg-blue-50 border-blue-200 text-blue-700',
    neutral: 'bg-gray-50 border-gray-200 text-gray-700',
    bad: 'bg-orange-50 border-orange-200 text-orange-700',
    terrible: 'bg-red-50 border-red-200 text-red-700'
  };

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div>
          <div className="font-semibold text-lg text-gray-900">
            {formatDate(entry.date)}
          </div>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-1 border ${moodColors[entry.mood]}`}>
            {moodEmojis[entry.mood]} {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-gray-700 leading-relaxed">{entry.content}</p>
        {entry.tags && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {entry.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
