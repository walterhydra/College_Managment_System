import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'mock_sid';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'mock_token';
const client = accountSid.startsWith('AC') ? twilio(accountSid, authToken) : null;

export const sendSMS = async (to, body) => {
  try {
    if (accountSid === 'mock_sid') {
      console.log(`[Twilio Mock] SMS sent to ${to}: ${body}`);
      return true;
    }
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return message;
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    throw error;
  }
};

export const sendWhatsApp = async (to, body) => {
  try {
    if (accountSid === 'mock_sid') {
      console.log(`[Twilio Mock] WhatsApp sent to whatsapp:${to}: ${body}`);
      return true;
    }
    const message = await client.messages.create({
      body,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
    });
    return message;
  } catch (error) {
    console.error('Twilio WhatsApp Error:', error);
    throw error;
  }
};
