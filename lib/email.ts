import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'your-password';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export function getPasswordResetEmail(resetLink: string, name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Click the link below to proceed:</p>
      <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>Student Attendance System</p>
    </div>
  `;
}

export function getAttendanceAlertEmail(studentName: string, courseCode: string, message: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Attendance Alert</h2>
      <p>Hello ${studentName},</p>
      <p>${message}</p>
      <p>Course: ${courseCode}</p>
      <p>Please check your dashboard for more details.</p>
      <p>Best regards,<br>Student Attendance System</p>
    </div>
  `;
}

export function getPerformanceNotificationEmail(
  studentName: string,
  score: number,
  ranking: number,
  courseCode: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Performance Update</h2>
      <p>Hello ${studentName},</p>
      <p>Your performance score for ${courseCode} has been updated:</p>
      <ul>
        <li>Overall Score: ${score}/100</li>
        <li>Class Ranking: #${ranking}</li>
      </ul>
      <p>Log in to your dashboard to view detailed analytics.</p>
      <p>Best regards,<br>Student Attendance System</p>
    </div>
  `;
}
