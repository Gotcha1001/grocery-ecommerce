export default function ProductPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-3 w-10 rounded bg-[#f5f5f5]" />
        <div className="h-3 w-3 rounded bg-[#f5f5f5]" />
        <div className="h-3 w-16 rounded bg-[#f5f5f5]" />
        <div className="h-3 w-3 rounded bg-[#f5f5f5]" />
        <div className="h-3 w-28 rounded bg-[#f5f5f5]" />
      </div>

      {/* Product */}
      <div className="flex flex-col gap-8 md:gap-12 lg:flex-row lg:gap-16">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto sm:w-20 sm:flex-col">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 w-20 shrink-0 rounded-lg bg-[#f5f5f5]"
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="h-72 w-full rounded-lg bg-[#f5f5f5] sm:h-96 md:h-[500px]" />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2">
          {/* Product Name */}
          <div className="h-9 w-3/4 rounded bg-[#f5f5f5] sm:h-10 lg:h-12" />

          {/* Category */}
          <div className="mt-3 h-4 w-24 rounded bg-[#f5f5f5]" />

          {/* Price */}
          <div className="mt-6 space-y-2">
            <div className="h-4 w-20 rounded bg-[#f5f5f5]" />
            <div className="h-8 w-28 rounded bg-[#f5f5f5] sm:h-9" />
          </div>

          {/* About Product */}
          <div className="mt-8">
            <div className="h-5 w-32 rounded bg-[#f5f5f5]" />

            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-[#f5f5f5]" />
              <div className="h-3 w-full rounded bg-[#f5f5f5]" />
              <div className="h-3 w-5/6 rounded bg-[#f5f5f5]" />
              <div className="h-3 w-2/3 rounded bg-[#f5f5f5]" />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="h-14 w-full rounded-lg bg-[#f5f5f5]" />
            <div className="h-14 w-full rounded-lg bg-[#f5f5f5]" />
          </div>
        </div>
      </div>
    </div>
  );
}
