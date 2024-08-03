import CodeEnvironment from "@components/codeenviroment/CodeEnvironment";
import  problemsData  from "@public/data/problems.json";
import Header from "../landing-page/ui/header";
import styles from "./betacontainer.module.css";

export default function BetaPage() {
  return (
    <div className={styles.maincontainer}>
  
        <Header />

      <div className={styles.codeenvironmentcontainer}>
        <CodeEnvironment problems={problemsData} />
      </div>
    </div>
  );
}
