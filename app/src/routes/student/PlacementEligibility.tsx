import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Award, Calculator, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface SemesterSGPA {
  semester: number;
  sgpa: number | null;
}

interface Criterion {
  label: string;
  required: string;
  actual: string;
  status: 'met' | 'not-met';
}

const PlacementEligibility: React.FC = () => {
  const { user } = useAuth();
  const [targetCGPA, setTargetCGPA] = useState<string>('8.5');
  const [currentCGPA, setCurrentCGPA] = useState<string>('');
  const [semesterSGPAs, setSemesterSGPAs] = useState<SemesterSGPA[]>(
    Array.from({ length: 8 }, (_, i) => ({ semester: i + 1, sgpa: null }))
  );
  // CGPA to GPA converter states
  const [cgpaInput, setCgpaInput] = useState<string>('');
  const [gpaScale, setGpaScale] = useState<'4' | '5'>('4');

  // Define calculateCGPA function before it's used
  const calculateCGPA = () => {
    const validSGPAs = semesterSGPAs.filter(s => s.sgpa !== null);
    if (validSGPAs.length === 0) return 0;
    return Number((validSGPAs.reduce((acc, curr) => acc + (curr.sgpa || 0), 0) / validSGPAs.length).toFixed(2));
  };

  const completedSemesters = semesterSGPAs.filter(s => s.sgpa !== null).length;
  const totalSemesters = 8;
  const remainingSemesters = totalSemesters - completedSemesters;

  const tierThresholds = { tier1: 8.5, tier2: 6.5 };
  
  const cgpaValue = parseFloat(currentCGPA) || 0;
  const calculatedCGPA = calculateCGPA();
  const displayCGPA = currentCGPA ? cgpaValue : calculatedCGPA;

  const criteria: Criterion[] = [
    { label: 'Minimum CGPA', required: '6.5', actual: displayCGPA.toFixed(2), status: displayCGPA >= 6.5 ? 'met' : 'not-met' },
    { label: 'No Active Backlogs', required: '0', actual: '0', status: 'met' },
    { label: 'Attendance', required: '75%', actual: '82%', status: 'met' },
    { label: 'No Disciplinary Actions', required: 'None', actual: 'None', status: 'met' },
  ];

  const tierEligibility = [
    { tier: 'Tier 1', minCGPA: 8.5, companies: 'Google, Microsoft, Amazon, etc.', eligible: displayCGPA >= 8.5 },
    { tier: 'Tier 2', minCGPA: 7.5, companies: 'TCS, Infosys, Wipro, etc.', eligible: displayCGPA >= 7.5 },
    { tier: 'Tier 3', minCGPA: 6.5, companies: 'Various startups & SMEs', eligible: displayCGPA >= 6.5 },
  ];

  // Define calculateRequiredSGPA before it's used
  const calculateRequiredSGPA = () => {
    const target = parseFloat(targetCGPA);
    if (isNaN(target) || remainingSemesters <= 0) return null;
    const totalPointsNeeded = target * totalSemesters;
    const currentPoints = displayCGPA * completedSemesters;
    return (totalPointsNeeded - currentPoints) / remainingSemesters;
  };

  const requiredSGPA = calculateRequiredSGPA();
  const isAchievable = requiredSGPA !== null && requiredSGPA <= 10 && requiredSGPA >= 0;
  const allCriteriaMet = criteria.every(c => c.status === 'met');

  const handleSGPAChange = (semester: number, value: string) => {
    const numValue = parseFloat(value);
    if (value && (isNaN(numValue) || numValue < 0 || numValue > 10)) {
      toast.error('SGPA must be between 0 and 10');
      return;
    }
    const prevSemester = semesterSGPAs[semester - 2];
    if (semester > 1 && prevSemester && prevSemester.sgpa === null && value) {
      toast.error('Please fill previous semester SGPA first');
      return;
    }
    setSemesterSGPAs(prev => prev.map(s => s.semester === semester ? { ...s, sgpa: value ? numValue : null } : s));
  };

  // Progress ring component
  const ProgressRing = ({ value, size = 80, color = 'success' }: { value: number; size?: number; color?: string }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;
    const strokeColor = color === 'success' ? '#10b981' : color === 'warning' ? '#f59e0b' : '#ef4444';
    
    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} 
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
      </svg>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Placement Section</h1>
        <p className="mt-1 text-sm text-slate-500">Check your eligibility for campus placements.</p>
      </div>

      {/* Overall Status */}
      <div className={`mb-6 p-5 rounded-lg border flex items-start gap-4 ${allCriteriaMet ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        {allCriteriaMet ? <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />}
        <div>
          <h2 className={`text-base font-semibold ${allCriteriaMet ? 'text-emerald-800' : 'text-amber-800'}`}>
            {allCriteriaMet ? 'You are eligible for campus placements' : 'Some criteria not met'}
          </h2>
          <p className={`text-sm mt-1 ${allCriteriaMet ? 'text-emerald-700' : 'text-amber-700'}`}>
            {allCriteriaMet ? 'You meet all the requirements for participating in campus placements.' : 'Please check the criteria below and take necessary actions.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eligibility Criteria */}
        <section className="lg:col-span-2 card">
          <div className="card-header">
            <h2 className="text-base font-semibold text-slate-800">Eligibility Criteria</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {criteria.map((criterion, index) => (
              <div key={index} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {criterion.status === 'met' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                  <div>
                    <p className="text-sm font-medium text-slate-800">{criterion.label}</p>
                    <p className="text-xs text-slate-500">Required: {criterion.required}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${criterion.status === 'met' ? 'text-emerald-500' : 'text-red-500'}`}>{criterion.actual}</p>
                  <p className={`text-xs ${criterion.status === 'met' ? 'text-emerald-500' : 'text-red-500'}`}>{criterion.status === 'met' ? 'Criteria Met' : 'Not Met'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <section className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="w-5 h-5 text-blue-500" />
              <h2 className="text-base font-semibold text-slate-800">CGPA to GPA Converter</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="cgpaInput" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Enter CGPA (Scale 10)
                </label>
                <input
                  id="cgpaInput"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={cgpaInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = parseFloat(value);
                    if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 10)) {
                      setCgpaInput(value);
                    }
                  }}
                  placeholder="e.g., 9.47"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              
              <div>
                <label htmlFor="gpaScale" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Convert to Scale
                </label>
                <select
                  id="gpaScale"
                  value={gpaScale}
                  onChange={(e) => setGpaScale(e.target.value as '4' | '5')}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="4">Scale 4.0</option>
                  <option value="5">Scale 5.0</option>
                </select>
              </div>

              {cgpaInput && parseFloat(cgpaInput) > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">CGPA (Scale 10)</p>
                      <p className="text-2xl font-bold text-slate-800">{parseFloat(cgpaInput).toFixed(2)}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600 mb-1">GPA (Scale {gpaScale}.0)</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {((parseFloat(cgpaInput) / 10) * parseFloat(gpaScale)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-slate-600">
                      Formula: GPA = (CGPA ÷ 10) × {gpaScale}.0
                    </p>
                  </div>
                </div>
              )}

              {cgpaInput && parseFloat(cgpaInput) > 0 && (
                <button
                  onClick={() => {
                    setCurrentCGPA(cgpaInput);
                    toast.success('CGPA updated!');
                  }}
                  className="w-full py-2 px-4 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Use This CGPA
                </button>
              )}
            </div>
          </section>

          <section className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="w-5 h-5 text-blue-500" />
              <h2 className="text-base font-semibold text-slate-800">CGPA Calculator</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="targetCGPA" className="block text-sm font-medium text-slate-700 mb-1.5">Target CGPA</label>
                <input
                  id="targetCGPA"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={targetCGPA}
                  onChange={(e) => setTargetCGPA(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
              {requiredSGPA !== null && (
                <div className={`p-4 rounded-lg border ${isAchievable ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-sm text-slate-700">Required SGPA in remaining semesters:</p>
                  <p className={`text-2xl font-semibold ${isAchievable ? 'text-emerald-700' : 'text-red-700'}`}>{requiredSGPA.toFixed(2)}</p>
                  <p className={`text-xs mt-1 ${isAchievable ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isAchievable ? 'This target is achievable!' : 'This target is not achievable.'}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* SGPA Input Grid */}
      <section className="mt-6 card">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Semester-wise SGPA</h2>
          <p className="text-sm text-slate-500 mt-1">Enter your SGPA for each semester to calculate CGPA</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {semesterSGPAs.map((item) => (
              <div key={item.semester}>
                <label className="block text-xs font-medium text-slate-500 mb-1">Sem {item.semester}</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={item.sgpa !== null ? item.sgpa : ''}
                  onChange={(e) => handleSGPAChange(item.semester, e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 text-center"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-700">Calculated CGPA (from SGPA)</span>
            <span className="text-2xl font-bold text-slate-800">{calculatedCGPA > 0 ? calculatedCGPA.toFixed(2) : '0.00'}</span>
          </div>
          {calculatedCGPA > 0 && !currentCGPA && (
            <button
              onClick={() => setCurrentCGPA(calculatedCGPA.toFixed(2))}
              className="mt-2 w-full py-2 px-4 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Use Calculated CGPA
            </button>
          )}
        </div>
      </section>

      {/* Tier Eligibility */}
      <section className="mt-6 card overflow-hidden">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Company Tier Eligibility</h2>
          <p className="text-sm text-slate-500 mt-1">Based on your current CGPA</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Tier</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Minimum CGPA</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Companies</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Eligibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tierEligibility.map((tier, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 text-sm font-medium text-slate-800">{tier.tier}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{tier.minCGPA}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{tier.companies}</td>
                <td className="px-5 py-4 text-center">
                  {tier.eligible ? (
                    <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Eligible</span>
                  ) : (
                    <span className="badge badge-neutral"><AlertCircle className="w-3 h-3" /> Not Eligible</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PlacementEligibility;
