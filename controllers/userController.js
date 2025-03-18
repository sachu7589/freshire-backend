const User = require('../models/User');
const nodemailer = require('nodemailer');


// Create a new user
const createUser = async (req, res) => {
  const { name, email, phoneNumber } = req.body;
  try {
    const role = 'employee';
    if (!name || !email || !phoneNumber || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Generate password from user details
    const autoPassword = `${name.slice(0,3)}${phoneNumber.slice(-4)}${email.split('@')[0].slice(0,3)}`;
    
    // Create new user with auto-generated password
    const user = new User({ 
      name, 
      email, 
      phoneNumber, 
      role,
      password: autoPassword 
    });
    
    await user.save();
    
    // Return success response with generated password
    // Send email with generated password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'freshireofficial@gmail.com', // Replace with your email
        pass: 'hgro gsei khrw ftbu' // Replace with your app password
      }
    });

    const mailOptions = {
      from: 'sachu7589@gmail.com',
      to: user.email,
      subject: 'Welcome to FreshHire - Your Account Details',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0066cc; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Welcome to FreshHire</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin-top: 20px;">
            <h2 style="color: #0066cc;">Hello ${user.name},</h2>
            
            <p style="font-size: 16px; line-height: 1.5;">
              Your account has been created successfully! Below are your login credentials:
            </p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #333;">
                <strong>Your Generated Password:</strong> ${autoPassword}
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5; color: #ff4444;">
              For security reasons, please login and change your password immediately.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="margin: 0;">Best regards,</p>
              <p style="margin: 5px 0; color: #0066cc; font-weight: bold;">FreshHire Team</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      message: 'User created successfully and login credentials sent to email', 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: `Welcome ${user.role}: ${user.name}`, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update employee status
const updateEmployeeStatus = async (req, res) => {
  const { employeeId } = req.params;
  const { status } = req.body;

  try {
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.status = status;
    await employee.save();

    res.status(200).json({ message: 'Employee status updated successfully', employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { createUser, loginUser, getEmployees ,updateEmployeeStatus};
