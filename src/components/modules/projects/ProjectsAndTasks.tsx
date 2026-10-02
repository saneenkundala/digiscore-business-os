import React, { useState } from 'react';
import {
  FolderGit2,
  CheckSquare,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  Kanban,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  Package as PackageIcon,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Trash2,
  Edit2
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { Project, Task, TaskStatus, PriorityLevel, ProjectStatus } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { formatCurrency, formatDate } from '../../../lib/utils';

interface ProjectsAndTasksProps {
  initialView?: 'projects' | 'tasks' | 'calendar';
  onNavigate: (module: string) => void;
}

export const ProjectsAndTasks: React.FC<ProjectsAndTasksProps> = ({
  initialView = 'projects',
  onNavigate
}) => {
  const {
    projects,
    tasks,
    clients,
    employees,
    packages,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask
  } = useData();

  const [activeTab, setActiveTab] = useState<'projects' | 'tasks-list' | 'tasks-kanban' | 'calendar' | 'packages'>(
    initialView === 'tasks' ? 'tasks-kanban' : initialView === 'calendar' ? 'calendar' : 'projects'
  );

  React.useEffect(() => {
    if (initialView === 'tasks') {
      setActiveTab('tasks-kanban');
    } else if (initialView === 'calendar') {
      setActiveTab('calendar');
    } else {
      setActiveTab('projects');
    }
  }, [initialView]);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Modals
  const [isAddProjOpen, setIsAddProjOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Project Form
  const [projForm, setProjForm] = useState({
    name: '',
    client_id: clients[0]?.id || '',
    package_name: 'Scale Acceleration',
    project_manager_name: employees[2]?.first_name + ' ' + employees[2]?.last_name,
    start_date: new Date().toISOString().slice(0, 10),
    budget: 6500,
    status: 'Active' as ProjectStatus,
    priority: 'High' as PriorityLevel,
    description: '',
    progress_percentage: 20
  });

  // Task Form
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    project_id: projects[0]?.id || '',
    client_name: clients[0]?.name || '',
    assigned_to_name: employees[2]?.first_name + ' ' + employees[2]?.last_name,
    priority: 'Medium' as PriorityLevel,
    status: 'To Do' as TaskStatus,
    start_date: new Date().toISOString().slice(0, 10),
    due_date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    estimated_hours: 6,
    actual_hours: 0
  });

  const taskStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Review', 'Client Approval', 'Completed'];

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.task_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assigned_to_name && t.assigned_to_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.name || !projForm.client_id) return;
    const client = clients.find((c) => c.id === projForm.client_id);
    addProject({
      ...projForm,
      client_name: client?.name || 'Client'
    });
    setIsAddProjOpen(false);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title) return;
    const project = projects.find((p) => p.id === taskForm.project_id);
    addTask({
      ...taskForm,
      project_name: project?.name,
      client_name: project?.client_name || taskForm.client_name
    });
    setIsAddTaskOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-fuchsia-400" />
            Projects & Task Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Deliverable sprints, creative workflow pipelines, and resource assignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddProjOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-purple-400" />
            <span>New Project</span>
          </button>
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Navigation View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'projects'
                ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks-kanban')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'tasks-kanban'
                ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Task Kanban</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks-list')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'tasks-list'
                ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task List ({tasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'calendar'
                ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar View</span>
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'packages'
                ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PackageIcon className="w-3.5 h-3.5" />
            <span>Packages ({packages.length})</span>
          </button>
        </div>

        {/* Priority Filter */}
        {activeTab.startsWith('tasks') && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Priority:</span>
            {['All', 'Urgent', 'High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2 py-0.5 rounded-lg font-medium transition-colors ${
                  priorityFilter === p
                    ? 'bg-slate-800 text-fuchsia-400 border border-fuchsia-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW 1: PROJECTS LIST */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/40 p-5 space-y-4 shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 font-semibold">{proj.project_code}</span>
                  <h4 className="text-base font-bold text-white mt-0.5 line-clamp-1">{proj.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Client: {proj.client_name}</p>
                </div>
                <StatusBadge status={proj.status} />
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Sprint Progress</span>
                  <span className="font-bold text-fuchsia-300">{proj.progress_percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
                    style={{ width: `${proj.progress_percentage}%` }}
                  />
                </div>
              </div>

              {/* Budget & Team */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Budget</span>
                  <p className="font-extrabold text-white">{formatCurrency(proj.budget)}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Manager</span>
                  <p className="font-semibold text-slate-300">{proj.project_manager_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: TASK KANBAN */}
      {activeTab === 'tasks-kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1200px]">
            {taskStatuses.map((st) => {
              const statusTasks = filteredTasks.filter((t) => t.status === st);

              return (
                <div key={st} className="w-72 flex-shrink-0 rounded-2xl bg-slate-900/50 border border-slate-800 p-3 flex flex-col">
                  {/* Status header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{st}</span>
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                      {statusTasks.length}
                    </span>
                  </div>

                  {/* Task cards */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                    {statusTasks.map((task) => {
                      const isOverdue = task.status !== 'Completed' && new Date(task.due_date) < new Date();

                      return (
                        <div
                          key={task.id}
                          className="rounded-xl glass-panel p-3.5 border border-slate-800 hover:border-purple-500/40 transition-all shadow-md space-y-2.5 cursor-pointer"
                          onClick={() => {
                            setSelectedTask(task);
                            setIsTaskDetailsOpen(true);
                          }}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="text-[10px] font-mono text-purple-400 font-semibold">{task.task_code}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                task.priority === 'Urgent'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : task.priority === 'High'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <h5 className="text-xs font-bold text-white line-clamp-2">{task.title}</h5>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                            <div className="flex items-center gap-1 truncate">
                              <User className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{task.assigned_to_name}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Clock className={`w-3 h-3 ${isOverdue ? 'text-rose-400' : 'text-slate-500'}`} />
                              <span className={isOverdue ? 'text-rose-400 font-bold' : ''}>
                                {formatDate(task.due_date)}
                              </span>
                            </div>
                          </div>

                          {/* Quick mover */}
                          <div className="flex items-center justify-end gap-1 pt-1" onClick={(e) => e.stopPropagation()}>
                            {st !== 'Completed' && (
                              <button
                                onClick={() => {
                                  const nextIdx = taskStatuses.indexOf(st) + 1;
                                  if (nextIdx < taskStatuses.length) {
                                    updateTaskStatus(task.id, taskStatuses[nextIdx]);
                                  }
                                }}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-purple-600/30 text-slate-300 hover:text-white text-[10px] font-semibold flex items-center gap-1"
                              >
                                <span>Move</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: TASK LIST */}
      {activeTab === 'tasks-list' && (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Code</th>
                  <th className="py-3 px-4 font-semibold">Task Title</th>
                  <th className="py-3 px-4 font-semibold">Project & Client</th>
                  <th className="py-3 px-4 font-semibold">Assigned To</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-purple-300">{task.task_code}</td>
                    <td className="py-3 px-4 font-bold text-white">{task.title}</td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{task.project_name || 'General Sprint'}</div>
                      <span className="text-[10px] text-slate-500">{task.client_name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{task.assigned_to_name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-400'
                            : task.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-300">{formatDate(task.due_date)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setTaskToDelete(task);
                          setIsDeleteOpen(true);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white">Monthly Delivery Schedule (March 2026)</h4>
            <span className="text-xs text-slate-400">Deadlines & Deliverable Sprints</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase py-2 border-b border-slate-800">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = `2026-03-${day < 10 ? '0' + day : day}`;
              const dayTasks = tasks.filter((t) => t.due_date.startsWith(dateStr));

              return (
                <div
                  key={day}
                  className="min-h-24 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between hover:border-fuchsia-500/30 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-400 text-left">{day}</span>
                  <div className="space-y-1 my-1">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-1 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold truncate text-left"
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 5: AGENCY PACKAGES & DELIVERABLE QUOTAS */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-2xl glass-panel border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">Agency Retainer</span>
                <h4 className="text-xl font-extrabold text-white mt-1">{pkg.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{pkg.description}</p>
                <div className="text-2xl font-black text-emerald-400 mt-4">
                  {formatCurrency(pkg.price)}{' '}
                  <span className="text-xs font-normal text-slate-400">/ {pkg.duration}</span>
                </div>
              </div>

              {/* Deliverable counters */}
              <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Creative Posters</span>
                  <span className="font-bold text-white">{pkg.poster_quantity} / mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reels & Short-form</span>
                  <span className="font-bold text-white">{pkg.reel_quantity} / mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cinema Promo Videos</span>
                  <span className="font-bold text-white">{pkg.video_quantity} / mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Social Stories</span>
                  <span className="font-bold text-white">{pkg.story_quantity} / mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ad Management</span>
                  <span className={`font-bold ${pkg.ad_management ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {pkg.ad_management ? 'Included' : 'None'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setProjForm({ ...projForm, package_name: pkg.name, budget: pkg.price });
                  setIsAddProjOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-fuchsia-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Sprint With Package</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddProjOpen}
        onClose={() => setIsAddProjOpen(false)}
        title="Create New Agency Project Sprint"
        subtitle="Initiate a scheduled deliverable contract with team staffing"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={projForm.name}
              onChange={(e) => setProjForm({ ...projForm, name: e.target.value })}
              placeholder="e.g. Ramadan Omnichannel Campaign Sprint"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Client *</label>
              <select
                value={projForm.client_id}
                onChange={(e) => setProjForm({ ...projForm, client_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Budget (₹ INR)</label>
              <input
                type="number"
                value={projForm.budget}
                onChange={(e) => setProjForm({ ...projForm, budget: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Manager</label>
              <select
                value={projForm.project_manager_name}
                onChange={(e) => setProjForm({ ...projForm, project_manager_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {employees.map((e) => (
                  <option key={e.id} value={`${e.first_name} ${e.last_name}`}>
                    {e.first_name} {e.last_name} ({e.role_title})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={projForm.priority}
                onChange={(e) => setProjForm({ ...projForm, priority: e.target.value as PriorityLevel })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddProjOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95"
            >
              Initiate Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        title="Create New Project Task"
        subtitle="Assign an item to creative or video team"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="e.g. Design 4 Carousel Slides for Mindset Retainer"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assign to Employee</label>
              <select
                value={taskForm.assigned_to_name}
                onChange={(e) => setTaskForm({ ...taskForm, assigned_to_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {employees.map((e) => (
                  <option key={e.id} value={`${e.first_name} ${e.last_name}`}>
                    {e.first_name} {e.last_name} ({e.role_title})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as PriorityLevel })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              >
                {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Hours</label>
              <input
                type="number"
                value={taskForm.estimated_hours}
                onChange={(e) => setTaskForm({ ...taskForm, estimated_hours: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-fuchsia-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddTaskOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Task Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          if (taskToDelete) deleteTask(taskToDelete.id);
        }}
        title="Delete Task"
        message={`Are you sure you want to delete task "${taskToDelete?.title}"?`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};
