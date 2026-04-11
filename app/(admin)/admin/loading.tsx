export default function AdminDashboardLoading() {
  return (
    <div className="p-6 lg:p-8 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="space-y-3">
          <div className="h-8 w-40 rounded-xl bg-slate-200"></div>
          <div className="h-4 w-72 max-w-full rounded-lg bg-slate-100"></div>
        </div>
        <div className="h-11 w-56 rounded-xl bg-slate-100"></div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <div className="h-11 w-11 rounded-xl bg-slate-100"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded-lg bg-slate-100"></div>
              <div className="h-7 w-28 rounded-lg bg-slate-200"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="space-y-2">
              <div className="h-5 w-36 rounded-lg bg-slate-200"></div>
              <div className="h-3 w-24 rounded-lg bg-slate-100"></div>
            </div>
            <div className="h-4 w-20 rounded-lg bg-slate-100"></div>
          </div>
          <div className="p-5 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-4 gap-4">
                <div className="h-4 rounded-lg bg-slate-100"></div>
                <div className="h-4 rounded-lg bg-slate-100"></div>
                <div className="h-4 rounded-lg bg-slate-100"></div>
                <div className="h-4 rounded-lg bg-slate-100"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 space-y-2">
            <div className="h-5 w-32 rounded-lg bg-slate-200"></div>
            <div className="h-3 w-28 rounded-lg bg-slate-100"></div>
          </div>
          <div className="p-5 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded-lg bg-slate-200"></div>
                  <div className="h-2 w-full rounded-full bg-slate-100"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
