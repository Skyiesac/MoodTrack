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
    <Card className="shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-[#2d3748]">
              How are you feeling today?
            </Label>
            <RadioGroup defaultValue="neutral" className="flex flex-wrap gap-4">
              {moods.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={value}
                    id={value}
                    {...register("mood", { required: true })}
                    className="border-[#6b8aaf] text-[#6b8aaf]"
                  />
                  <Label htmlFor={value} className="text-[#4a5568] hover:text-[#2d3748] transition-colors">
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-lg font-semibold text-[#2d3748]">
              Journal Entry
            </Label>
            <Textarea
              id="content"
              placeholder="Write your thoughts here..."
              className="min-h-[150px] border-[#e4e2de] focus:border-[#6b8aaf] focus:ring-[#6b8aaf]"
              {...register("content", { required: true })}
            />
            {errors.content && (
              <span className="text-red-500 text-sm">This field is required</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-lg font-semibold text-[#2d3748]">
              Tags
            </Label>
            <div className="space-y-3">
              <Input
                id="tags"
                value={currentTag}
                onChange={handleTagInput}
                placeholder="Add tags (separate with commas)"
                className="border-[#e4e2de] focus:border-[#6b8aaf] focus:ring-[#6b8aaf]"
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#f4e3cf] text-[#3c3c3c] transition-all hover:bg-[#d0cbbd]"
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

          <Button
            type="submit"
            className="w-full bg-[#6b8aaf] text-white hover:bg-[#5a769c] transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md"
          >
            Save Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}