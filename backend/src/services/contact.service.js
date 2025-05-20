const logger = require('../utils/logger');
const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');
const emailService = require('./email.service');

// Define Contact Form model
const ContactForm = sequelize.define('ContactForm', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('new', 'in-progress', 'resolved'),
    defaultValue: 'new'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

/**
 * Save a contact form submission
 * @param {Object} form - Contact form data
 * @param {string} form.name - Name
 * @param {string} form.email - Email
 * @param {string} form.message - Message
 * @param {string} form.phone - Phone number (optional)
 * @returns {Promise<Object>} - The contact form object
 */
exports.saveContactForm = async (form) => {
  try {
    // Create contact form
    const contactForm = await ContactForm.create({
      name: form.name,
      email: form.email,
      message: form.message,
      phone: form.phone,
      status: 'new'
    });

    logger.info(`Added contact form from: ${form.email}`);

    // Send confirmation email to user
    await emailService.sendEmail({
      email: form.email,
      template: 'contactForm',
      data: {
        name: form.name,
        message: form.message
      }
    });

    // Send notification email to admin
    await emailService.sendEmail({
      email: process.env.ADMIN_EMAIL || 'admin@shaktimargam.org',
      subject: 'New Contact Form Submission',
      template: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${form.name}</p>
        <p><strong>Email:</strong> ${form.email}</p>
        <p><strong>Phone:</strong> ${form.phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${form.message}</p>
      `,
      data: {}
    });

    return contactForm;
  } catch (error) {
    logger.error(`Error saving contact form: ${error.message}`);
    throw error;
  }
};

/**
 * Get all contact form submissions
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of forms to return
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.status - Filter by status
 * @returns {Promise<Object>} - Contact forms and count
 */
exports.getContactForms = async (options = {}) => {
  try {
    const { limit = 100, offset = 0, status } = options;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }

    // Get contact forms
    const { count, rows } = await ContactForm.findAndCountAll({
      where: query,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      contactForms: rows,
      total: count,
      limit,
      offset
    };
  } catch (error) {
    logger.error(`Error getting contact forms: ${error.message}`);
    throw error;
  }
};

/**
 * Update contact form status
 * @param {string} id - Contact form ID
 * @param {string} status - New status
 * @param {string} notes - Optional notes
 * @returns {Promise<Object>} - The updated contact form
 */
exports.updateContactFormStatus = async (id, status, notes) => {
  try {
    // Find contact form
    const contactForm = await ContactForm.findByPk(id);

    if (!contactForm) {
      logger.warn(`Contact form not found: ${id}`);
      throw new Error('Contact form not found');
    }

    // Update status
    contactForm.status = status;
    if (notes) {
      contactForm.notes = notes;
    }

    await contactForm.save();

    logger.info(`Updated contact form status: ${status}`);
    return contactForm;
  } catch (error) {
    logger.error(`Error updating contact form status: ${error.message}`);
    throw error;
  }
};

// Export the model for use in other services
exports.ContactForm = ContactForm;
