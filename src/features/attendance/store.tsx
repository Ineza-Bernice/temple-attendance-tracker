import { createContext, useContext, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { type Child, type Attendance, type AgeClass, type Tribe, today } from './data';
import { useMe, type Me } from './auth';

type NewChild = { name: string; parentName: string; family: Tribe | null; dob: string | null; phone: string | null; className: AgeClass; registered: string };
type Store = { me: Me; children: Child[]; attendance: Attendance[]; month: string; setMonth: (v: string) => void; addChild: (c: NewChild) => Promise<Child>; checkIn: (a: Omit<Attendance, 'id' | 'checkedInAt'>) => Promise<'ok' | 'duplicate'> };
const AttendanceContext = createContext<Store | null>(null);

const toChild = (r: any): Child => ({ id: r.id, code: r.code, name: r.full_name, parentName: r.parent_name, family: r.family, dob: r.dob, phone: r.phone, className: r.class_name, registered: r.registered_on });
const toAttendance = (r: any): Attendance => ({ id: r.id, childId: r.child_id, date: r.service_date, week: r.week, service: r.service, checkedInAt: r.checked_in_at });

async function fetchAll<T>(table: 'children' | 'attendance', order: string, map: (r: any) => T): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(table).select('*').order(order, { ascending: false }).range(from, from + 999);
    if (error) throw error;
    out.push(...(data ?? []).map(map));
    if (!data || data.length < 1000) return out;
  }
}

export function AttendanceProvider({ children: content }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [month, setMonth] = useState(today().slice(0, 7));
  const me = useMe();
  const kids = useQuery({ queryKey: ['children'], queryFn: () => fetchAll('children', 'created_at', toChild) });
  const att = useQuery({ queryKey: ['attendance'], queryFn: () => fetchAll('attendance', 'checked_in_at', toAttendance) });
  if (me.isLoading || kids.isLoading || att.isLoading || !me.data) return <div className="p-8 space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (kids.error || att.error) return <div className="p-8 text-sm" role="alert">Records could not be loaded. Please refresh the page.</div>;

  async function addChild(c: NewChild) {
    const { data, error } = await supabase.from('children').insert({ full_name: c.name, parent_name: c.parentName, family: c.family, dob: c.dob, phone: c.phone, class_name: c.className, registered_on: c.registered, created_by: me.data!.id }).select().single();
    if (error) throw error;
    await qc.invalidateQueries({ queryKey: ['children'] });
    return toChild(data);
  }
  async function checkIn(a: Omit<Attendance, 'id' | 'checkedInAt'>) {
    const { error } = await supabase.from('attendance').insert({ child_id: a.childId, service_date: a.date, week: a.week, service: a.service, checked_in_by: me.data!.id });
    if (error) { if (error.code === '23505') return 'duplicate' as const; throw error; }
    await qc.invalidateQueries({ queryKey: ['attendance'] });
    return 'ok' as const;
  }
  return <AttendanceContext.Provider value={{ me: me.data, children: kids.data ?? [], attendance: att.data ?? [], month, setMonth, addChild, checkIn }}>{content}</AttendanceContext.Provider>;
}
export function useAttendance() { const value = useContext(AttendanceContext); if (!value) throw new Error('AttendanceProvider is required'); return value; }
