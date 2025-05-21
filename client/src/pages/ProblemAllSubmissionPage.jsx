import ProblemSubmissions from "../features/submission/ProblemAllSubmission";
import { Link } from "react-router-dom";

const ProblemAllSubmissionsPage = () => {
  return (
    <div>
      <h1 className="text-2xl text-center font-bold p-4">All Submissions</h1>
      <ProblemSubmissions />
    </div>
  );
};

export default ProblemAllSubmissionsPage;
