import { useParams } from "react-router-dom";
import SubmitForm from "../features/submission/SubmitForm";

const SubmitPage = () => {
  const { id: problemId } = useParams();
  return <SubmitForm problemId={problemId} />;
};

export default SubmitPage;