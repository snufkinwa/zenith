import CodeEnvironment from "@components/codeenviroment/CodeEnvironment";
import problemsData from "@public/data/problems.json";

export default function BetaPage() {
  return (
    <div className="h-full w-full">
      <CodeEnvironment problems={problemsData} />
    </div>
  );
}