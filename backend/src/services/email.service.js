const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create a transporter
const createTransporter = () => {
  // Check if we have email configuration
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    logger.warn('Email configuration not found. Using mock email service.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Email templates
const TEMPLATES = {
  welcome: {
    subject: 'Welcome to Shakti Margam',
    template: `
      <h1>Welcome to Shakti Margam, {{name}}!</h1>
      <p>Thank you for joining Shakti Margam, the AI-powered platform designed to empower women entrepreneurs in Telangana.</p>
      <p>With Shakti Margam, you can:</p>
      <ul>
        <li>Get personalized business guidance</li>
        <li>Access Telangana-specific market insights</li>
        <li>Develop effective social media strategies</li>
        <li>Analyze your financial health</li>
        <li>Connect with government schemes and resources</li>
      </ul>
      <p>To get started, simply log in to your account and create a business profile.</p>
      <p>If you have any questions, feel free to contact us at support@shaktimargam.org.</p>
      <p>Best regards,<br>The Shakti Margam Team</p>
    `
  },
  passwordReset: {
    subject: 'Password Reset Request',
    template: `
      <h1>Password Reset Request</h1>
      <p>Hello {{name}},</p>
      <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
      <p>To reset your password, click the link below:</p>
      <p><a href="{{resetUrl}}">Reset Password</a></p>
      <p>This link will expire in 10 minutes.</p>
      <p>Best regards,<br>The Shakti Margam Team</p>
    `
  },
  contactForm: {
    subject: 'Thank you for contacting Shakti Margam',
    template: `
      <h1>Thank you for contacting us!</h1>
      <p>Hello {{name}},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>Here's a copy of your message:</p>
      <p>{{message}}</p>
      <p>Best regards,<br>The Shakti Margam Team</p>
    `
  },
  newsletter: {
    subject: 'Welcome to Shakti Margam Newsletter',
    template: `
      <h1>Welcome to the Shakti Margam Newsletter!</h1>
      <p>Hello {{name}},</p>
      <p>Thank you for subscribing to our newsletter. You'll now receive updates on:</p>
      <ul>
        <li>New features and resources</li>
        <li>Success stories of women entrepreneurs</li>
        <li>Upcoming events and workshops</li>
        <li>Government schemes and opportunities</li>
      </ul>
      <p>Best regards,<br>The Shakti Margam Team</p>
    `
  }
};

/**
 * Send an email
 * @param {Object} params
 * @param {string} params.email - The recipient's email
 * @param {string} params.subject - The email subject
 * @param {string} params.template - The template name or HTML content
 * @param {Object} params.data - The data to populate the template
 * @returns {Promise<Object>} - The send result
 */
exports.sendEmail = async ({ email, subject, template, data = {} }) => {
  try {
    // Create transporter
    const transporter = createTransporter();

    // If no transporter (missing config), just log the email
    if (!transporter) {
      logger.info(`[MOCK EMAIL] To: ${email}, Subject: ${subject}, Template: ${template}`);
      logger.info(`[MOCK EMAIL] Data: ${JSON.stringify(data)}`);
      return true;
    }

    // Get template content
    let html;
    if (TEMPLATES[template]) {
      html = TEMPLATES[template].template;
      subject = subject || TEMPLATES[template].subject;
    } else {
      html = template;
    }

    // Replace template variables
    for (const [key, value] of Object.entries(data)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    // Send email
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Shakti Margam <noreply@shaktimargam.org>',
      to: email,
      subject,
      html
    });

    logger.info(`Email sent to ${email}: ${subject}`);
    return result;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    // Don't throw error, just return false to prevent API failures due to email issues
    return false;
  }
};

/**
 * Send a welcome email
 * @param {Object} user - The user object
 * @returns {Promise<Object>} - The send result
 */
exports.sendWelcomeEmail = async (user) => {
  return this.sendEmail({
    email: user.email,
    template: 'welcome',
    data: {
      name: user.name
    }
  });
};

/**
 * Send a password reset email
 * @param {Object} params
 * @param {Object} params.user - The user object
 * @param {string} params.resetUrl - The reset URL
 * @returns {Promise<Object>} - The send result
 */
exports.sendPasswordResetEmail = async ({ user, resetUrl }) => {
  return this.sendEmail({
    email: user.email,
    template: 'passwordReset',
    data: {
      name: user.name,
      resetUrl
    }
  });
};
