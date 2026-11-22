export default function OrdersSkeleton({ number = 3 }: { number?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: number }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border bg-background px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#f5f5f5]" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-[#f5f5f5]" />
                <div className="h-3 w-24 rounded bg-[#f5f5f5]" />
              </div>
            </div>
            <div className="h-6 w-24 rounded-full bg-[#f5f5f5]" />
          </div>
          <div className="grid gap-6 p-5 md:grid-cols-[1.6fr_1fr_1fr]">
            <div className="space-y-3">
              {[0, 1].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-[#f5f5f5]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-[#f5f5f5]" />
                    <div className="h-3 w-1/3 rounded bg-[#f5f5f5]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-28 rounded bg-[#f5f5f5]" />
              <div className="h-3 w-36 rounded bg-[#f5f5f5]" />
              <div className="h-3 w-24 rounded bg-[#f5f5f5]" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-[#f5f5f5]" />
              <div className="h-4 w-full rounded bg-[#f5f5f5]" />
              <div className="h-4 w-full rounded bg-[#f5f5f5]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
