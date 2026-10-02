import React, { useState, useEffect } from 'react';
import {
  Clock,
  Building2,
  Home,
  CheckCircle2,
  LogOut,
  Sparkles,
  Calendar,
  AlertCircle,
  Timer,
  Coffee,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const StaffPunchConsole: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { getStaffTodayAttendance, punchIn, punchOut, employees } = useData();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [workMode, setWorkMode] = useState<'Office' | 'Remote'>('Office');
  const [workNote, setWorkNote] = useState('');
  const [isPunching, setIsPunching] = useState(false);

  // Live Clock updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Do not show for clients
  if (role === 'CLIENT') {
    return null;
  }

  const staffId = currentUser?.id || 'staff';
  const staffName = currentUser?.full_name || 'Staff Member';
  const matchedEmp = employees.find(
    (e) => e.id === currentUser?.id || `${e.first_name} ${e.last_name}`.toLowerCase() === staffName.toLowerCase()
  );
  const empCode = matchedEmp?.employee_code || `DS-${staffId.slice(-3).toUpperCase()}`;
  const departmentName = currentUser?.department || matchedEmp?.department?.name || 'Operations';
  const designation = currentUser?.designation || matchedEmp?.role_title || role.replace('_', ' ');

  const todayRecord = getStaffTodayAttendance(staffId, staffName);
  const isPunchedIn = !!todayRecord?.punch_in;
  const isPunchedOut = !!todayRecord?.punch_out;

  // Calculate elapsed time if punched in and not punched out
  const getElapsedSeconds = () => {
    if (!todayRecord?.punch_in) return 0;
    const match = todayRecord.punch_in.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3]?.toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const punchDate = new Date();
    punchDate.setHours(hours, minutes, 0, 0);

    const diff = Math.max(0, Math.floor((currentTime.getTime() - punchDate.getTime()) / 1000));
    return diff;
  };

  const elapsedSeconds = getElapsedSeconds();
  const elapsedH = Math.floor(elapsedSeconds / 3600);
  const elapsedM = Math.floor((elapsedSeconds % 3600) / 60);
  const elapsedS = elapsedSeconds % 60;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / (8 * 3600)) * 100));

  const handlePunchIn = () => {
    setIsPunching(true);
    punchIn(staffId, staffName, workMode, workNote);
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Fallback
    }
    setTimeout(() => {
      setIsPunching(false);
      setWorkNote('');
    }, 400);
  };

  const handlePunchOut = () => {
    if (window.confirm(`Are you sure you want to Punch Out now, ${staffName}?`)) {
      setIsPunching(true);
      punchOut(staffId, staffName);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          colors: ['#a855f7', '#ec4899', '#3b82f6'],
          origin: { y: 0.7 }
        });
      } catch {
        // Fallback
      }
      setTimeout(() => {
        setIsPunching(false);
      }, 400);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-purple-950/40 border border-slate-800 shadow-2xl p-5 sm:p-6 backdrop-blur-xl">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-10 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Live Clock & Staff Details */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Digital Clock Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-center items-center sm:items-start min-w-[170px] shadow-inner">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>DIGI CLOCK</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-xs font-bold text-fuchsia-400">
                {currentTime.toLocaleTimeString([], { second: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>{currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Staff Info & Live Shift Status with Photo */}
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-3.5">
              <img
                src={currentUser?.avatar_url || matchedEmp?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'}
                alt={staffName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/40 shadow-md shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>{staffName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                      {empCode}
                    </span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                  <span className="text-fuchsia-400 font-medium">{designation}</span>
                  <span>•</span>
                  <span>{departmentName}</span>
                  <span>•</span>
                  <span className="text-slate-300 font-medium">Standard 8h Shift</span>
                </p>
              </div>
            </div>

            {/* Current Shift Badge */}
            <div className="pt-0.5 flex items-center gap-2 flex-wrap">
              {!isPunchedIn && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Not Checked In Today • ഇന്നത്തെ ഹാജർ രേഖപ്പെടുത്തിയിട്ടില്ല</span>
                </span>
              )}

              {isPunchedIn && !isPunchedOut && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ON DUTY: Checked in at {todayRecord?.punch_in}</span>
                    <span className="text-emerald-400/80">({todayRecord?.work_mode || 'Office'})</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    <Timer className="w-3.5 h-3.5 text-purple-400" />
                    <span>{String(elapsedH).padStart(2, '0')}h {String(elapsedM).padStart(2, '0')}m {String(elapsedS).padStart(2, '0')}s</span>
                  </span>
                </div>
              )}

              {isPunchedOut && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Shift Completed: {todayRecord?.punch_in} to {todayRecord?.punch_out} ({todayRecord?.total_hours}h)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Punch Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* STATE 1: NOT PUNCHED IN */}
          {!isPunchedIn && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Working Mode Radio Selector */}
              <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setWorkMode('Office')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    workMode === 'Office'
                      ? 'bg-fuchsia-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>🏢 Office</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkMode('Remote')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    workMode === 'Remote'
                      ? 'bg-fuchsia-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>🏠 Remote</span>
                </button>
              </div>

              {/* Punch In Trigger Button */}
              <button
                type="button"
                onClick={handlePunchIn}
                disabled={isPunching}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-100" />
                <span>⚡ PUNCH IN NOW / ഹാജർ രേഖപ്പെടുത്തുക</span>
              </button>
            </div>
          )}

          {/* STATE 2: CURRENTLY ON SHIFT */}
          {isPunchedIn && !isPunchedOut && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Progress bar towards 8 hours */}
              <div className="hidden xl:flex flex-col gap-1 w-32">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Shift Goal</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Punch Out Action */}
              <button
                type="button"
                onClick={handlePunchOut}
                disabled={isPunching}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <LogOut className="w-4 h-4 text-rose-100" />
                <span>⏹️ PUNCH OUT / ഷിഫ്റ്റ് അവസാനിപ്പിക്കുക</span>
              </button>
            </div>
          )}

          {/* STATE 3: SHIFT COMPLETED */}
          {isPunchedOut && (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Full Day Logged ({todayRecord?.total_hours} hrs)</span>
              </div>
              <button
                type="button"
                onClick={handlePunchIn}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                title="Log overtime session if working beyond shift"
              >
                + Overtime Shift
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
