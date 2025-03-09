import { create } from 'zustand';

interface ExamState {
  selectedFaculty: string[];
  setSelectedFaculty: (faculty: string[]) => void;
  examSchedule: any[];
  setExamSchedule: (schedule: any[]) => void;
  dutyAllocation: any[];
  setDutyAllocation: (duties: any[]) => void;
}

export const useExamStore = create<ExamState>((set) => ({
  selectedFaculty: [],
  setSelectedFaculty: (faculty) => set({ selectedFaculty: faculty }),
  examSchedule: [],
  setExamSchedule: (schedule) => set({ examSchedule: schedule }),
  dutyAllocation: [],
  setDutyAllocation: (duties) => set({ dutyAllocation: duties }),
}));