import React, { useState } from 'react';
import {
  X,
  Search,
  UserPlus,
  UserMinus,
  Users,
  Hash,
  Shield,
  Check,
  UserCheck
} from 'lucide-react';
import { ChatChannel, StaffChatContact } from '../../../types';

interface ChannelMembersModalProps {
  channel: ChatChannel | null;
  isOpen: boolean;
  onClose: () => void;
  contacts: StaffChatContact[];
  onAddMember: (channelId: string, staffId: string) => void;
  onRemoveMember: (channelId: string, staffId: string) => void;
  currentUserId?: string;
}

export const ChannelMembersModal: React.FC<ChannelMembersModalProps> = ({
  channel,
  isOpen,
  onClose,
  contacts,
  onAddMember,
  onRemoveMember,
  currentUserId = 'usr-1'
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'add'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  if (!isOpen || !channel) return null;

  const currentMemberIds = channel.member_ids || [];
  
  // List of current members
  const currentMembers = contacts.filter((c) => currentMemberIds.includes(c.id));
  
  // List of non-members available to be added
  const availableStaff = contacts.filter((c) => !currentMemberIds.includes(c.id));

  // Filtered by search
  const filteredCurrentMembers = currentMembers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAvailableStaff = availableStaff.filter(
    (c) =>
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (staff: StaffChatContact) => {
    onAddMember(channel.id, staff.id);
    setFeedbackMsg({ text: `Added ${staff.full_name} to #${channel.name}`, type: 'success' });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleRemove = (staff: StaffChatContact) => {
    onRemoveMember(channel.id, staff.id);
    setFeedbackMsg({ text: `Removed ${staff.full_name} from #${channel.name}`, type: 'info' });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-600/30">
              <Hash className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  #{channel.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono">
                  {currentMemberIds.length} Members
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {channel.description || 'Channel member roster & team access control'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackMsg && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b transition-all ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300'
                : 'bg-amber-950/60 border-amber-800/50 text-amber-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              {feedbackMsg.text}
            </span>
            <button
              type="button"
              onClick={() => setFeedbackMsg(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tabs: Channel Members vs Add Members */}
        <div className="p-3 bg-slate-950/50 border-b border-slate-800 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('members');
              setSearchQuery('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'members'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Channel Members</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {currentMembers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('add');
              setSearchQuery('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'add'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Team Members</span>
            {availableStaff.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                +{availableStaff.length} available
              </span>
            )}
          </button>
        </div>

        {/* Search input */}
        <div className="p-3 border-b border-slate-800 bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'members'
                  ? 'Search members by name, role, department...'
                  : 'Search staff to add...'
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {activeTab === 'members' ? (
            /* ============================================================ */
            /* TAB 1: CURRENT MEMBERS LIST (WITH REMOVE OPTION) */
            /* ============================================================ */
            filteredCurrentMembers.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <Users className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  {searchQuery ? 'No members match your search' : 'No members found in this channel'}
                </p>
              </div>
            ) : (
              filteredCurrentMembers.map((staff) => {
                const isSuperAdmin = staff.id === 'usr-1' || staff.role.includes('Super Admin');
                const isYou = staff.id === currentUserId;

                return (
                  <div
                    key={staff.id}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={staff.avatar_url}
                          alt={staff.full_name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-slate-900 ${
                            staff.is_online ? 'bg-emerald-400' : 'bg-slate-600'
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-white truncate">{staff.full_name}</h4>
                          {isYou && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">
                              You
                            </span>
                          )}
                          {isSuperAdmin && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold flex items-center gap-0.5">
                              <Shield className="w-2.5 h-2.5" />
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {staff.role} • <span className="text-slate-500">{staff.department}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Button: Remove Member */}
                    <div className="shrink-0">
                      {isSuperAdmin ? (
                        <span className="text-[10px] text-slate-500 font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800">
                          Owner
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemove(staff)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/60 border border-rose-800/40 hover:border-rose-500 text-rose-300 hover:text-rose-100 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm group"
                          title={`Remove ${staff.full_name} from channel`}
                        >
                          <UserMinus className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )
          ) : (
            /* ============================================================ */
            /* TAB 2: AVAILABLE STAFF TO ADD */
            /* ============================================================ */
            filteredAvailableStaff.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <UserCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs text-emerald-400 font-semibold">
                  All agency team members are already in this channel!
                </p>
                <p className="text-[11px] text-slate-500">
                  Everyone on staff has full access to collaborate in #{channel.name}.
                </p>
              </div>
            ) : (
              filteredAvailableStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-800/50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={staff.avatar_url}
                        alt={staff.full_name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-slate-900 ${
                          staff.is_online ? 'bg-emerald-400' : 'bg-slate-600'
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{staff.full_name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {staff.role} • <span className="text-slate-500">{staff.department}</span>
                      </p>
                    </div>
                  </div>

                  {/* Add Member Button */}
                  <button
                    type="button"
                    onClick={() => handleAdd(staff)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 hover:border-cyan-500 text-cyan-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm group shrink-0"
                    title={`Add ${staff.full_name} to channel`}
                  >
                    <UserPlus className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Add to #{channel.name}</span>
                  </button>
                </div>
              ))
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>
              {channel.member_ids?.length || 0} active members in #{channel.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
