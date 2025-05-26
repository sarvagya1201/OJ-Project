import axios from "axios";

export const compileViaApi = async (language, code, input) => {
  try {
    const response = await axios.post("http://localhost:5001/api/run", {
      language,
      code,
      input,
    });
    return response.data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Compiler API error",
      verdict: "Internal Error",
      time: 0,
    };
  }
};
