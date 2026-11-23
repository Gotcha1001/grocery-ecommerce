import { FormEvent, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";

interface GroceryAssistantInputProps {
  onSearch: (prompt: string) => void;
  isLoading: boolean;
}

const suggestions = [
  {
    label: "Spaghetti for 4",
    prompt: "I want to make spaghetti for 4 people",
  },
  {
    label: "Chicken fried rice",
    prompt: "What do I need to make chicken fried rice?",
  },
  {
    label: "Pancakes",
    prompt: "I want to make pancakes for breakfast",
  },
  {
    label: "Healthy salad",
    prompt: "What ingredients do I need for a healthy salad?",
  },
  {
    label: "Tacos for 4",
    prompt: "I want to make tacos for 4 people",
  },
  {
    label: "Homemade pizza",
    prompt: "What do I need to make homemade pizza?",
  },
  {
    label: "Beef stir-fry",
    prompt: "I want to make a quick beef stir-fry for 2 people",
  },
  {
    label: "Vegetable soup",
    prompt: "What ingredients do I need for a simple vegetable soup?",
  },
  {
    label: "Classic burgers",
    prompt: "I want to make homemade burgers for 4 people",
  },
  {
    label: "Pasta carbonara",
    prompt: "How do I make pasta carbonara for 2?",
  },
  {
    label: "Cheese omelette",
    prompt: "I want to make a fluffy cheese omelette for breakfast",
  },
  {
    label: "Chicken curry",
    prompt: "What do I need to make a simple chicken curry?",
  },
  {
    label: "Lasagna",
    prompt: "I want to make lasagna for 6 people",
  },
  {
    label: "Grilled cheese",
    prompt: "How do I make the perfect grilled cheese sandwich?",
  },
  {
    label: "Fish tacos",
    prompt: "I want to make fish tacos for 4 people",
  },
  {
    label: "Banana bread",
    prompt: "What ingredients do I need for easy banana bread?",
  },
];

export default function GroceryAssistantInput({
  onSearch,
  isLoading,
}: GroceryAssistantInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isLoading) {
      return;
    }
    onSearch(trimmedPrompt);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-border bg-background p-3 transition focus-within:border-primary">
          <textarea
            className="w-full resize-none bg-transparent px-2 py-1 text-sm text-text outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="I want to make spaghetti for 4 people..."
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
            <p className="hidden text-xs text-muted sm:block">
              Describe what you want to cook
            </p>
            <button
              className="ml-auto flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={!prompt.trim() || isLoading}
            >
              <LuSparkles size={15} />
              {isLoading ? "Finding..." : "Find Groceries"}
              {!isLoading && <FiArrowRight size={15} />}
            </button>
          </div>
        </div>
      </form>
      <div className="mt-4">
        <p className="text-xs font-medium text-text">Try Asking</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
              type="button"
              onClick={() => setPrompt(suggestion.prompt!)}
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
