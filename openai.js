const axios = require("axios");
require("dotenv").config();

const classifyEmail = async (emailContent, emailSubject) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen3-235b-a22b-07-25:free", // or try 'deepseek-coder'
        messages: [
          {
            role: "user",
            content: `From the following email, extract the classification, company name, and position title. The position may appear in either the subject line or the email body. 

If the classification is "Rejection", also write an email for the feedback or reason for rejection and include it in a "feedback" field.

Return the result in valid JSON format as shown below:

{
  "classification": "Offer" | "Rejection" | "Applied" | "Other",
  "company_name": "ExampleCorp",
  "position": "Software Engineer",
  "feedback": "Ask for feedback" // Only for rejection
}

Subject:
${emailSubject}

Email:
${emailContent}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data.choices[0].message.content.trim());

    // Access response data correctly:
    const result = response.data.choices[0].message.content.trim();
    return result;
  } catch (error) {
    console.error("DeepSeek API Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = classifyEmail;
