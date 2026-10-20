export const classes = ['3-5 Years', '6-8 Years', '9-12 Years'] as const;
export type AgeClass = typeof classes[number];
export const tribes = ['Reuben','Simeon','Levi','Judah','Dan','Naphtali','Gad','Asher','Issachar','Zebulun','Joseph','Benjamin'] as const;
export type Tribe = typeof tribes[number];
export type Child = { id: string; code: string; name: string; parentName: string | null; family: Tribe | null; dob: string | null; phone: string | null; className: AgeClass; registered: string };
export type Attendance = { id: string; childId: string; date: string; week: number; service: number; checkedInAt: string };
export const initials = (name: string) => name.split(' ').map(x => x[0]).slice(0,2).join('');
export const prettyDate = (date: string | null) => date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : '—';
export const prettyTime = (iso: string) => new Date(iso).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
export const monthName = (month: string) => new Date(`${month}-01T12:00:00`).toLocaleDateString('en-GB',{month:'long',year:'numeric'});
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const weekOfMonth = (date: string) => Math.min(5, Math.ceil(Number(date.slice(-2)) / 7));
export function exportCsv(filename: string, rows: (string | number | null)[][]) {
 const csv = rows.map(row => row.map(v => { const s=String(v ?? ''); return `"${(/^[=+@\-]/.test(s) ? "'" : '') + s.replaceAll('"','""')}"`; }).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}));
 const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}
