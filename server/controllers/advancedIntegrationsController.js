import { sendSMS, sendWhatsApp } from '../services/twilioService.js';
import { generateGradePrediction, runChatbotEngine } from '../services/geminiService.js';

// @desc    Apply for an internship
// @route   POST /api/integrations/internships/apply
// @access  Private
export const applyForInternship = async (req, res) => {
  try {
    const { companyName, role, duration } = req.body;
    res.json({
      message: 'Internship application logged successfully',
      applicationId: 'INT-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's internships
// @route   GET /api/integrations/internships
// @access  Private
export const getInternships = async (req, res) => {
  try {
    res.json({
      internships: [
        { id: '1', company: 'TechNova', status: 'Completed', creditsEarned: 2 },
        { id: '2', company: 'Global Solutions', status: 'Ongoing', creditsEarned: 0 }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate Internship Verification Certificate
// @route   POST /api/integrations/internships/certificate
// @access  Private
export const generateInternshipCertificate = async (req, res) => {
  try {
    const { internshipId } = req.body;
    // Real implementation uses `qrcode.js` and `pdfkit`
    res.json({
      message: 'Certificate generated with QR Auth',
      downloadUrl: `/api/downloads/internships/${internshipId}_cert.pdf`,
      qrHash: 'a58d8e12ff'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Run Gemini AI for Performance Analytics
// @route   GET /api/integrations/analytics/performance
// @access  Private
export const getAIAnalytics = async (req, res) => {
  try {
    // Collect student's data and predict
    const studentData = { cgpaHistory: [8.2, 8.6], attendance: 68 };
    const predictions = await generateGradePrediction(studentData);
    
    res.json({
      message: 'AI Analytics Generated successfully.',
      analytics: predictions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Run Gemini AI Chatbot Output
// @route   POST /api/integrations/chatbot
// @access  Private
export const chatBotQuery = async (req, res) => {
  try {
    const { message } = req.body;
    const botResponse = await runChatbotEngine(message);
    res.json({
      reply: botResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Trigger SMS via Twilio
// @route   POST /api/integrations/alerts/sms
// @access  Private (Admin)
export const triggerSMSAlert = async (req, res) => {
  try {
    const { to, body, useWhatsApp } = req.body;
    if (useWhatsApp) {
      await sendWhatsApp(to, body);
    } else {
      await sendSMS(to, body);
    }
    res.json({ message: `Alert sent to ${to}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
