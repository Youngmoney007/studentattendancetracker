/**
 * Utility functions
 */

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString();
}

export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString();
}

export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end };
}

export function getClassNameFromIndex(indexNumber: string): string {
  const lastFourDigits = parseInt(indexNumber.slice(-4));
  const classIndex = Math.floor(lastFourDigits / 100);
  return `Class ${String.fromCharCode(65 + classIndex)}`;
}
