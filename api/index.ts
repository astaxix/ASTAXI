import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(express.json());

// SMTP Configuration
const transporter = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Strato specific: sometimes helpful to allow self-signed or specific ciphers
    rejectUnauthorized: false
  }
}) : null;

// Verify transporter on startup
if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP Connection Error:", error);
    } else {
      console.log("SMTP Server is ready to take our messages");
    }
  });
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

app.post("/api/send-email", async (req, res) => {
  if (!transporter) {
    return res.status(500).json({ success: false, message: "Email service not configured" });
  }
  const { to, bcc, subject, html, text } = req.body;
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "Info@as-mietwagen-service.de",
      to: Array.isArray(to) ? to.join(", ") : to,
      bcc: bcc ? (Array.isArray(bcc) ? bcc.join(", ") : bcc) : undefined,
      subject,
      html,
      text
    });
    res.json({ success: true, data: info });
  } catch (err: any) {
    console.error("Email Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const adminUser = process.env.ADMIN_USERNAME || "AS.TAXI";
  const adminPass = process.env.ADMIN_PASSWORD || "##ASTAXI##";

  if (username === adminUser && password === adminPass) {
    res.json({ success: true, token: "admin-session-token-123" });
  } else {
    res.status(401).json({ success: false, message: "Ungültige Anmeldedaten." });
  }
});

// For local development with Vite
if (process.env.NODE_ENV !== "production") {
  const startVite = async () => {
    console.log("Starting Vite in middleware mode...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  };
  startVite();
}

export default app;
