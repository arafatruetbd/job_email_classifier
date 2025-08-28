

# job_email_classifier

A Node.js application that fetches unseen emails from the last 24 hours via IMAP, classifies them using the OpenRouter API (LLM), extracts job-related information, and exports the results to an Excel file.

---

## Features

- Fetches unseen emails received in the last 24 hours (up to 50 emails per run).
- Uses a large language model (LLM) via OpenRouter API to classify emails as `Offer`, `Rejection`, `Applied`, or `Other`.
- Extracts company name, position title (from subject or email body), and feedback (for rejections).
- Saves classified emails with details to `classified_emails.xlsx`.
- Marks fetched emails as seen to avoid duplicate processing.

---

## Prerequisites

- Node.js (v16 or newer recommended)
- An email account with IMAP access enabled (e.g., Gmail, Outlook).
- OpenRouter API key (free or paid) - register at [https://openrouter.ai](https://openrouter.ai).

---

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/arafat.ruet.bd/job_email_classifier.git
   cd job_email_classifier


2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root (you can copy `.env.example`):

   ```env
   OPENROUTER_API_KEY=your-openrouter-api-key
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password-or-app-password
   IMAP_HOST=imap.your-email-provider.com
   IMAP_PORT=993
   ```

   > **Note:**
   >
   > * Use app-specific password if required by your email provider (e.g., Gmail).
   > * Ensure IMAP is enabled on your email account.

---

## Usage

Run the app manually:

```bash
node index.js
```

What happens:

* Connects to your email inbox via IMAP.
* Fetches up to 50 unseen emails received in the last 24 hours.
* Sends email content and subject to OpenRouter API for classification.
* Extracts classification, company name, position title, and rejection feedback (if any).
* Saves all relevant emails (classified as Offer, Rejection, or Applied) to an Excel file `classified_emails.xlsx`.
* Marks fetched emails as read/seen.

---

## Automating Execution

You can automate running this script every 24 hours using:

### Windows Task Scheduler

* Open Task Scheduler.
* Create a Basic Task.
* Set trigger to daily (every 1 day).
* Action: Start a program.
* Program/script: `node`
* Add arguments: `C:\path\to\your\project\index.js`
* Start in: `C:\path\to\your\project\`
* Finish setup and ensure your PC is on/running for the task to execute.

### Linux/macOS Cron Job

Edit your crontab with `crontab -e` and add:

```cron
0 2 * * * /usr/bin/node /path/to/job_email_classifier/index.js
```

This runs the script daily at 2:00 AM.

---

## Project Structure

```
.
├── emailClient.js      # Fetch emails from IMAP, mark as seen
├── openai.js           # Call OpenRouter API to classify emails
├── index.js            # Main script: fetch, classify, save to Excel
├── .env.example        # Environment variable template
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

---

## Dependencies

* [node-imap](https://github.com/mscdex/node-imap) - IMAP client to read emails
* [mailparser](https://nodemailer.com/extras/mailparser/) - Parse email content
* [axios](https://axios-http.com/) - HTTP client for API requests
* [dotenv](https://github.com/motdotla/dotenv) - Load environment variables
* [xlsx](https://github.com/SheetJS/sheetjs) - Generate Excel files

---

## Environment Variables

| Variable             | Description                             |
| -------------------- | --------------------------------------- |
| OPENROUTER\_API\_KEY | Your OpenRouter API key                 |
| EMAIL\_USER          | Email address used for IMAP             |
| EMAIL\_PASS          | Email password or app-specific pass     |
| IMAP\_HOST           | IMAP server host (e.g., imap.gmail.com) |
| IMAP\_PORT           | IMAP port (usually 993)                 |

---

## Notes

* Emails classified as `Other` are ignored and not saved.
* The script marks emails as seen after processing to avoid duplicates.
* Classification depends on the OpenRouter LLM response accuracy.
* The Excel file is saved in the root project directory as `classified_emails.xlsx`.

---

## Troubleshooting

* **IMAP connection issues:**
  Check your email credentials and ensure IMAP access is enabled.

* **OpenRouter API errors:**
  Verify your API key and usage quota on [OpenRouter dashboard](https://openrouter.ai).

* **No emails processed:**
  Ensure there are unseen emails in the last 24 hours that match the classification criteria.

---

## License

MIT © Arfat Hossain

---

Feel free to contribute or open issues for support!
Happy coding! 🚀

```

---

Just replace the placeholders (like `your-openrouter-api-key`, `your-email@example.com`) with your actual credentials and you're good to go!
```
