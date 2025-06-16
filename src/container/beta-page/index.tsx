import CodeEnvironment from "@components/codeenviroment/CodeEnvironment";
import problemsData from "@public/data/problems.json";
import PlatformNav from "@/components/platform-nav";

export default function BetaPage() {
  return (
    <div className="min-h-screen flex flex-row">
      {/* Sidebar */}
      <aside className=" bg-gray-900 text-white flex flex-col">
        <PlatformNav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <CodeEnvironment problems={problemsData} />
      </main>
    </div>
  );
}
