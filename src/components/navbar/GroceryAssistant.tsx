"use client";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import GroceryAssistantInput from "./GroceryAssistantInput";
import { getGrocerySuggestions } from "@/server-actions/ai/getGrocerySuggestions";
import { matchGroceryProducts } from "@/server-actions/ai/matchGroceryProducts";
import GrocerySuggestionsList, {
  GrocerySuggestion,
} from "./GrocerySuggestionsList";

interface GroceryAssistantProps {
  open: boolean;
  onClose: () => void;
}

interface SuggestedItem {
  name: string;
  quantity: number;
}

export default function GroceryAssistant({
  open,
  onClose,
}: GroceryAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<SuggestedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [suggesstions, setSuggestions] = useState<GrocerySuggestion[]>([]);

  const handleSearch = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setItems([]);

    try {
      const aiResult = await getGrocerySuggestions(prompt);
      console.log(aiResult);

      if (!aiResult.success) {
        setError(aiResult.message ?? "Something went wrong. Please try again.");
        return;
      }

      setItems(aiResult.items);

      const productResult = await matchGroceryProducts(aiResult.items);

      setIsLoading(false);
      if (!productResult.success) {
        console.log(productResult);
        return;
      }

      setSuggestions(productResult.products);
    } catch (err) {
      console.error("GROCERY_ASSISTANT_ERROR:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-60 flex h-dvh w-full max-w-105 flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F7EF] text-primary">
              <LuSparkles size={18} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">
                AI Grocery Assistant
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                Your smart shopping assistant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-background text-muted transition hover:bg-border hover:text-text"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div>
            <h3 className="text-lg font-semibold text-text">
              What are you cooking today?
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Tell me what you want to cook and I&apos;ll find the groceries you
              need from our store.
            </p>
          </div>

          <div className="mt-6">
            <GroceryAssistantInput
              onSearch={handleSearch}
              isLoading={isLoading}
            />
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F7EF] text-primary">
                  <LuSparkles className="animate-pulse" size={22} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-text">
                  Finding your groceries...
                </h3>
                <p className="mt-2 max-w-xs text-xs leading-5 text-muted">
                  We&apos;re understanding your request and finding the right
                  products from our store.
                </p>
              </div>
            ) : (
              suggesstions.length > 0 && (
                <div className="my-6 pb-20">
                  <h3 className="mb-3 text-sm font-semibold text-text">
                    Your Grocery List
                  </h3>
                  <GrocerySuggestionsList suggestions={suggesstions} />
                </div>
              )
            )}
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          {items.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-medium text-text">
                Suggested ingredients
              </p>
              <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
                {items.map((item, index) => (
                  <li
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between px-3 py-2 text-sm text-text"
                  >
                    <span>{item.name}</span>
                    <span className="text-muted">x{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
