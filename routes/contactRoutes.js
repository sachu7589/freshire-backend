const express = require('express');
const router = express.Router();
const multer = require('multer');
const contactController = require('../controllers/contactController');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.xlsx');
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      file.mimetype === 'application/vnd.ms-excel') {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
});

// Routes
router.post('/upload/:employeeId', upload.single('file'), contactController.uploadExcel);
router.get('/employee/:employeeId', contactController.getContactsByEmployee);
router.delete('/:id', contactController.deleteContact);
router.patch('/:id/view', contactController.updateView);
router.get('/', contactController.getAllContacts);

module.exports = router;