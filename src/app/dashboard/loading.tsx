import { FolderKanban } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F4F1EB] flex flex-col">
      <header className="h-16 border-b border-stone-200 bg-[#FDFBF7] flex items-center justify-between px-8">
        <div className="h-6 w-24 bg-stone-200 animate-pulse rounded"></div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-32 bg-stone-200 animate-pulse rounded"></div>
          <div className="h-9 w-9 bg-stone-200 animate-pulse rounded-full"></div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-48 bg-stone-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-64 bg-stone-200 animate-pulse rounded"></div>
          </div>
          <div className="h-10 w-32 bg-stone-200 animate-pulse rounded-md"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#FDFBF7] border border-stone-200 rounded-xl p-6 h-48 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 bg-stone-100 rounded-lg animate-pulse"></div>
                <div className="h-6 w-16 bg-stone-100 rounded-full animate-pulse"></div>
              </div>
              <div className="h-6 w-3/4 bg-stone-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-stone-100 rounded animate-pulse mt-auto"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
