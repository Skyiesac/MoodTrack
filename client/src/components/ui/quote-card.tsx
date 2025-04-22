import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote as QuoteIcon } from "lucide-react";
import { useQuote } from "@/hooks/use-quotes";
import { cn } from "@/lib/utils";

interface QuoteCardProps extends React.HTMLAttributes<HTMLDivElement> {
  source?: 'random' | 'zen';
}

export function QuoteCard({ source = 'random', className, ...props }: QuoteCardProps) {
  const { data: quote, isLoading, isError } = useQuote(source);

  if (isError) {
    return (
      <Card className={cn("relative overflow-hidden", className)} {...props}>
        <CardContent className="p-4">
          <p className="text-red-500">Error loading quote. Please try refreshing the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("relative overflow-hidden p-4 bg-gray-100 rounded-lg shadow-md", className)} {...props}>
      <CardContent className="pt-6">
        <QuoteIcon className="absolute top-4 right-4 h-4 w-4 text-muted-foreground opacity-50" />

        <div className="space-y-2">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded-lg bg-muted" />
            </div>
          ) : quote ? (
            <>
              <blockquote className="text-lg text-gray-800 font-medium">
                "{quote.content}"
              </blockquote>
              <cite className="block text-right text-sm text-gray-600 not-italic mt-2">
                — {quote.author}
              </cite>
            </>
          ) : (
            <p className="text-gray-600">No quote available at the moment.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
