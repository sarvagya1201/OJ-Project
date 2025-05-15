import axiosInstance from "./axiosInstance";

export const submitCode = async ({problemId, code, language}) => {
  try {
    const response = await axiosInstance.post("/submissions", {
      problemId,
      language,
      code,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting code:", error);
    throw error;
  }
}