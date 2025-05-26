import { useParams } from 'react-router-dom';
import SubmitAIForm from '../features/submission/SubmitAIForm';

const SubmitAIPage = () => {
  const { id: problemId } = useParams();
  return <SubmitAIForm problemId={problemId} />;
};

export default SubmitAIPage;