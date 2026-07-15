/**
 * Calculate performance score for a student
 * Formula: (Attendance × 0.4) + (Punctuality × 0.3) + (Early Arrival × 0.2) + (Participation × 0.1)
 */

export interface StudentPerformanceMetrics {
  attendancePercentage: number; // 0-100 (40% weight)
  punctualityScore: number; // 0-100 (30% weight)
  earlyArrivalBonus: number; // 0-100 (20% weight)
  participationScore: number; // 0-100 (10% weight)
  overallScore: number; // Final weighted score (0-100)
}

/**
 * Calculate attendance percentage
 */
export function calculateAttendancePercentage(attended: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((attended / total) * 100);
}

/**
 * Calculate punctuality score
 * Based on late arrivals
 */
export function calculatePunctualityScore(lateArrivals: number, totalAttended: number): number {
  if (totalAttended === 0) return 100;
  const onTimeCount = totalAttended - lateArrivals;
  return Math.max(0, Math.round((onTimeCount / totalAttended) * 100));
}

/**
 * Calculate early arrival bonus
 */
export function calculateEarlyArrivalBonus(earlyArrivals: number, totalAttended: number): number {
  if (totalAttended === 0) return 0;
  return Math.min(100, Math.round((earlyArrivals / totalAttended) * 100));
}

/**
 * Calculate overall performance score
 */
export function calculateOverallScore(metrics: Omit<StudentPerformanceMetrics, 'overallScore'>): number {
  const score =
    metrics.attendancePercentage * 0.4 +
    metrics.punctualityScore * 0.3 +
    metrics.earlyArrivalBonus * 0.2 +
    metrics.participationScore * 0.1;

  return Math.min(Math.max(Math.round(score), 0), 100);
}

/**
 * Get performance rating and grade contribution
 */
export function getPerformanceRating(score: number): {
  rating: 'Excellent' | 'Good' | 'Average' | 'Poor';
  color: string;
  gradePoints: number;
} {
  if (score >= 90) {
    return { rating: 'Excellent', color: 'text-green-500', gradePoints: 10 };
  } else if (score >= 80) {
    return { rating: 'Good', color: 'text-blue-500', gradePoints: 8 };
  } else if (score >= 70) {
    return { rating: 'Average', color: 'text-yellow-500', gradePoints: 6 };
  } else {
    return { rating: 'Poor', color: 'text-red-500', gradePoints: 4 };
  }
}

/**
 * Determine class based on index number
 */
export function getClassFromIndexNumber(indexNumber: string): string {
  const lastFourDigits = parseInt(indexNumber.slice(-4));
  const classIndex = Math.floor(lastFourDigits / 100);
  return String.fromCharCode(65 + classIndex); // A=65, B=66, etc.
}

/**
 * Rank students based on overall score
 */
export function rankStudents(
  students: Array<{ id: string; overallScore: number }>
): Array<{ id: string; overallScore: number; rank: number }> {
  return students
    .sort((a, b) => b.overallScore - a.overallScore)
    .map((student, index) => ({
      ...student,
      rank: index + 1,
    }));
}
