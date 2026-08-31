export default function WorkspaceLoading() {
  return (
    <div className="flex-1 h-full p-4 md:p-8 animate-pulse">
      <div className="h-8 w-64 bg-stone-200 rounded mb-8"></div>
      <div className="flex gap-4 md:gap-6 overflow-hidden">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-1 bg-[#FDFBF7] p-5 rounded-2xl border border-stone-200 h-[70vh] flex flex-col">
            <div className="h-6 w-32 bg-stone-200 rounded mb-6"></div>
            <div className="flex flex-col gap-3">
               <div className="h-24 bg-stone-100 rounded-xl"></div>
               <div className="h-24 bg-stone-100 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
