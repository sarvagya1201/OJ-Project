import Review from "../features/ai-integration/AiReview";

const AiReviewPage = () => {
  return (
    <div>
      <h1 className="flex justify-center items-center gap-2 p-4">
        <img src="/google-gemini-icon.svg" alt="Gemini Icon" className="w-8 h-8" />
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Powered by
        </span>
        <img src="/Google_Gemini_logo.svg" alt="Gemini Logo" className="w-20 h-auto align-middle mb-1.5" />
      </h1>

      <Review />
    </div>
  );
};

export default AiReviewPage;
