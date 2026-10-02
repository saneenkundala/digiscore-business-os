import React, { useState } from 'react';
import {
  Users,
  CalendarCheck,
  PlaneTakeoff,
  Banknote,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Building,
  DollarSign,
  FileText,
  Phone,
  Mail,
  Download,
  ShieldCheck,
  Check,
  Calendar,
  Camera,
  Upload
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Employee, AttendanceRecord, LeaveRequest, SalaryRecord, AttendanceStatus } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { StaffPunchConsole } from '../../common/StaffPunchConsole';
import { Modal } from '../../common/Modal';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

interface HRModuleProps {
  initialTab?: 'employees' | 'attendance' | 'leave' | 'salary';
  onNavigate: (module: string) => void;
}

export const HRModule: React.FC<HRModuleProps> = ({
  initialTab = 'employees',
  onNavigate
}) => {
  const {
    employees,
    departments,
    attendance,
    leaves,
    salaries,
    addEmployee,
    punchAttendance,
    punchIn,
    punchOut,
    submitLeaveRequest,
    reviewLeaveRequest,
    markSalaryPaid,
    updateStaffPhoto
  } = useData();

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'leave' | 'salary'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddEmpOpen, setIsAddEmpOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<SalaryRecord | null>(null);

  // Employee Form
  const [empForm, setEmpForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role_title: 'Growth Specialist',
    department_id: departments[1]?.id || '',
    joining_date: new Date().toISOString().slice(0, 10),
    salary: 12000,
    status: 'Active' as Employee['status'],
    emergency_contact: '+971 50 000 0000',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  });

  // Leave Form
  const [leaveForm, setLeaveForm] = useState({
    employee_id: employees[0]?.id || '',
    leave_type: 'Annual' as LeaveRequest['leave_type'],
    start_date: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    days_count: 3,
    reason: 'Family occasion'
  });

  const filteredEmployees = employees.filter((e) =>
    `${e.first_name} ${e.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.employee_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.first_name || !empForm.email) return;
    addEmployee(empForm);
    setIsAddEmpOpen(false);
  };

  const handleSaveLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === leaveForm.employee_id);
    submitLeaveRequest({
      ...leaveForm,
      employee_name: emp ? `${emp.first_name} ${emp.last_name}` : 'Staff'
    });
    setIsLeaveModalOpen(false);
  };

  // Salary slip PDF download
  const handleDownloadSalarySlip = (sal: SalaryRecord) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.setFontSize(20);
    doc.text('DIGI SCORE', 20, 25);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Office Management & Agency Operations', 20, 32);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text(`CONFIDENTIAL PAYSLIP: ${sal.month}/${sal.year}`, 120, 25);

    doc.line(20, 38, 190, 38);

    doc.setFontSize(11);
    doc.text(`Employee Name: ${sal.employee_name}`, 20, 48);
    doc.text(`Payment Status: ${sal.payment_status.toUpperCase()}`, 120, 48);
    if (sal.payment_date) doc.text(`Date: ${formatDate(sal.payment_date)}`, 120, 56);

    // Earnings table
    doc.setFillColor(241, 245, 249);
    doc.rect(20, 68, 170, 8, 'F');
    doc.text('Salary Breakdown Components', 24, 73);
    doc.text('Amount (INR)', 150, 73);

    doc.setFont('helvetica', 'normal');
    doc.text('Basic Salary', 24, 85);
    doc.text(sal.basic_salary.toLocaleString('en-IN'), 155, 85);

    doc.text('Allowances (HRA & Special)', 24, 93);
    doc.text(`+ ${sal.allowances.toLocaleString('en-IN')}`, 155, 93);

    doc.text('Performance Bonuses', 24, 101);
    doc.text(`+ ${sal.bonuses.toLocaleString('en-IN')}`, 155, 101);

    doc.text('Unpaid Leave Deductions', 24, 109);
    doc.text(`- ${sal.unpaid_leave_deduction.toLocaleString('en-IN')}`, 155, 109);

    doc.text('PF & Other Deductions', 24, 117);
    doc.text(`- ${sal.other_deductions.toLocaleString('en-IN')}`, 155, 117);

    doc.line(20, 123, 190, 123);
    doc.setFont('helvetica', 'bold');
    doc.text('NET SALARY PAYABLE:', 24, 132);
    doc.text(`Rs. ${sal.net_salary.toLocaleString('en-IN')}`, 150, 132);

    doc.save(`SalarySlip_${sal.employee_name.replace(/\s+/g, '_')}_${sal.month}_${sal.year}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-fuchsia-400" />
            Human Resources & Team Operations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Employee staff directory, daily biometric attendance, leave approvals and payroll disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <PlaneTakeoff className="w-3.5 h-3.5 text-pink-400" />
            <span>Request Leave</span>
          </button>
          <button
            onClick={() => setIsAddEmpOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-2 rounded-2xl glass-panel border border-slate-800 flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'employees' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Employees Directory ({employees.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'attendance' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Daily Attendance ({attendance.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('leave')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'leave' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <PlaneTakeoff className="w-3.5 h-3.5" />
          <span>Leave Requests ({leaves.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('salary')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
            activeTab === 'salary' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Banknote className="w-3.5 h-3.5" />
          <span>Salary Slips & Payroll ({salaries.length})</span>
        </button>
      </div>

      {/* TAB 1: EMPLOYEES */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <span className="text-xs text-slate-400">{filteredEmployees.length} Team Members</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="rounded-2xl glass-panel border border-slate-800 p-5 space-y-4 shadow-xl hover:border-purple-500/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative group/avatar shrink-0">
                      <img
                        src={emp.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'}
                        alt={emp.first_name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/30"
                      />
                      <label
                        className="absolute inset-0 bg-black/70 rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white"
                        title="Change staff photo"
                      >
                        <Camera className="w-4 h-4 text-purple-300" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const base64 = ev.target?.result as string;
                              if (base64) {
                                updateStaffPhoto(emp.id, base64);
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {emp.first_name} {emp.last_name}
                      </h4>
                      <p className="text-xs text-fuchsia-400 font-medium">{emp.role_title}</p>
                      <span className="text-[10px] font-mono text-slate-400">{emp.employee_code}</span>
                    </div>
                  </div>
                  <StatusBadge status={emp.status} />
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{emp.phone}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Monthly Comp</span>
                    <p className="font-bold text-emerald-400">{formatCurrency(emp.salary)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Joined</span>
                    <p className="font-semibold text-slate-300">{formatDate(emp.joining_date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Individual Staff Daily Punch Console */}
          <StaffPunchConsole />

          <div className="rounded-2xl glass-panel border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Agency Team Attendance Register</h4>
              <p className="text-xs text-slate-400">Real-time biometric punch logs, office vs remote modes, and shift durations</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {employees.filter(e => e.status === 'Active').map((emp) => {
                const isCheckedToday = attendance.some(
                  (a) => (a.employee_id === emp.id || a.employee_name === `${emp.first_name} ${emp.last_name}`) && a.date === new Date().toISOString().slice(0, 10) && a.punch_in
                );
                return (
                  <button
                    key={emp.id}
                    onClick={() => punchIn(emp.id, `${emp.first_name} ${emp.last_name}`, 'Office')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-2 ${
                      isCheckedToday
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500/40 hover:text-emerald-300'
                    }`}
                  >
                    <img
                      src={emp.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'}
                      alt={emp.first_name}
                      className="w-4 h-4 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                    />
                    <span className={`w-1.5 h-1.5 rounded-full ${isCheckedToday ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    <span>{emp.first_name} {emp.last_name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Employee</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Work Mode</th>
                  <th className="py-3 px-4 font-semibold">Punch In</th>
                  <th className="py-3 px-4 font-semibold">Punch Out</th>
                  <th className="py-3 px-4 font-semibold">Total Hours</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attendance.map((att) => {
                  const empMatch = employees.find(
                    (e) => e.id === att.employee_id || `${e.first_name} ${e.last_name}`.toLowerCase() === att.employee_name.toLowerCase()
                  );
                  return (
                    <tr key={att.id} className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={empMatch?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'}
                            alt={att.employee_name}
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-purple-500/30 shrink-0"
                          />
                          <div>
                            <span>{att.employee_name}</span>
                            {att.notes && <p className="text-[10px] text-slate-400 font-normal">{att.notes}</p>}
                          </div>
                        </div>
                      </td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(att.date)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                        att.work_mode === 'Remote'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30'
                      }`}>
                        {att.work_mode === 'Remote' ? '🏠 Remote' : '🏢 Office'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{att.punch_in || '—'}</td>
                    <td className="py-3.5 px-4 font-mono text-purple-400 font-semibold">{att.punch_out || '—'}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">{att.total_hours} hrs</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={att.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {att.punch_in && !att.punch_out ? (
                        <button
                          type="button"
                          onClick={() => punchOut(att.employee_id, att.employee_name)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold border border-rose-500/40"
                        >
                          ⏹️ Punch Out
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">Logged</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LEAVE REQUESTS */}
      {activeTab === 'leave' && (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Staff Member</th>
                <th className="py-3 px-4 font-semibold">Leave Type</th>
                <th className="py-3 px-4 font-semibold">Duration</th>
                <th className="py-3 px-4 font-semibold">Reason</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-bold text-white">{l.employee_name}</td>
                  <td className="py-3.5 px-4 text-purple-300 font-semibold">{l.leave_type} Leave</td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {formatDate(l.start_date)} - {formatDate(l.end_date)} ({l.days_count} days)
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{l.reason}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {l.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => reviewLeaveRequest(l.id, 'Approved', user?.full_name || 'Admin')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => reviewLeaveRequest(l.id, 'Rejected', user?.full_name || 'Admin')}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500">Reviewed by {l.approved_by_name}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: SALARY SLIPS */}
      {activeTab === 'salary' && (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Employee</th>
                <th className="py-3 px-4 font-semibold">Period</th>
                <th className="py-3 px-4 font-semibold">Basic</th>
                <th className="py-3 px-4 font-semibold">Allowances & Bonus</th>
                <th className="py-3 px-4 font-semibold">Net Salary</th>
                <th className="py-3 px-4 font-semibold">Payment Status</th>
                <th className="py-3 px-4 font-semibold text-right">Slip PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {salaries.map((sal) => (
                <tr key={sal.id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-bold text-white">{sal.employee_name}</td>
                  <td className="py-3.5 px-4 text-slate-400">
                    Month {sal.month} / {sal.year}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{formatCurrency(sal.basic_salary)}</td>
                  <td className="py-3.5 px-4 text-emerald-400">
                    +{formatCurrency(sal.allowances + sal.bonuses)}
                  </td>
                  <td className="py-3.5 px-4 font-black text-white">{formatCurrency(sal.net_salary)}</td>
                  <td className="py-3.5 px-4">
                    {sal.payment_status === 'Paid' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Paid ({sal.transaction_reference})
                      </span>
                    ) : (
                      <button
                        onClick={() => markSalaryPaid(sal.id)}
                        className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold hover:bg-amber-500/30"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDownloadSalarySlip(sal)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-fuchsia-600/30 text-slate-300 hover:text-white transition-colors"
                      title="Download Salary Slip PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddEmpOpen}
        onClose={() => setIsAddEmpOpen(false)}
        title="Add New Agency Employee"
        subtitle="Onboard a designer, video editor, developer or marketer"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEmployee} className="space-y-4">
          {/* Employee Photo Picker */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Staff Profile Photo</label>
            <div className="flex items-center gap-3.5">
              <img
                src={empForm.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'}
                alt="Preview"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/40 shrink-0 shadow-md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const base64 = ev.target?.result as string;
                          if (base64) setEmpForm({ ...empForm, avatar_url: base64 });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">Upload device photo or image</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={empForm.first_name}
                onChange={(e) => setEmpForm({ ...empForm, first_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={empForm.last_name}
                onChange={(e) => setEmpForm({ ...empForm, last_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Agency Email *</label>
              <input
                type="email"
                required
                value={empForm.email}
                onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title</label>
              <input
                type="text"
                value={empForm.role_title}
                onChange={(e) => setEmpForm({ ...empForm, role_title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Base Salary (₹ INR)</label>
              <input
                type="number"
                value={empForm.salary}
                onChange={(e) => setEmpForm({ ...empForm, salary: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                value={empForm.emergency_contact}
                onChange={(e) => setEmpForm({ ...empForm, emergency_contact: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddEmpOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow"
            >
              Add Staff Member
            </button>
          </div>
        </form>
      </Modal>

      {/* Request Leave Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Submit Leave Request"
        subtitle="Schedule vacation, sick or casual time off"
        maxWidth="md"
      >
        <form onSubmit={handleSaveLeave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Employee *</label>
            <select
              value={leaveForm.employee_id}
              onChange={(e) => setLeaveForm({ ...leaveForm, employee_id: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.first_name} {e.last_name} ({e.role_title})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Leave Type</label>
              <select
                value={leaveForm.leave_type}
                onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {['Annual', 'Sick', 'Casual', 'Maternity', 'Unpaid'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Days Count</label>
              <input
                type="number"
                min="1"
                value={leaveForm.days_count}
                onChange={(e) => setLeaveForm({ ...leaveForm, days_count: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={leaveForm.start_date}
                onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={leaveForm.end_date}
                onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Notes</label>
            <textarea
              rows={2}
              required
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
