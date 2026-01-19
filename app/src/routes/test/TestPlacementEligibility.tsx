import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Award, Calculator } from 'lucide-react';
import TestLayout from '../../components/test/TestLayout';
import { useAuth } from '../../context/AuthContext';
import { ProgressRing } from '../../components/test/Progress';
import { SkeletonCard, SkeletonTable } from '../../components/test/Skeleton';

const TestPlacementEligibility: React.FC = () => {
  const { user } = useAuth();
  const [targetCGPA, setTargetCGPA] = useState<string>('8.5');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const currentCGPA = user?.cgpa || 8.65;
  const completedSemesters = 5;
  const totalSemesters = 8;
  const remainingSemesters = totalSemesters - completedSemesters;

  const criteria = [
    { label: 'Minimum CGPA', required: '6.5', actual: currentCGPA.toFixed(2), status: currentCGPA >= 6.5 ? 'met' : 'not-met' },
    { label: 'No Active Backlogs', required: '0', actual: '0', status: 'met' },
    { label: 'Attendance', required: '75%', actual: '82%', status: 'met' },
    { label: 'No Disciplinary Actions', required: 'None', actual: 'None', status: 'met' },
  ];

  const tierEligibility = [
    { tier: 'Tier 1', minCGPA: 8.5, companies: 'Google, Microsoft, Amazon, etc.', eligible: currentCGPA >= 8.5 },
    { tier: 'Tier 2', minCGPA: 7.5, companies: 'TCS, Infosys, Wipro, etc.', eligible: currentCGPA >= 7.5 },
    { tier: 'Tier 3', minCGPA: 6.5, companies: 'Various startups & SMEs', eligible: currentCGPA >= 6.5 },
  ];

  const calculateRequiredSGPA = () => {
    const target = parseFloat(targetCGPA);
    if (isNaN(target) || remainingSemesters <= 0) return null;
    const totalPointsNeeded = target * totalSemesters;
    const currentPoints = currentCGPA * completedSemesters;
    const pointsNeeded = totalPointsNeeded - currentPoints;
    return pointsNeeded / remainingSemesters;
  };

  const requiredSGPA = calculateRequiredSGPA();
  const isAchievable = requiredSGPA !== null && requiredSGPA <= 10 && requiredSGPA >= 0;
  const allCriteriaMet = criteria.every(c => c.status === 'met');

  if (loading) {
    return (
      <TestLayout title="Placement Eligibility" subtitle="Check your eligibility for campus placements.">
        <SkeletonCard />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><SkeletonCard /></div>
          <SkeletonCard />
        </div>
        <div className="mt-6"><SkeletonTable rows={3} cols={4} /></div>
      </TestLayout>
    );
  }

  return (
    <TestLayout title="Placement Eligibility" subtitle="Check your eligibility for campus placements.">
      <div className={`mb-6 p-5 rounded-lg border flex items-start gap-4 ${allCriteriaMet ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        {allCriteriaMet ? (
          <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
        )}
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

        <div className="space-y-6">
          <section className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-semibold text-slate-800">Your Profile</h2>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Current CGPA</p>
                  <p className="text-3xl font-semibold text-slate-800">{currentCGPA.toFixed(2)}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Completed</p>
                    <p className="text-lg font-semibold text-slate-800">{completedSemesters} Sem</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Remaining</p>
                    <p className="text-lg font-semibold text-slate-800">{remainingSemesters} Sem</p>
                  </div>
                </div>
              </div>
              <ProgressRing value={currentCGPA * 10} size={80} strokeWidth={8} color={currentCGPA >= 8 ? 'success' : currentCGPA >= 7 ? 'warning' : 'error'} />
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
    </TestLayout>
  );
};

export default TestPlacementEligibility;
