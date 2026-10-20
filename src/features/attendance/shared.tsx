import { useState, type ReactNode } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { CalendarDays, Search, Check, Users, ArrowRight, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAttendance } from './store';
import { classes, tribes, initials, prettyDate, today, type Child, type Attendance } from './data';

export function MonthControl() { const {month,setMonth}=useAttendance(); return <label className="month-control"><CalendarDays size={14}/><input aria-label="Report month" type="month" value={month} onChange={e=>{if(e.target.value)setMonth(e.target.value)}}/></label>; }
export function PageHeading({title,description,children}:{title:string;description:string;children?:ReactNode}) {return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div><div className="heading-actions">{children}</div></div>;}
export function ChildName({child}:{child:Child}) {return <div className="child-name"><span className="child-avatar">{initials(child.name)}</span><div><strong>{child.name}</strong><small>{child.code}{child.parentName?` · ${child.parentName}`:''}</small></div></div>;}
export function FamilyBadge({family}:{family:Child['family']}) {return family?<span className="class-badge">{family}</span>:<span className="text-muted-foreground">—</span>;}
export function SearchField({value,onChange,placeholder='Search by child, parent or ID…'}:{value:string;onChange:(v:string)=>void;placeholder?:string}) {return <div className="search-field"><Search/><input aria-label="Search children" className="form-input" placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}/></div>;}
export const matchesChild = (c: Child, q: string) => `${c.name} ${c.code} ${c.parentName ?? ''} ${c.phone ?? ''} ${c.family ?? ''}`.toLowerCase().includes(q.toLowerCase());
export function EmptyState({text='No records found.'}:{text?:string}) {return <div className="empty-state"><Users/><p>{text}</p></div>;}

export const registrationSchema = z.object({
  name: z.string().trim().min(1, 'Please enter the child’s full name.').max(100, 'Name must be under 100 characters.'),
  parentName: z.string().trim().min(1, 'Please enter the parent or guardian’s full name.').max(100, 'Name must be under 100 characters.'),
  family: z.enum(tribes).nullable(),
  dob: z.string().optional(),
  phone: z.string().trim().max(30, 'Phone must be under 30 characters.').optional(),
  className: z.enum(classes),
  registered: z.string().min(1, 'Please choose a registration date.'),
});
type RegistrationValues = z.infer<typeof registrationSchema>;

export function RegistrationForm({onDone}:{onDone?:()=>void}) {
 const {addChild,children}=useAttendance();
 const form=useForm<RegistrationValues>({resolver:zodResolver(registrationSchema),defaultValues:{name:'',parentName:'',family:null,dob:'',phone:'',className:'3-5 Years',registered:today()}});
 const {register,handleSubmit,control,formState:{errors,isSubmitting},reset}=form;
 const onSubmit=async(v:RegistrationValues)=>{
  if(children.some(c=>c.name.toLowerCase()===v.name.toLowerCase()&&(c.parentName??'').toLowerCase()===v.parentName.toLowerCase())){toast.error('This child is already registered. Find them on the check-in page.');return;}
  try{const child=await addChild({name:v.name,parentName:v.parentName,family:v.family,dob:v.dob||null,phone:v.phone||null,className:v.className,registered:v.registered});toast.success(`${child.name} is registered (${child.code}).`);reset();onDone?.();}
  catch{toast.error('The child could not be registered. Please try again.');}
 };
 const err=(m?:string)=>m?<p className="form-error" role="alert">{m}</p>:null;
 return <form onSubmit={handleSubmit(onSubmit)} noValidate><div className="form-grid">
  <div className="field form-full"><Label htmlFor="child-name">Child’s full name *</Label><Input id="child-name" placeholder="First and last name" maxLength={100} aria-invalid={!!errors.name} {...register('name')}/>{err(errors.name?.message)}</div>
  <div className="field form-full"><Label htmlFor="parent-name">Parent/Guardian Full Name *</Label><Input id="parent-name" placeholder="Parent or guardian’s full name" maxLength={100} aria-invalid={!!errors.parentName} {...register('parentName')}/>{err(errors.parentName?.message)}</div>
  <div className="field"><Label htmlFor="child-family">Family (Tribe)</Label><Controller control={control} name="family" render={({field})=><Select value={field.value??'__none'} onValueChange={v=>field.onChange(v==='__none'?null:v)}><SelectTrigger id="child-family"><SelectValue placeholder="Select a family (optional)"/></SelectTrigger><SelectContent><SelectItem value="__none">Select a family (optional)</SelectItem>{tribes.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>}/></div>
  <div className="field"><Label htmlFor="child-class">Class</Label><Controller control={control} name="className" render={({field})=><Select value={field.value} onValueChange={field.onChange}><SelectTrigger id="child-class"><SelectValue/></SelectTrigger><SelectContent>{classes.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>}/></div>
  <div className="field"><Label htmlFor="child-dob">Date of birth</Label><Input id="child-dob" type="date" max={today()} {...register('dob')}/></div>
  <div className="field"><Label htmlFor="child-phone">Parent / guardian phone</Label><Input id="child-phone" type="tel" placeholder="Optional" maxLength={30} {...register('phone')}/>{err(errors.phone?.message)}</div>
  <div className="field form-full"><Label htmlFor="registration-date">Registration date</Label><Input id="registration-date" type="date" max={today()} {...register('registered')}/>{err(errors.registered?.message)}</div>
 </div><div className="form-actions">{onDone&&<Button type="button" variant="outline" onClick={onDone}>Cancel</Button>}<Button type="submit" disabled={isSubmitting}>{isSubmitting?<Loader2 className="animate-spin"/>:<UserPlus/>}Register child</Button></div></form>;
}

export function RegistrationButton() {
 const [open,setOpen]=useState(false);
 return <><Button onClick={()=>setOpen(true)}><UserPlus/>Register child</Button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-lg max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Register a new child</DialogTitle><DialogDescription>Moses Generation · Zion Temple</DialogDescription></DialogHeader><RegistrationForm onDone={()=>setOpen(false)}/></DialogContent></Dialog></>;
}
export function ChildProfile({child,onClose}:{child:Child|null;onClose:()=>void}) {
 const {attendance}=useAttendance();const history=attendance.filter(r=>r.childId===child?.id).sort((a,b)=>b.date.localeCompare(a.date));
 return <Dialog open={!!child} onOpenChange={v=>{if(!v)onClose()}}><DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-lg max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>Child details</DialogTitle><DialogDescription>Registration and attendance history</DialogDescription></DialogHeader>{child&&<><div className="profile-top"><span className="child-avatar">{initials(child.name)}</span><div><h3>{child.name}</h3><p className="text-xs text-muted-foreground mt-1">{child.code} · {child.className}</p></div></div><dl className="selected-details"><div><dt>Parent / guardian</dt><dd>{child.parentName||'—'}</dd></div><div><dt>Family (Tribe)</dt><dd>{child.family||'—'}</dd></div><div><dt>Date of birth</dt><dd>{prettyDate(child.dob)}</dd></div><div><dt>Registered</dt><dd>{prettyDate(child.registered)}</dd></div><div><dt>Parent / guardian phone</dt><dd>{child.phone||'—'}</dd></div><div><dt>Total check-ins</dt><dd>{history.length}</dd></div></dl><h3 className="text-sm font-semibold mt-5">Attendance history</h3>{history.length?<div className="table-scroll"><table className="data-table"><thead><tr><th>Date</th><th>Week</th><th>Service</th></tr></thead><tbody>{history.map(a=><tr key={a.id}><td>{prettyDate(a.date)}</td><td>Week {a.week}</td><td>Service {a.service}</td></tr>)}</tbody></table></div>:<EmptyState text="No attendance recorded yet."/>}</>}</DialogContent></Dialog>;
}
export function AttendanceTable({rows,compact=false}:{rows:Attendance[];compact?:boolean}) {
 const {children}=useAttendance();return rows.length?<div className="table-scroll"><table className="data-table"><thead><tr><th>Child’s name</th><th>Class</th><th>Family</th><th>Service</th><th>Date</th>{!compact&&<th>Week</th>}<th>Status</th></tr></thead><tbody>{rows.map(a=>{const child=children.find(c=>c.id===a.childId);if(!child)return null;return <tr key={a.id}><td><ChildName child={child}/></td><td><span className="class-badge">{child.className}</span></td><td><FamilyBadge family={child.family}/></td><td>Service {a.service}</td><td>{prettyDate(a.date)}</td>{!compact&&<td>Week {a.week}</td>}<td><span className="status-badge"><Check/>Checked in</span></td></tr>})}</tbody></table></div>:<EmptyState text="No attendance for this selection."/>;
}
export function QuickLink({icon,title,description}:{icon:ReactNode;title:string;description:string}) {return <><span className="quick-icon">{icon}</span><div><strong>{title}</strong><p>{description}</p></div><ArrowRight/></>;}
