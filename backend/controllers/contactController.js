import Contact from '../models/Contact.js';

// @desc    Submit a new contact/access request
// @route   POST /api/contact
// @access  Public
export const submitContactRequest = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const contactRequest = await Contact.create({
            name,
            email,
            message
        });

        res.status(201).json({
            message: 'Clearance request submitted successfully. An administrator will review your justification.',
            data: contactRequest
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all contact requests
// @route   GET /api/contact
// @access  Private/Admin
export const getContactRequests = async (req, res) => {
    try {
        const requests = await Contact.find({}).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update contact request status
// @route   PATCH /api/contact/:id
// @access  Private/Admin
export const updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findById(req.params.id);

        if (contact) {
            contact.status = status || contact.status;
            const updatedContact = await contact.save();
            res.json(updatedContact);
        } else {
            res.status(404).json({ message: 'Contact request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete contact request
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactRequest = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (contact) {
            await contact.deleteOne();
            res.json({ message: 'Contact request removed' });
        } else {
            res.status(404).json({ message: 'Contact request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
