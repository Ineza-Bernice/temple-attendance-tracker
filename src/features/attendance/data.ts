export const classes = ['3-5 Years', '6-8 Years', '9-12 Years'] as const;
export type AgeClass = typeof classes[number];
export type Child = { id: string; name: string; dob: string; phone: string; className: AgeClass; registered: string };
export type Attendance = { id: string; childId: string; date: string; week: number; service: number };
export const demoChildren: Child[] = [
  'Amara Nkosi','Ethan Mokoena','Grace Dlamini','Noah Sithole','Mia Ndlovu','Joshua Khumalo',
  'Olivia Naidoo','Samuel Zulu','Faith Mthembu','Daniel Botha','Hope Molefe','Elijah Dube',
  'Ava Maseko','Isaac Cele','Lethabo Smith','Emma Radebe','Benjamin Nkosi','Leah Daniels',
  'Thando Mokoena','Caleb Ndlovu','Zoe Khumalo','David Naidoo','Sarah Zulu','Luke Mthembu',
  'Lerato Dlamini','Nathan Sithole','Hannah Molefe','Asher Dube','Rebekah Maseko','Micah Cele',
  'Sipho Radebe','Abigail Botha','James Daniels','Chloe Nkosi','Matthew Smith','Joy Mokoena',
].map((name, i) => ({ id: `MG-${String(i + 1).padStart(3,'0')}`, name, dob: `${2022 - Math.floor(i / 12) * 3}-${String(i % 9 + 1).padStart(2,'0')}-${String(i % 20 + 1).padStart(2,'0')}`, phone: `+27 00 000 ${String(i + 1).padStart(4,'0')}`, className: classes[Math.floor(i / 12)] ?? classes[0], registered: `2026-09-${String(i % 25 + 1).padStart(2,'0')}` }));
export const demoAttendance: Attendance[] = [];
for (const [week, day, count] of [[1,4,29],[2,11,33]] as const) {
  for (let i = 0; i < count; i++) {
    const child = demoChildren[i];
    if (child) demoAttendance.push({id:`demo-${week}-${i}`,childId:child.id,date:`2026-10-${String(day).padStart(2,'0')}`,week,service:i % 3 + 1});
  }
}
for (let i = 0; i < 26; i++) {
 const child = demoChildren[i];
 if (child) demoAttendance.push({id:`sept-${i}`,childId:child.id,date:'2026-09-27',week:4,service:i % 3 + 1});
}
export const initials = (name: string) => name.split(' ').map(x => x[0]).slice(0,2).join('');
export const prettyDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
export const monthName = (month: string) => new Date(`${month}-01T12:00:00`).toLocaleDateString('en-GB',{month:'long',year:'numeric'});
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export function exportCsv(filename: string, rows: (string | number)[][]) {
 const csv = rows.map(row => row.map(v => { const s=String(v); return `"${(/^[=+@\-]/.test(s) ? "'" : '') + s.replaceAll('"','""')}"`; }).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}));
 const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}
