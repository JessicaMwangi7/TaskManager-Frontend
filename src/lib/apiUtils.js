import axios from "axios";

// function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("API Error Response:", error.response.data);
    return error.response.data.message || "An error occurred with the API";
  } else if (error.request) {
    // The request was made but no response was received
    console.error("API Error Request:", error.request);
    return "No response received from the server";
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("API Error:", error.message);
    return error.message;
  }
};

// check API connection
export const checkApiConnection = async () => {
  try {
    const response = await axios.get("/");
    return {
      connected: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      connected: false,
      error: handleApiError(error),
    };
  }
};
