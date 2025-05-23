const GlobalLoading = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="flex flex-col items-center">
      <span className="relative flex h-12 w-12">
        <span className="animate-spin absolute inline-flex h-full w-full rounded-full border-4 border-solid border-primary border-t-transparent"></span>
        <span className="sr-only">Loading...</span>
      </span>
      <span className="mt-4 text-base text-primary font-medium">Loading...</span>
    </div>
  </div>
);

export default GlobalLoading;
