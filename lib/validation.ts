import { z } from 'zod';

// Student authentication schemas
export const StudentLoginSchema = z.object({
  indexNumber: z
    .string()
    .regex(/^522104\d{4}$/, 'Invalid index number format (5221040001-5221040800)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const StudentRegisterSchema = z.object({
  indexNumber: z
    .string()
    .regex(/^522104\d{4}$/, 'Invalid index number format (5221040001-5221040800)'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and numbers'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Lecturer authentication
export const LecturerLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Admin authentication
export const AdminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Password reset
export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and numbers'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Attendance schemas
export const AttendanceCheckInSchema = z.object({
  courseId: z.string().optional(),
  lectureId: z.string().optional(),
  qrCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Course creation
export const CreateCourseSchema = z.object({
  courseCode: z.string().min(3, 'Course code required'),
  courseName: z.string().min(5, 'Course name required'),
  creditHours: z.number().min(1).max(5),
  classes: z.array(z.string()),
  classroom: z.string().optional(),
  geofenceLatitude: z.number().optional(),
  geofenceLogitude: z.number().optional(),
  geofenceRadius: z.number().default(500),
});

// Edit profile
export const EditProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
});

// Settings
export const SettingsSchema = z.object({
  university: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  lectureStartTime: z.string().regex(/^\d{2}:\d{2}$/),
  defaultGeofenceRadius: z.number().min(10).max(10000),
  minimumAttendancePercentage: z.number().min(0).max(100),
});

// Type exports
export type StudentLoginInput = z.infer<typeof StudentLoginSchema>;
export type StudentRegisterInput = z.infer<typeof StudentRegisterSchema>;
export type LecturerLoginInput = z.infer<typeof LecturerLoginSchema>;
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type AttendanceCheckInInput = z.infer<typeof AttendanceCheckInSchema>;
export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
export type EditProfileInput = z.infer<typeof EditProfileSchema>;
export type SettingsInput = z.infer<typeof SettingsSchema>;

// Format validation errors
export function formatValidationError(error: z.ZodError) {
  const formattedErrors: Record<string, string> = {};
  (error as any).errors?.forEach((err: any) => {
    const path = err.path.join('.');
    formattedErrors[path] = err.message;
  });
  return formattedErrors;
}
