import React, { useState } from 'react';
import { FileText, X, Search, CheckCircle, Clock, Eye, ZoomIn, ZoomOut, RotateCw, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface RevaluationRequest {
  id: string;
  studentRollNo: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  originalMarks: number;
  status: 'pending' | 'in_progress' | 'completed';
  answerSheetUrl: string;
}

const Revaluation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<RevaluationRequest | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isMarksLocked, setIsMarksLocked] = useState(false);
  
  const [marks, setMarks] = useState({
    q1: Array(6).fill(0),
    q2: Array(6).fill(0),
    q3: Array(3).fill(0)
  });

  const revaluationRequests: RevaluationRequest[] = [
    {
      id: '1',
      studentRollNo: '001',
      studentName: 'John Doe',
      subjectCode: 'CS301',
      subjectName: 'Data Structures',
      originalMarks: 65,
      status: 'pending',
      answerSheetUrl: 'https://qdedvnavsxmmilyeiede.supabase.co/storage/v1/object/sign/templates%20pdf/S.E_CHEMICAL_Sem_IV_-CET-I_-SOUTION_DEC.19.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZW1wbGF0ZXMgcGRmL1MuRV9DSEVNSUNBTF9TZW1fSVZfLUNFVC1JXy1TT1VUSU9OX0RFQy4xOS5wZGYiLCJpYXQiOjE3NDE0MzkzNjAsImV4cCI6MTc3Mjk3NTM2MH0.QBUeQAt2lycPHGsCp1eGf3LSWjCQg_D4bIEGjKoCeW0'
    },
    {
      id: '2',
      studentRollNo: '002',
      studentName: 'Jane Smith',
      subjectCode: 'CS302',
      subjectName: 'Database Systems',
      originalMarks: 72,
      status: 'in_progress',
      answerSheetUrl: 'https://qdedvnavsxmmilyeiede.supabase.co/storage/v1/object/sign/templates%20pdf/S.E_CHEMICAL_Sem_IV_-CET-I_-SOUTION_DEC.19.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZW1wbGF0ZXMgcGRmL1MuRV9DSEVNSUNBTF9TZW1fSVZfLUNFVC1JXy1TT1VUSU9OX0RFQy4xOS5wZGYiLCJpYXQiOjE3NDE0MzkzNjAsImV4cCI6MTc3Mjk3NTM2MH0.QBUeQAt2lycPHGsCp1eGf3LSWjCQg_D4bIEGjKoCeW0'
    },
    {
      id: '3',
      studentRollNo: '003',
      studentName: 'Bob Johnson',
      subjectCode: 'CS303',
      subjectName: 'Computer Networks',
      originalMarks: 58,
      status: 'completed',
      answerSheetUrl: 'https://qdedvnavsxmmilyeiede.supabase.co/storage/v1/object/sign/templates%20pdf/S.E_CHEMICAL_Sem_IV_-CET-I_-SOUTION_DEC.19.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZW1wbGF0ZXMgcGRmL1MuRV9DSEVNSUNBTF9TZW1fSVZfLUNFVC1JXy1TT1VUSU9OX0RFQy4xOS5wZGYiLCJpYXQiOjE3NDE0MzkzNjAsImV4cCI6MTc3Mjk3NTM2MH0.QBUeQAt2lycPHGsCp1eGf3LSWjCQg_D4bIEGjKoCeW0'
    },
  ];

  const filteredRequests = revaluationRequests.filter(req =>
    req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.studentRollNo.includes(searchQuery) ||
    req.subjectCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total marks for each question (best 4 out of 6 for Q1/Q2, best 2 out of 3 for Q3)
  const calculateQuestionTotal = (question: 'q1' | 'q2' | 'q3') => {
    const marksArray = marks[question];
    const sortedMarks = [...marksArray].sort((a, b) => b - a);
    
    if (question === 'q3') {
      // For Q3, take top 2 out of 3
      return sortedMarks.slice(0, 2).reduce((sum, mark) => sum + mark, 0);
    } else {
      // For Q1 and Q2, take top 4 out of 6
      return sortedMarks.slice(0, 4).reduce((sum, mark) => sum + mark, 0);
    }
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    return calculateQuestionTotal('q1') + calculateQuestionTotal('q2') + calculateQuestionTotal('q3');
  };

  const handleMarksChange = (question: 'q1' | 'q2' | 'q3', index: number, value: number) => {
    const maxValue = question === 'q3' ? 10 : 5;
    const validatedValue = Math.min(Math.max(0, value), maxValue);

    setMarks(prev => ({
      ...prev,
      [question]: prev[question].map((mark, i) => i === index ? validatedValue : mark)
    }));
  };

  const handleEvaluate = (request: RevaluationRequest) => {
    setSelectedRequest(request);
    setMarks({
      q1: Array(6).fill(0),
      q2: Array(6).fill(0),
      q3: Array(3).fill(0)
    });
    setIsMarksLocked(false);
    setScale(1);
    setRotation(0);
    setShowEvaluationModal(true);
  };

  const handleSubmitRevaluation = () => {
    const q1Total = calculateQuestionTotal('q1');
    const q2Total = calculateQuestionTotal('q2');
    const q3Total = calculateQuestionTotal('q3');

    if (q1Total > 20 || q2Total > 20 || q3Total > 20) {
      toast.error('Marks exceed maximum limit');
      return;
    }

    const newTotal = calculateGrandTotal();
    const difference = newTotal - (selectedRequest?.originalMarks || 0);
    
    toast.success(`Revaluation completed. New marks: ${newTotal} (${difference > 0 ? '+' : ''}${difference})`);
    setShowEvaluationModal(false);
  };

  const getStatusBadge = (status: RevaluationRequest['status']) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning"><Clock className="w-3 h-3" /> Pending</span>;
      case 'in_progress':
        return <span className="badge badge-info"><Clock className="w-3 h-3" /> In Progress</span>;
      case 'completed':
        return <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Completed</span>;
    }
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
      {/* Page Title */}
      <div className="mb-6 hidden sm:block">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Revaluation</h1>
        <p className="mt-1 text-sm text-slate-500">Review and re-evaluate student answer sheets for revaluation requests.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm text-slate-500 mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-slate-800">{revaluationRequests.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{revaluationRequests.filter(r => r.status === 'pending').length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{revaluationRequests.filter(r => r.status === 'in_progress').length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-emerald-600">{revaluationRequests.filter(r => r.status === 'completed').length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll no, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
      </div>

      {/* Revaluation Requests Table */}
      <section className="card overflow-hidden">
        <div className="card-header">
          <h2 className="text-base font-semibold text-slate-800">Revaluation Requests</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Roll No</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Student Name</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-5 py-3">Subject</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Original Marks</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Status</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4 font-mono text-sm text-slate-600">{request.studentRollNo}</td>
                <td className="px-5 py-4 text-sm font-medium text-slate-800">{request.studentName}</td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  <div>
                    <p className="font-medium">{request.subjectName}</p>
                    <p className="text-xs text-slate-500">{request.subjectCode}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600 text-center font-semibold">{request.originalMarks}</td>
                <td className="px-5 py-4 text-center">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => handleEvaluate(request)}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 mx-auto"
                  >
                    <Eye className="w-4 h-4" />
                    Evaluate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Revaluation Evaluation Modal */}
      {showEvaluationModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full h-[95vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-600" />
                  Revaluation - {selectedRequest.studentName}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedRequest.subjectCode} • Roll No: {selectedRequest.studentRollNo} • Original: {selectedRequest.originalMarks} marks
                </p>
              </div>
              <button
                onClick={() => setShowEvaluationModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                {/* PDF Viewer - Left Side */}
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-slate-800">Answer Sheet</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleZoomOut}
                        className="p-1.5 rounded-lg hover:bg-white transition-colors"
                        aria-label="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={handleZoomIn}
                        className="p-1.5 rounded-lg hover:bg-white transition-colors"
                        aria-label="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={handleRotate}
                        className="p-1.5 rounded-lg hover:bg-white transition-colors"
                        aria-label="Rotate"
                      >
                        <RotateCw className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-lg overflow-hidden">
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      <iframe
                        src={selectedRequest.answerSheetUrl}
                        className="rounded-lg transition-transform duration-200"
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          transform: `scale(${scale})`
                        }}
                        title="Answer Sheet Preview"
                      />
                    </div>
                  </div>
                </div>

                {/* Marks Entry - Right Side */}
                <div className="space-y-4 overflow-y-auto">
                  <h3 className="text-base font-semibold text-slate-800">Marks Entry</h3>
                  <div className="space-y-4">
                    {/* Question 1 */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-semibold text-slate-700">Question 1 (Any 4 out of 6)</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Total:</span>
                          <span className="text-sm font-bold text-blue-600">
                            {calculateQuestionTotal('q1')}/20
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {marks.q1.map((mark, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 w-12">Q1.{index + 1}</span>
                            <input
                              type="number"
                              min="0"
                              max="5"
                              step="0.5"
                              value={mark || ''}
                              onChange={(e) => handleMarksChange('q1', index, Number(e.target.value) || 0)}
                              disabled={isMarksLocked}
                              className="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
                              placeholder="0"
                            />
                            <span className="text-xs text-slate-400 w-8">/5</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Question 2 */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-semibold text-slate-700">Question 2 (Any 4 out of 6)</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Total:</span>
                          <span className="text-sm font-bold text-blue-600">
                            {calculateQuestionTotal('q2')}/20
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {marks.q2.map((mark, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 w-12">Q2.{index + 1}</span>
                            <input
                              type="number"
                              min="0"
                              max="5"
                              step="0.5"
                              value={mark || ''}
                              onChange={(e) => handleMarksChange('q2', index, Number(e.target.value) || 0)}
                              disabled={isMarksLocked}
                              className="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
                              placeholder="0"
                            />
                            <span className="text-xs text-slate-400 w-8">/5</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Question 3 */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-semibold text-slate-700">Question 3 (Any 2 out of 3)</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Total:</span>
                          <span className="text-sm font-bold text-blue-600">
                            {calculateQuestionTotal('q3')}/20
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {marks.q3.map((mark, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 w-12">Q3.{index + 1}</span>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={mark || ''}
                              onChange={(e) => handleMarksChange('q3', index, Number(e.target.value) || 0)}
                              disabled={isMarksLocked}
                              className="flex-1 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
                              placeholder="0"
                            />
                            <span className="text-xs text-slate-400 w-8">/10</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-semibold text-blue-700">Grand Total</h4>
                          <p className="text-xs text-blue-600 mt-0.5">
                            Original: {selectedRequest.originalMarks} • Difference: 
                            <span className={`font-semibold ${calculateGrandTotal() > selectedRequest.originalMarks ? 'text-emerald-600' : calculateGrandTotal() < selectedRequest.originalMarks ? 'text-red-600' : 'text-blue-600'}`}>
                              {calculateGrandTotal() > selectedRequest.originalMarks ? ' +' : ' '}
                              {calculateGrandTotal() - selectedRequest.originalMarks}
                            </span>
                          </p>
                        </div>
                        <span className="text-2xl font-bold text-blue-700">
                          {calculateGrandTotal()}/60
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-slate-200">
                    <button
                      onClick={handleSubmitRevaluation}
                      disabled={isMarksLocked}
                      className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Revaluation
                    </button>
                    {isMarksLocked && (
                      <button
                        disabled
                        className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Locked
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revaluation;
