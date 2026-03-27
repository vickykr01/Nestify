const express = require("express");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const router = express.Router();

const createEmailTransporter = () => {
  const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT, SMTP_SECURE } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    return null;
  }

  if (SMTP_HOST) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const getWhatsAppClient = () => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    return null;
  }

  return {
    client: twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN),
    from: TWILIO_WHATSAPP_FROM,
  };
};

router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Name, email, and message are required.",
    });
  }

  const warnings = [];
  let deliveredChannels = 0;

  const ownerMessage = [
    "New Nestify contact request",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Message: ${message}`,
  ].join("\n");

  try {
    const transporter = createEmailTransporter();
    const adminEmail = process.env.CONTACT_NOTIFICATION_EMAIL || process.env.SMTP_USER;

    if (transporter && adminEmail) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: adminEmail,
        subject: `New contact request from ${name}`,
        text: ownerMessage,
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: email,
        subject: "We received your Nestify contact request",
        text: `Hi ${name},\n\nThanks for contacting Nestify. We received your message and will get back to you soon.\n\nYour message:\n${message}`,
      });

      deliveredChannels += 1;
    } else {
      warnings.push("Email notifications are not configured yet.");
    }
  } catch (error) {
    warnings.push(`Email notification failed: ${error.message}`);
  }

  try {
    const whatsapp = getWhatsAppClient();
    const whatsappTo = process.env.CONTACT_WHATSAPP_TO || "whatsapp:+916201373137";

    if (whatsapp) {
      await whatsapp.client.messages.create({
        from: whatsapp.from,
        to: whatsappTo,
        body: ownerMessage,
      });

      deliveredChannels += 1;
    } else {
      warnings.push("WhatsApp notifications are not configured yet.");
    }
  } catch (error) {
    warnings.push(`WhatsApp notification failed: ${error.message}`);
  }

  if (!deliveredChannels) {
    return res.status(500).json({
      error: "No notification channel is configured successfully yet.",
      warnings,
    });
  }

  res.json({
    message: "Contact request sent successfully.",
    warnings,
  });
});

module.exports = router;
