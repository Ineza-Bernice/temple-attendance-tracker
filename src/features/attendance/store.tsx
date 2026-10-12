import { createContext, useContext, useState, type ReactNode } from 'react';
import { demoChildren, demoAttendance, type Child, type Attendance } from './data';
type Store = { children: Child[]; attendance: Attendance[]; month: string; setMonth: (v:string)=>void; addChild:(c:Omit<Child,'id'>)=>Child; checkIn:(a:Omit<Attendance,'id'>)=>boolean };
const AttendanceContext = createContext<Store | null>(null);
export function AttendanceProvider({children: content}:{children:ReactNode}) {
 const [children,setChildren]=useState(demoChildren);
 const [attendance,setAttendance]=useState(demoAttendance);
 const [month,setMonth]=useState('2026-10');
 function addChild(c:Omit<Child,'id'>) {
  const child={...c,id:`MG-${String(children.length+1).padStart(3,'0')}`}; setChildren(prev=>[child,...prev]); return child;
 }
 function checkIn(a:Omit<Attendance,'id'>) {
  if(attendance.some(r=>r.childId===a.childId && r.date===a.date && r.service===a.service)) return false;
  setAttendance(prev=>[...prev,{...a,id:crypto.randomUUID()}]); return true;
 }
 return <AttendanceContext.Provider value={{children,attendance,month,setMonth,addChild,checkIn}}>{content}</AttendanceContext.Provider>;
}
export function useAttendance() { const value=useContext(AttendanceContext); if(!value) throw new Error('AttendanceProvider is required'); return value; }
