/**
 * Calculate Exam Performance Index (EPI) for a student
 */
export const calculateEPI = (
  internal: number,
  midSemester: number,
  termWork: number,
  practicals: number
): number => {
  const totalMarks = internal + midSemester + termWork + practicals;
  const maxMarks = 90; // 20 + 20 + 25 + 25
  return (totalMarks / maxMarks) * 100;
};

/**
 * Generate bell curve data points from EPI scores
 */
export const generateBellCurveData = (epiScores: number[]) => {
  // Calculate mean
  const mean = epiScores.reduce((sum, score) => sum + score, 0) / epiScores.length;

  // Calculate standard deviation
  const variance = epiScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / epiScores.length;
  const stdDev = Math.sqrt(variance);

  // Generate points for the bell curve
  const points = 50; // Number of points to plot
  const range = stdDev * 4; // Cover ±2 standard deviations
  const step = range / points;

  const labels: string[] = [];
  const data: number[] = [];

  for (let i = 0; i <= points; i++) {
    const x = mean - range / 2 + step * i;
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
              Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));

    labels.push(x.toFixed(1));
    data.push(y * epiScores.length * step); // Scale the curve to match the data
  }

  return { labels, data };
}; 