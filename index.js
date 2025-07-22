const fetchEmails = require("./emailClient");
const classifyEmail = require("./openai");
const XLSX = require("xlsx");
const fs = require("fs");

(async () => {
  const allRows = [];

  fetchEmails(async (emails) => {
    for (const email of emails) {
      const resultJson = await classifyEmail(email.text, email.subject);

      let result = {
        classification: "Other",
        company_name: "",
        position: "",
        feedback: "",
      };

      try {
        result = JSON.parse(resultJson);
      } catch (err) {
        console.error("Failed to parse classification JSON:", resultJson);
        continue;
      }

      const row = {
        Sender: email.from,
        Subject: email.subject,
        Classification: result.classification,
        Company: result.company_name,
        Position: result.position,
      };

      // Only for rejections, add feedback
      if (result.classification === "Rejection" && result.feedback) {
        row.Feedback = result.feedback;
      }

      allRows.push(row);
      console.log(`Processed (${result.classification}): ${email.subject}`);
    }

    if (allRows.length === 0) {
      console.log("No relevant emails to write to Excel.");
      return;
    }

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(allRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Emails");

    // Save to file
    XLSX.writeFile(workbook, "classified_emails.xlsx");
    console.log("All saved to classified_emails.xlsx");
  });
})();
