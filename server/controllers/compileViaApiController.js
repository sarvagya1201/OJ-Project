import axios from "axios";


export const compileViaApi = async (language, code, input) => {
  try {
    const response = await axios.post(process.env.COMPILER_API_URL, {
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
