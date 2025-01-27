const ContactUpdate = require('../models/ContactUpdate');

// Get contact updates
const getContactUpdates = async (req, res) => {
    try {
        const updates = await ContactUpdate.find()
            .populate('employeeid', 'name email') // Populate employee details
            .populate('contactid', 'name email phone companyName') // Using correct field name companyName
            .select('employeeid contactid status notes view createdAt')
            .sort('-createdAt');

        res.json({
            success: true,
            message: 'Contact updates retrieved successfully',
            data: updates
        });
    } catch (error) {
        console.error('Error fetching contact updates:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact updates',
            error: error.message
        });
    }
};

// Update view count
const updateView = async (req, res) => {
    try {
        const { id } = req.params;
        const update = await ContactUpdate.findByIdAndUpdate(
            id,
            { $inc: { view: 1 } },
            { new: true }
        );

        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Contact update not found'
            });
        }

        res.json({
            success: true,
            message: 'View count updated successfully',
            data: update
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating view count',
            error: error.message
        });
    }
};

// Create new contact update
const createContactUpdate = async (req, res) => {
    try {
        // Validate required fields
        const { employeeid, contactid, status, notes } = req.body;
        if (!employeeid || !contactid || !status || !notes) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields. Please provide employeeid, contactid, status, and notes.'
            });
        }

        const newUpdate = new ContactUpdate({
            employeeid,
            contactid, 
            status,
            notes
        });
        
        const savedUpdate = await newUpdate.save();

        // Fetch the saved update with populated fields
        const populatedUpdate = await ContactUpdate.findById(savedUpdate._id)
            .populate('employeeid', 'name email')
            .populate('contactid', 'name email phone companyname'); // Added companyname to populated fields

        res.status(201).json({ 
            success: true, 
            message: 'Contact update created successfully',
            data: populatedUpdate 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: error.message,
            details: 'Make sure valid ObjectId values are provided for employeeid and contactid'
        });
    }
};

module.exports = {
    getContactUpdates,
    createContactUpdate,
    updateView
};