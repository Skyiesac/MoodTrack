import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { addDays, format, isWithinInterval, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useState, useMemo } from 'react';

const MOOD_COLORS = {
  great: "#4CAF50",
  good: "#8BC34A",
  neutral: "#FFC107",
  bad: "#FF9800",
  terrible: "#F44336"
};

const MOOD_VALUES = {
  terrible: 1,
  bad: 2,
  neutral: 3,
  good: 4,
  great: 5
};

const PRESET_RANGES = {
  '7d': { label: 'Last 7 days', fn: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  '30d': { label: 'Last 30 days', fn: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  'thisMonth': { label: 'This month', fn: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  'thisYear': { label: 'This year', fn: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
};

// Generate dummy data for the last 30 days
const generateDummyData = () => {
  const data = [];
  const moods = Object.keys(MOOD_VALUES);
  const today = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i);
    data.push({
      date: date.toISOString().split('T')[0],
      mood: moods[Math.floor(Math.random() * moods.length)]
    });
  }
  return data;
};

const DUMMY_ENTRIES = generateDummyData();

export default function MoodVisualizations() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [viewPeriod, setViewPeriod] = useState("daily");
  const [selectedMoods, setSelectedMoods] = useState(Object.keys(MOOD_VALUES));
  const [visualizationType, setVisualizationType] = useState("combined");
  const [comparisonEnabled, setComparisonEnabled] = useState(false);

  // Apply preset range
  const handlePresetRange = (preset) => {
    const range = PRESET_RANGES[preset].fn();
    setDateRange(range);
  };

  // Filter entries based on date range and selected moods
  const filteredEntries = useMemo(() => {
    return DUMMY_ENTRIES.filter(entry => {
      const entryDate = new Date(entry.date);
      return isWithinInterval(entryDate, {
        start: startOfDay(dateRange.from),
        end: endOfDay(dateRange.to)
      }) && selectedMoods.includes(entry.mood);
    });
  }, [dateRange, selectedMoods]);

  // Transform entries for visualization
  const chartData = useMemo(() => {
    return filteredEntries.map(entry => ({
      date: format(new Date(entry.date), 'MMM dd'),
      value: MOOD_VALUES[entry.mood],
      mood: entry.mood,
      // Add percentage calculations for mood distribution
      ...Object.keys(MOOD_VALUES).reduce((acc, mood) => {
        acc[`${mood}Percentage`] = (
          filteredEntries.filter(e => e.mood === mood).length / filteredEntries.length
        ) * 100;
        return acc;
      }, {})
    }));
  }, [filteredEntries]);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-100">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-800">
              {filteredEntries.length}
            </div>
            <p className="text-sm text-gray-500">Total Entries</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                (filteredEntries.filter(e => e.mood === 'great' || e.mood === 'good').length /
                  filteredEntries.length) *
                  100
              )}%
            </div>
            <p className="text-sm text-gray-500">Positive Moods</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {Object.entries(MOOD_VALUES)
                .find(([mood]) =>
                  Math.max(
                    ...Object.entries(
                      filteredEntries.reduce((acc, entry) => {
                        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([, count]) => count)
                  )
                )?.[0] || 'N/A'}
            </div>
            <p className="text-sm text-gray-500">Most Common Mood</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                filteredEntries.reduce((acc, entry) => acc + MOOD_VALUES[entry.mood], 0) /
                  filteredEntries.length *
                  10
              ) / 10}
            </div>
            <p className="text-sm text-gray-500">Average Mood Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Controls Card */}
      <Card className="p-6 bg-white shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Date Range Selection */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-[200px]",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM d")} -{" "}
                          {format(dateRange.to, "MMM d, y")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM d, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>

              {/* Quick Date Range Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(PRESET_RANGES).map(([key, { label }]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetRange(key)}
                    className="text-xs px-2 h-8 whitespace-nowrap"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mood Filter Tabs */}
            <div className="overflow-x-auto">
              <TabsList className="inline-flex justify-start space-x-1.5 p-1">
                {Object.entries(MOOD_VALUES).map(([mood]) => (
                  <TabsTrigger
                    key={mood}
                    value={mood}
                    onClick={() => {
                      if (selectedMoods.includes(mood)) {
                        setSelectedMoods(selectedMoods.filter(m => m !== mood));
                      } else {
                        setSelectedMoods([...selectedMoods, mood]);
                      }
                    }}
                    className={cn(
                      "px-2.5 py-1 text-sm rounded-full",
                      selectedMoods.includes(mood)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    {selectedMoods.includes(mood) && filteredEntries.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1.5 bg-primary-foreground text-primary px-1.5 py-0.5 text-xs"
                      >
                        {Math.round(
                          (filteredEntries.filter(e => e.mood === mood).length /
                            filteredEntries.length) *
                            100
                        )}%
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-3 justify-end">
            <Select value={viewPeriod} onValueChange={setViewPeriod}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily View</SelectItem>
                <SelectItem value="weekly">Weekly View</SelectItem>
                <SelectItem value="monthly">Monthly View</SelectItem>
              </SelectContent>
            </Select>

            {/* Comparison Toggle */}
            <Button
              variant={comparisonEnabled ? "default" : "outline"}
              onClick={() => setComparisonEnabled(!comparisonEnabled)}
              className="w-[130px]"
            >
              {comparisonEnabled ? "Hide Compare" : "Show Compare"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Visualization */}
      <Card className="bg-white shadow-lg">
        <CardHeader className="border-b pb-6">
          <div className="flex justify-between items-center">
            <CardTitle>Mood Trends and Distribution</CardTitle>
            <Select value={visualizationType} onValueChange={setVisualizationType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="combined">Combined View</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  yAxisId="mood"
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(value) =>
                    Object.entries(MOOD_VALUES)
                      .find(([, v]) => v === value)?.[0] || ''
                  }
                />
                {comparisonEnabled && (
                  <YAxis
                    yAxisId="percentage"
                    orientation="right"
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                )}
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Mood") {
                      return Object.entries(MOOD_VALUES)
                        .find(([, v]) => v === value)?.[0] || '';
                    }
                    if (name.endsWith('Percentage')) {
                      return `${Math.round(value)}%`;
                    }
                    return value;
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />

                {/* Main mood line */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6b8aaf"
                  strokeWidth={2}
                  dot={{ fill: "#6b8aaf" }}
                  name="Mood"
                  yAxisId="mood"
                />

                {/* Mood distribution areas when comparison is enabled */}
                {comparisonEnabled && selectedMoods.map(mood => (
                  <Area
                    key={mood}
                    type="monotone"
                    dataKey={`${mood}Percentage`}
                    name={`${mood} %`}
                    fill={MOOD_COLORS[mood]}
                    stroke={MOOD_COLORS[mood]}
                    fillOpacity={0.3}
                    yAxisId="percentage"
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
