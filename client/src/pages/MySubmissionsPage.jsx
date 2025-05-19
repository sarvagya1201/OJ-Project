import SubmissionsList from "../features/submission/SubmissionsList";
import { Link } from "react-router-dom";

const MySubmissionsPage = () => {
  return (
    <div>
      <h1 className="text-2xl text-center font-bold p-4">All My Submissions</h1>
      <SubmissionsList />
    </div>
  );
};

export default MySubmissionsPage;
