const Contact = require('../models/Contact');
const XLSX = require('xlsx');
const fs = require('fs');

const contactController = {
  // Upload and process Excel file
  uploadExcel: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No file uploaded' 
        });
      }

      const employeeId = req.params.employeeId;
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert Excel data to JSON
      const data = XLSX.utils.sheet_to_json(worksheet);

      // Validate data structure
      if (!data.length) {
        return res.status(400).json({ 
          success: false, 
          message: 'Excel file is empty' 
        });
      }

      // Log the first row to see what columns are available
      console.log('First row data:', data[0]);

      // Process and save each row with more flexible column name matching
      const savedContacts = await Promise.all(
        data.map(async (row) => {
          // Log the row for debugging
          console.log('Processing row:', row);

          // Use the direct field names since they match your schema
          const contact = new Contact({
            employeeId,
            companyName: row.companyName,
            email: row.email,
            phone: row.phone.toString(), // Convert number to string since phone is a String in schema
            socialMedia: row.socialMedia
          });

          // Validate the document before saving
          try {
            await contact.validate();
          } catch (validationError) {
            console.error('Validation error:', validationError);
            throw validationError;
          }

          return await contact.save();
        })
      );

      // Delete the temporary file
      fs.unlinkSync(req.file.path);

      res.json({ 
        success: true, 
        message: 'Data processed successfully',
        count: savedContacts.length
      });

    } catch (error) {
      // Delete the temporary file if it exists
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      console.error('Error processing file:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error processing file',
        error: error.message,
        // Add more details in development
        details: process.env.NODE_ENV === 'development' ? {
          firstRow: data?.[0],
          errorStack: error.stack
        } : undefined
      });
    }
  },

  // Get contacts by employee ID
  getContactsByEmployee: async (req, res) => {
    try {
      const employeeId = req.params.employeeId;
      
      // Validate employee ID
      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is required'
        });
      }

      // Find all contacts for the employee and populate details
      const contacts = await Contact.find({ employeeId })
        .select('companyName email phone socialMedia view createdAt updatedAt')
        .sort({ createdAt: -1 }); // Sort by newest first

      // Check if any contacts exist
      if (!contacts || contacts.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No contacts found for this employee'
        });
      }

      res.json({ 
        success: true,
        message: 'Contacts retrieved successfully',
        count: contacts.length,
        data: contacts 
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching contacts',
        error: error.message 
      });
    }
  },

  deleteContact: async (req, res) => {
    try {
      const contactId = req.params.id;
      const deletedContact = await Contact.findByIdAndDelete(contactId);
      
      if (!deletedContact) {
        return res.status(404).json({ 
          success: false, 
          message: 'Contact not found' 
        });
      }

      res.json({ 
        success: true, 
        message: 'Contact deleted successfully',
        data: deletedContact 
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error deleting contact',
        error: error.message 
      });
    }
  },

  // Update view count for a contact
  updateView: async (req, res) => {
    try {
      const contactId = req.params.id;
      const updatedContact = await Contact.findByIdAndUpdate(
        contactId,
        { $inc: { view: 1 } }, // Increment view count by 1
        { new: true } // Return updated document
      );

      if (!updatedContact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found'
        });
      }

      res.json({
        success: true,
        message: 'View updated successfully',
        data: updatedContact
      });
    } catch (error) {
      console.error('Error updating view count:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating view count',
        error: error.message
      });
    }
  }
};

module.exports = contactController;