import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export default function NewEntry({ onSubmit }) {
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const moods = [
    { value: "great", label: "Great 😄" },
    { value: "good", label: "Good 🙂" },
    { value: "neutral", label: "Neutral 😐" },
    { value: "bad", label: "Bad 😕" },
    { value: "terrible", label: "Terrible 😢" }
  ];

  const handleTagInput = (e) => {
    const input = e.target.value;
    setCurrentTag(input);

    // If the input ends with a comma, add the tag
    if (input.endsWith(',')) {
      const newTag = input.slice(0, -1).trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setCurrentTag("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFormSubmit = (data) => {
    // Add the current tag if it exists and doesn't end with a comma
    if (currentTag.trim() && !currentTag.endsWith(',')) {
      if (!tags.includes(currentTag.trim())) {
        setTags(prev => [...prev, currentTag.trim()]);
      }
    }

    onSubmit({
      ...data,
      tags: currentTag.trim() 
        ? [...tags, currentTag.trim()].filter((tag, index, self) => self.indexOf(tag) === index)
        : tags,
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Card className="shadow-lg bg-white">
      <CardContent className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">New Journal Entry</h2>
          <p className="mt-1 text-sm text-gray-500">
            Take a moment to reflect on your day and capture your thoughts
          </p>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-900">
              How are you feeling today?
            </Label>
            <RadioGroup defaultValue="neutral" className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
              {moods.map(({ value, label }) => (
                <div
                  key={value}
                  className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    value === "great" ? "hover:border-green-500 hover:bg-green-50" :
                    value === "good" ? "hover:border-blue-500 hover:bg-blue-50" :
                    value === "neutral" ? "hover:border-gray-500 hover:bg-gray-50" :
                    value === "bad" ? "hover:border-orange-500 hover:bg-orange-50" :
                    "hover:border-red-500 hover:bg-red-50"
                  }`}
                >
                  <RadioGroupItem
                    value={value}
                    id={value}
                    {...register("mood", { required: true })}
                    className="hidden"
                  />
                  <Label
                    htmlFor={value}
                    className="text-gray-700 hover:text-gray-900 transition-colors cursor-pointer text-center"
                  >
                    <div className="text-2xl mb-1">{label.split(' ')[1]}</div>
                    <div className="text-sm font-medium">{label.split(' ')[0]}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-lg font-semibold text-gray-900">
              Journal Entry
            </Label>
            <div className="mt-2">
              <Textarea
                id="content"
                placeholder="Write your thoughts here..."
                className="min-h-[200px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-gray-700 placeholder-gray-400 resize-none"
                {...register("content", { required: true })}
              />
            </div>
            {errors.content && (
              <span className="text-red-500 text-sm">This field is required</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-lg font-semibold text-gray-900">
              Tags
            </Label>
            <div className="space-y-3">
              <Input
                id="tags"
                value={currentTag}
                onChange={handleTagInput}
                placeholder="Add tags (separate with commas)"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200 transition-all hover:bg-blue-100"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg px-8"
            >
              Save Entry
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
