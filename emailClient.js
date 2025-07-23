const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
require("dotenv").config();

function fetchEmails(callback) {
  const imap = new Imap({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT,
    tls: true,
  });

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const imapDate = yesterday
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/,/g, "");

  imap.once("ready", () => {
    imap.openBox("INBOX", false, () => {
      // `false` means write mode
      imap.search(["UNSEEN", ["SINCE", imapDate]], (err, results) => {
        if (err || !results || results.length === 0) return callback([]);

        const emails = [];
        const fetchIds = results.slice(0, 50); // ✅ Limit to 50 emails
        const f = imap.fetch(fetchIds, { bodies: "", markSeen: true }); // ✅ Mark seen

        f.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) return;

              const receivedDate = parsed.date;
              const now = new Date();
              const timeDiff = now - receivedDate;

              if (timeDiff < 24 * 60 * 60 * 1000) {
                emails.push({
                  from: parsed.from.text,
                  subject: parsed.subject,
                  text: parsed.text,
                  date: receivedDate,
                });
              }
            });
          });
        });

        f.once("end", () => {
          imap.end();

          emails.sort((a, b) => b.date - a.date);
          callback(emails); // return all that matched, no further slicing
        });
      });
    });
  });

  imap.connect();
}

module.exports = fetchEmails;
