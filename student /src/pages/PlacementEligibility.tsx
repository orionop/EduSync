import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import StudentSidebar from '../components/StudentSidebar';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';

interface SemesterSGPA {
  semester: number;
  sgpa: number | null;
}

const PlacementEligibility: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<'tier1' | 'tier2' | ''>('');
  const [semesterSGPAs, setSemesterSGPAs] = useState<SemesterSGPA[]>(
    Array.from({ length: 8 }, (_, i) => ({ semester: i + 1, sgpa: null }))
  );
  const [requiredSGPA, setRequiredSGPA] = useState<number | null>(null);
  const [isEligible, setIsEligible] = useState<boolean>(false);

  const tierThresholds = {
    tier1: 8.5,
    tier2: 6.5
  };

  const calculateCGPA = () => {
    const validSGPAs = semesterSGPAs.filter(s => s.sgpa !== null);
    if (validSGPAs.length === 0) return 0;
    
    const sum = validSGPAs.reduce((acc, curr) => acc + (curr.sgpa || 0), 0);
    return Number((sum / validSGPAs.length).toFixed(2));
  };

  const calculateRequiredSGPA = () => {
    if (!selectedTier) return null;

    const targetCGPA = tierThresholds[selectedTier];
    const filledSemesters = semesterSGPAs.filter(s => s.sgpa !== null).length;
    const remainingSemesters = 8 - filledSemesters;
    
    if (remainingSemesters === 0) {
      const currentCGPA = calculateCGPA();
      setIsEligible(currentCGPA >= targetCGPA);
      return null;
    }

    const currentTotal = semesterSGPAs.reduce((acc, curr) => acc + (curr.sgpa || 0), 0);
    const requiredTotal = targetCGPA * 8;
    const remainingTotal = requiredTotal - currentTotal;
    
    const requiredForRemaining = remainingTotal / remainingSemesters;
    return Number(requiredForRemaining.toFixed(2));
  };

  useEffect(() => {
    const required = calculateRequiredSGPA();
    setRequiredSGPA(required);
  }, [selectedTier, semesterSGPAs]);

  const handleSGPAChange = (semester: number, value: string) => {
    const numValue = parseFloat(value);
    
    // Validate input
    if (value && (isNaN(numValue) || numValue < 0 || numValue > 10)) {
      toast.error('SGPA must be between 0 and 10');
      return;
    }

    // Check if previous semesters are filled
    const prevSemester = semesterSGPAs[semester - 2];
    if (semester > 1 && prevSemester && prevSemester.sgpa === null && value) {
      toast.error('Please fill previous semester SGPA first');
      return;
    }

    setSemesterSGPAs(prev => 
      prev.map(s => 
        s.semester === semester 
          ? { ...s, sgpa: value ? numValue : null }
          : s
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Placement Eligibility</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Goal Setting Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                Set your Placement Goals!
              </h2>
              
              <div className="max-w-md mx-auto">
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value as 'tier1' | 'tier2' | '')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4"
                >
                  <option value="">Select your goal</option>
                  <option value="tier1">Tier 1</option>
                  <option value="tier2">Tier 2</option>
                </select>

                {selectedTier && (
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                      Target CGPA for {selectedTier === 'tier1' ? 'Tier 1' : 'Tier 2'}:
                    </p>
                    <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                      {tierThresholds[selectedTier]}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SGPA Input Section */}
            {selectedTier && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Enter Your Semester SGPAs
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {semesterSGPAs.map((sem) => (
                    <div key={sem.semester} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Semester {sem.semester}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={sem.sgpa === null ? '' : sem.sgpa}
                        onChange={(e) => handleSGPAChange(sem.semester, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter SGPA"
                      />
                    </div>
                  ))}
                </div>

                {/* Results Section */}
                <div className="mt-8 space-y-6">
                  {/* Per-semester Status */}
                  {semesterSGPAs.filter(sem => sem.sgpa !== null).length > 0 && (
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Semester-wise Progress
                      </h4>
                      <div className="space-y-4">
                        {semesterSGPAs.filter(sem => sem.sgpa !== null).map((sem) => {
                          const semestersCounted = semesterSGPAs
                            .slice(0, sem.semester)
                            .filter(s => s.sgpa !== null);
                          const currentCGPA = semestersCounted.reduce((acc, curr) => acc + (curr.sgpa || 0), 0) / semestersCounted.length;
                          const isCurrentlyEligible = currentCGPA >= (selectedTier ? tierThresholds[selectedTier] : 0);

                          return (
                            <div key={sem.semester} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Semester {sem.semester}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  SGPA: {sem.sgpa} | CGPA: {currentCGPA.toFixed(2)}
                                </p>
                              </div>
                              <div className={`flex items-center ${
                                isCurrentlyEligible ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {isCurrentlyEligible ? (
                                  <>
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    <span>Eligible</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="h-5 w-5 mr-2" />
                                    <span>Not Eligible</span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Overall Status */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-center">
                      {selectedTier && (
                        <div>
                          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                            Current CGPA: {calculateCGPA()}
                          </p>
                          {requiredSGPA !== null && (
                            <>
                              <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                                To meet your goal, you need to maintain an SGPA of:
                              </p>
                              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {requiredSGPA}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                in your remaining semesters
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlacementEligibility; 