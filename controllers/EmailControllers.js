const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
  const { recipientEmail, subject, body, senderName, senderDesignation } =
    req.body;

  try {
    // Input validation
    if (
      !recipientEmail ||
      !subject ||
      !body ||
      !senderName ||
      !senderDesignation
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "freshireofficial@gmail.com",
        pass: "hgro gsei khrw ftbu",
      },
    });

    // Configure email options with HTML template
    const mailOptions = {
      from: "freshireofficial@gmail.com",
      to: recipientEmail,
      subject: subject,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; width: 100%; margin: 0 auto; background-color: #ffffff;">
          <div style="padding: 40px; background-color: #ffffff;">
            <div style="color: #2c3e50; line-height: 1.8; font-size: 16px; background: #f8f9fa; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              ${body.split('\n').map(paragraph => `<p style="margin-bottom: 16px;">${paragraph}</p>`).join('')}
            </div>

            <div style="margin-top: 50px; padding: 30px; border-radius: 12px; background: #f8f9fa;">
              <p style="margin: 0; color: #666666; font-size: 15px;">Best regards,</p>
              <p style="margin: 10px 0; font-size: 18px; font-weight: 600; color: #2c3e50;">${senderName}</p>
              <p style="margin: 0; color: #666666; font-size: 15px;">${senderDesignation}</p>
              
              <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e1e8ed;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <p style="margin: 0; font-size: 16px; color: #0066cc; font-weight: 500;">FreshHire</p>
                  </div>
                  <div style="text-align: right;">
                    <p style="margin: 0; color: #666666; font-size: 14px;">Connect with us</p>
                    <div style="margin-top: 8px;">
                      <a href="#" style="color: #0066cc; text-decoration: none; margin: 0 8px;">LinkedIn</a>
                      <a href="#" style="color: #0066cc; text-decoration: none; margin: 0 8px;">Instagram</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">© 2024 FreshHire. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};

module.exports = {
  sendEmail,
};
