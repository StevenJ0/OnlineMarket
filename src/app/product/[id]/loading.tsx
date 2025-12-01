import Navbar from "@/components/navbar";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 pb-32">
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between mb-6 animate-pulse">
          <div className="h-8 w-32 bg-slate-800 rounded-lg"></div>
          <div className="h-8 w-8 bg-slate-800 rounded-lg"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 space-y-4 animate-pulse">
            <div className="aspect-[4/3] w-full bg-slate-800 rounded-3xl"></div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-slate-800 rounded-xl flex-shrink-0"></div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col space-y-6 animate-pulse">
            <div className="h-6 w-24 bg-slate-800 rounded-full"></div>
            
            <div className="space-y-2">
              <div className="h-8 w-3/4 bg-slate-800 rounded-lg"></div>
              <div className="h-8 w-1/2 bg-slate-800 rounded-lg"></div>
            </div>

            <div className="h-6 w-40 bg-slate-800 rounded-lg"></div>

            <div className="h-12 w-48 bg-slate-800 rounded-lg"></div>

            <div className="h-24 w-full bg-slate-800 rounded-2xl"></div>

            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-800 rounded"></div>
              <div className="h-4 w-full bg-slate-800 rounded"></div>
              <div className="h-4 w-2/3 bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}