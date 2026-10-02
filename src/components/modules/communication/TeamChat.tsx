import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Mic,
  Image as ImageIcon,
  Video as VideoIcon,
  Smile,
  CheckCheck,
  Check,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Circle,
  Hash,
  Users,
  Paperclip,
  Sparkles,
  Download,
  Flame,
  Heart,
  ThumbsUp,
  X,
  FileText,
  Bell,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { ChatMessage, ChatChannel, StaffChatContact } from '../../../types';
import { VoicePlayer } from './VoicePlayer';
import { VoiceRecorder } from './VoiceRecorder';
import { MediaLightbox, SampleMediaPicker } from './ChatMediaModal';
import { ChannelMembersModal } from './ChannelMembersModal';
import { CreateChannelModal } from './CreateChannelModal';
import { formatDate } from '../../../lib/utils';

export const TeamChat: React.FC = () => {
  const { currentUser, role } = useAuth();
  const {
    chatMessages,
    chatChannels,
    chatContacts,
    sendChatMessage,
    toggleChatReaction,
    markChatAsRead,
    updateUserPresence,
    simulateIncomingMessage,
    addChannelMember,
    removeChannelMember,
    createChannel
  } = useData();

  // Active chat target: either a channel id (e.g. 'chan-general') or user id (e.g. 'usr-4')
  const [activeTargetId, setActiveTargetId] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return '';
    }
    return 'chan-general';
  });
  const [chatTab, setChatTab] = useState<'dms' | 'channels'>('dms');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Channel management modals
  const [managingChannel, setManagingChannel] = useState<ChatChannel | null>(null);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  // Lightbox state
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    url: string;
    type: 'image' | 'video';
    name?: string;
  }>({
    isOpen: false,
    url: '',
    type: 'image'
  });

  // Call simulation modal
  const [callModal, setCallModal] = useState<{ isOpen: boolean; type: 'voice' | 'video'; name: string } | null>(null);

  // File input refs for uploading from computer
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentUserId = currentUser?.id || 'usr-1';
  const currentUserName = currentUser?.full_name || 'Hamid Saneen';
  const currentUserRole = currentUser?.designation || role.replace('_', ' ');
  const currentUserAvatar =
    currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';

  // Mark active chat as read on select or message arrival
  useEffect(() => {
    if (activeTargetId) {
      markChatAsRead(activeTargetId, currentUserId);
    }
  }, [activeTargetId, chatMessages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeTargetId]);

  // Find active contact or channel
  const activeChannel = chatChannels.find((c) => c.id === activeTargetId);
  const activeContact = chatContacts.find((c) => c.id === activeTargetId);
  const isDirectMessage = !activeTargetId.startsWith('chan-');

  // Filter messages for active conversation
  const currentMessages = chatMessages.filter((m) => {
    if (activeTargetId.startsWith('chan-')) {
      return m.recipient_id === activeTargetId;
    }
    // Direct message between current user and contact
    return (
      (m.sender_id === currentUserId && m.recipient_id === activeTargetId) ||
      (m.sender_id === activeTargetId && (m.recipient_id === currentUserId || m.recipient_id === 'usr-1'))
    );
  });

  // Filter contacts by search query
  const filteredContacts = chatContacts.filter(
    (c) =>
      c.id !== currentUserId &&
      (c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter channels by search query
  const filteredChannels = chatChannels.filter(
    (ch) =>
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic unread count calculation for contacts and channels
  const getContactUnread = (contactId: string) => {
    const unreadFromMsgs = chatMessages.filter(
      (m) =>
        m.sender_id === contactId &&
        (m.recipient_id === currentUserId || m.recipient_id === 'usr-1') &&
        m.status !== 'read'
    ).length;
    const contact = chatContacts.find((c) => c.id === contactId);
    return Math.max(unreadFromMsgs, contact?.unread_count || 0);
  };

  const getChannelUnread = (channelId: string) => {
    const unreadFromMsgs = chatMessages.filter(
      (m) =>
        m.recipient_id === channelId &&
        m.sender_id !== currentUserId &&
        m.status !== 'read'
    ).length;
    const channel = chatChannels.find((ch) => ch.id === channelId);
    return Math.max(unreadFromMsgs, channel?.unread_count || 0);
  };

  const totalDmsUnread = chatContacts.reduce((acc, c) => acc + getContactUnread(c.id), 0);
  const totalChannelsUnread = chatChannels.reduce((acc, ch) => acc + getChannelUnread(ch.id), 0);

  // Send Text Message
  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage({
      sender_id: currentUserId,
      sender_name: currentUserName,
      sender_avatar: currentUserAvatar,
      sender_role: currentUserRole,
      recipient_id: activeTargetId,
      recipient_name: activeChannel?.name || activeContact?.full_name || 'Team Member',
      type: 'text',
      text: inputText.trim()
    });

    setInputText('');
    setShowEmojiPicker(false);
  };

  // Send Voice Note
  const handleSendVoice = (audioUrl: string, duration: number) => {
    sendChatMessage({
      sender_id: currentUserId,
      sender_name: currentUserName,
      sender_avatar: currentUserAvatar,
      sender_role: currentUserRole,
      recipient_id: activeTargetId,
      recipient_name: activeChannel?.name || activeContact?.full_name || 'Team Member',
      type: 'voice',
      media_url: audioUrl,
      media_duration: duration,
      media_name: `VoiceNote_${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.wav`,
      text: '🎙️ Voice note recorded'
    });
    setIsRecordingVoice(false);
  };

  // Send Image or Video from Preset Gallery
  const handleSendMediaAsset = (url: string, type: 'image' | 'video', name: string) => {
    sendChatMessage({
      sender_id: currentUserId,
      sender_name: currentUserName,
      sender_avatar: currentUserAvatar,
      sender_role: currentUserRole,
      recipient_id: activeTargetId,
      recipient_name: activeChannel?.name || activeContact?.full_name || 'Team Member',
      type: type,
      media_url: url,
      media_name: name,
      text: type === 'image' ? `Shared image: ${name}` : `Shared video reel: ${name}`
    });
  };

  // Upload custom file from local device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      sendChatMessage({
        sender_id: currentUserId,
        sender_name: currentUserName,
        sender_avatar: currentUserAvatar,
        sender_role: currentUserRole,
        recipient_id: activeTargetId,
        recipient_name: activeChannel?.name || activeContact?.full_name || 'Team Member',
        type: type,
        media_url: base64Url,
        media_name: file.name,
        text: `Uploaded ${file.name}`
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    setShowAttachmentMenu(false);
  };

  const quickEmojis = ['👍', '❤️', '🔥', '😂', '🎉', '🚀', '👏', '✨', '💡', '🎨', '🎬'];

  return (
    <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden shadow-2xl flex flex-col md:flex-row h-[calc(100vh-150px)] min-h-[600px] bg-slate-950/80 backdrop-blur-xl">
      {/* ============================================================== */}
      {/* LEFT PANE: CONTACTS & CHANNELS LIST */}
      {/* On mobile: Hidden if an active chat is selected */}
      {/* ============================================================== */}
      <div
        className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-slate-800 bg-slate-900/60 shrink-0 ${
          activeTargetId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Current User Presence Card */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={currentUserAvatar}
                alt={currentUserName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/50"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                <span>{currentUserName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 font-normal">
                  You
                </span>
              </h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Circle className="w-2 h-2 fill-emerald-400" />
                <span>Online • {currentUserRole}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => updateUserPresence(currentUserId, true, 'Available')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
              title="Set Online"
            >
              <Circle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff, roles, channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500/60"
            />
          </div>
        </div>

        {/* Tab Switcher: Direct Messages vs Team Channels */}
        <div className="flex p-2 gap-1 border-b border-slate-800 bg-slate-950/40">
          <button
            type="button"
            onClick={() => setChatTab('dms')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              chatTab === 'dms'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Direct Messages ({filteredContacts.length})</span>
            {totalDmsUnread > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[10px] font-bold animate-pulse shadow-sm">
                {totalDmsUnread}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setChatTab('channels')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              chatTab === 'channels'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Channels ({filteredChannels.length})</span>
            {totalChannelsUnread > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[10px] font-bold animate-pulse shadow-sm">
                {totalChannelsUnread}
              </span>
            )}
          </button>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-2 space-y-1">
          {/* TAB 1: DIRECT MESSAGES WITH ALL STAFF */}
          {chatTab === 'dms' && (
            <>
              {filteredContacts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No staff members found</div>
              ) : (
                filteredContacts.map((contact) => {
                  const isSelected = activeTargetId === contact.id;
                  const unreadCount = getContactUnread(contact.id);
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setActiveTargetId(contact.id)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-fuchsia-600/20 border border-fuchsia-500/40 shadow-sm'
                          : 'hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={contact.avatar_url}
                            alt={contact.full_name}
                            className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-700"
                          />
                          {/* Online Status Dot */}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-slate-900 ${
                              contact.is_online
                                ? 'bg-emerald-400 animate-pulse'
                                : 'bg-slate-600'
                            }`}
                            title={contact.is_online ? 'Online' : 'Offline'}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white truncate">{contact.full_name}</h4>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-medium">
                              {contact.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {contact.last_message || contact.status_message || contact.department}
                          </p>
                        </div>
                      </div>

                      {/* Right Meta (Unread / Online Text) */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`text-[10px] font-semibold ${
                            contact.is_online ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {contact.is_online ? 'Online' : contact.last_seen}
                        </span>
                        {unreadCount > 0 ? (
                          <span className="min-w-5 h-5 px-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse shadow-md shadow-pink-500/50">
                            {unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* TAB 2: TEAM CHANNELS */}
          {chatTab === 'channels' && (
            <>
              <div className="pb-1.5">
                <button
                  type="button"
                  onClick={() => setShowCreateChannelModal(true)}
                  className="w-full py-2 px-3 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Channel</span>
                </button>
              </div>

              {filteredChannels.map((channel) => {
                const isSelected = activeTargetId === channel.id;
                const unreadCount = getChannelUnread(channel.id);
                const memberCount = channel.member_ids?.length || channel.members_count || 0;

                return (
                  <div
                    key={channel.id}
                    onClick={() => setActiveTargetId(channel.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-purple-600/20 border border-purple-500/40 shadow-sm'
                        : 'hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-800 to-indigo-950 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-300 font-bold">
                        <Hash className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white truncate">#{channel.name}</h4>
                          <span className="text-[10px] text-purple-400 font-mono">
                            {memberCount} members
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{channel.last_message || channel.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {unreadCount > 0 ? (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse shadow-md shadow-pink-500/50">
                          {unreadCount}
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setManagingChannel(channel);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-purple-600/40 text-slate-400 hover:text-purple-200 transition-colors"
                        title="Manage Channel Members (Add / Remove Staff)"
                      >
                        <Users className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT PANE: ACTIVE CHAT CONVERSATION */}
      {/* On mobile: Visible if activeTargetId is set */}
      {/* ============================================================== */}
      <div
        className={`flex-1 flex flex-col bg-slate-950/60 ${
          !activeTargetId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* CHAT HEADER */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800/90 bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Back Button */}
            <button
              type="button"
              onClick={() => setActiveTargetId('')}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              title="Back to Staff List"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Avatar or Channel Icon */}
            {isDirectMessage ? (
              <div className="relative shrink-0">
                <img
                  src={activeContact?.avatar_url || currentUserAvatar}
                  alt={activeContact?.full_name}
                  className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-700"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-slate-900 ${
                    activeContact?.is_online ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                  }`}
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
                <Hash className="w-5 h-5" />
              </div>
            )}

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 truncate">
                <span>{isDirectMessage ? activeContact?.full_name : `#${activeChannel?.name}`}</span>
                {isDirectMessage && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 font-medium border border-slate-700">
                    {activeContact?.role}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                {isDirectMessage ? (
                  <>
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        activeContact?.is_online ? 'bg-emerald-400' : 'bg-slate-500'
                      }`}
                    />
                    <span className={activeContact?.is_online ? 'text-emerald-300 font-semibold' : 'text-slate-400'}>
                      {activeContact?.is_online ? 'Online • Active now' : `Offline • ${activeContact?.last_seen}`}
                    </span>
                    <span className="hidden sm:inline text-slate-500">• {activeContact?.department}</span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setManagingChannel(activeChannel || null)}
                    className="hover:underline text-left flex items-center gap-1.5 group cursor-pointer"
                    title="Click to view, add, or remove team members"
                  >
                    <span className="text-purple-300 font-semibold group-hover:text-purple-200">
                      {activeChannel?.member_ids?.length || activeChannel?.members_count || 0} team members
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="truncate max-w-[200px] sm:max-w-xs text-slate-400 group-hover:text-slate-300">
                      {activeChannel?.description}
                    </span>
                  </button>
                )}
              </p>
            </div>
          </div>

          {/* Quick Actions (Call, Video, Media, Channel Members) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {!isDirectMessage && activeChannel && (
              <button
                type="button"
                onClick={() => setManagingChannel(activeChannel)}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 hover:border-purple-500 text-purple-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm group"
                title="Manage Channel Members (Add or Remove Team Members)"
              >
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Members</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300">
                  {activeChannel.member_ids?.length || activeChannel.members_count || 0}
                </span>
                <UserPlus className="w-3 h-3 text-purple-400 hidden md:inline ml-0.5" />
              </button>
            )}

            {isDirectMessage && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setCallModal({
                      isOpen: true,
                      type: 'voice',
                      name: activeContact?.full_name || 'Staff'
                    })
                  }
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Call</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCallModal({
                      isOpen: true,
                      type: 'video',
                      name: activeContact?.full_name || 'Staff'
                    })
                  }
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Video Call"
                >
                  <Video className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">Meet</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsMediaPickerOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-fuchsia-400 transition-colors"
              title="Share from Agency Media Vault"
            >
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
            </button>

            {/* Simulate Incoming Message Button for Testing */}
            <button
              type="button"
              onClick={() => {
                if (isDirectMessage && activeContact) {
                  simulateIncomingMessage(activeContact.id, undefined, currentUserId);
                } else {
                  simulateIncomingMessage(undefined, undefined, currentUserId);
                }
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-500/40 hover:border-pink-500 text-pink-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm group"
              title="Test incoming message audio notification and badge counters"
            >
              <Bell className="w-3.5 h-3.5 text-pink-400 group-hover:animate-bounce" />
              <span className="hidden sm:inline">Simulate Incoming 🔔</span>
            </button>
          </div>
        </div>

        {/* MESSAGES SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">Start the conversation!</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Send text messages, audio voice notes 🎙️, design images 🎨, or cinema video clips 🎬 with{' '}
                {isDirectMessage ? activeContact?.full_name : `#${activeChannel?.name}`}.
              </p>
            </div>
          ) : (
            currentMessages.map((msg) => {
              const isMine = msg.sender_id === currentUserId;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 group ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Sender Avatar for incoming messages */}
                  {!isMine && (
                    <img
                      src={msg.sender_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={msg.sender_name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-800 mb-1"
                    />
                  )}

                  {/* Message Bubble Container */}
                  <div className="flex flex-col max-w-[85%] sm:max-w-[70%]">
                    {/* Sender Name and Role Tag */}
                    {!isMine ? (
                      <div className="flex items-center gap-1.5 ml-1 mb-1">
                        <span className="text-[11px] font-bold text-purple-300">
                          {msg.sender_name}
                        </span>
                        {msg.sender_role && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-medium border border-slate-700/50">
                            {msg.sender_role}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5 mr-1 mb-1">
                        <span className="text-[11px] font-bold text-fuchsia-300">
                          {currentUserName} (You)
                        </span>
                      </div>
                    )}

                    <div
                      className={`relative p-3.5 rounded-3xl shadow-lg transition-all ${
                        isMine
                          ? 'bg-gradient-to-r from-purple-700 via-fuchsia-700 to-pink-600 text-white rounded-br-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-black/40'
                      }`}
                    >
                      {/* TYPE 1: TEXT MESSAGE */}
                      {msg.type === 'text' && (
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
                          {msg.text}
                        </p>
                      )}

                      {/* TYPE 2: VOICE MESSAGE */}
                      {msg.type === 'voice' && (
                        <div className="space-y-1">
                          <VoicePlayer
                            audioUrl={msg.media_url}
                            duration={msg.media_duration || 15}
                            isOwnMessage={isMine}
                          />
                          {msg.text && (
                            <p className="text-xs opacity-90 mt-1 pl-1 italic">{msg.text}</p>
                          )}
                        </div>
                      )}

                      {/* TYPE 3: IMAGE MESSAGE */}
                      {msg.type === 'image' && (
                        <div className="space-y-2">
                          <div
                            onClick={() =>
                              setLightboxData({
                                isOpen: true,
                                url: msg.media_url || '',
                                type: 'image',
                                name: msg.media_name
                              })
                            }
                            className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 hover:opacity-90 transition-opacity"
                          >
                            <img
                              src={msg.media_url}
                              alt={msg.media_name || 'Chat image'}
                              className="max-h-72 w-full object-cover rounded-2xl"
                            />
                          </div>
                          {msg.text && <p className="text-xs pt-1">{msg.text}</p>}
                        </div>
                      )}

                      {/* TYPE 4: VIDEO MESSAGE */}
                      {msg.type === 'video' && (
                        <div className="space-y-2">
                          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 max-w-sm">
                            <video
                              src={msg.media_url}
                              controls
                              className="w-full max-h-64 object-cover rounded-2xl"
                            />
                          </div>
                          {msg.text && <p className="text-xs pt-1">{msg.text}</p>}
                        </div>
                      )}

                      {/* Metadata: Time and Status */}
                      <div
                        className={`flex items-center justify-end gap-1.5 mt-1.5 text-[10px] font-mono ${
                          isMine ? 'text-white/80' : 'text-slate-400'
                        }`}
                      >
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMine && (
                          <span title={msg.status === 'read' ? 'Read (Double Tick)' : 'Sent (Single Tick)'} className="inline-flex items-center ml-0.5">
                            {msg.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                            ) : (
                              <Check className="w-3 h-3 text-white/70" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reactions Display */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {msg.reactions.map((r, ri) => (
                          <button
                            key={ri}
                            type="button"
                            onClick={() => toggleChatReaction(msg.id, r.emoji, currentUserName)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:border-purple-500/40"
                          >
                            <span>{r.emoji}</span>
                            <span>{r.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Reaction Trigger on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
                    <button
                      type="button"
                      onClick={() => toggleChatReaction(msg.id, '👍', currentUserName)}
                      className="p-1 hover:scale-125 transition-transform text-xs"
                      title="Like"
                    >
                      👍
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleChatReaction(msg.id, '❤️', currentUserName)}
                      className="p-1 hover:scale-125 transition-transform text-xs"
                      title="Love"
                    >
                      ❤️
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleChatReaction(msg.id, '🔥', currentUserName)}
                      className="p-1 hover:scale-125 transition-transform text-xs"
                      title="Fire"
                    >
                      🔥
                    </button>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ============================================================== */}
        {/* STICKY BOTTOM INPUT BAR */}
        {/* ============================================================== */}
        <div className="p-3 sm:p-4 border-t border-slate-800/90 bg-slate-900/90 backdrop-blur-md relative">
          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'image')}
          />
          <input
            type="file"
            ref={videoInputRef}
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'video')}
          />

          {/* Attachment Popup Menu */}
          {showAttachmentMenu && (
            <div className="absolute bottom-16 left-4 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-30 animate-in fade-in space-y-1">
              <button
                type="button"
                onClick={() => {
                  imageInputRef.current?.click();
                  setShowAttachmentMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 text-left"
              >
                <ImageIcon className="w-4 h-4 text-fuchsia-400" />
                <span>Upload Image</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  videoInputRef.current?.click();
                  setShowAttachmentMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 text-left"
              >
                <VideoIcon className="w-4 h-4 text-indigo-400" />
                <span>Upload Video</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMediaPickerOpen(true);
                  setShowAttachmentMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 text-left"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Pick from Agency Vault</span>
              </button>
            </div>
          )}

          {/* Quick Emoji Bar */}
          {showEmojiPicker && (
            <div className="mb-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 overflow-x-auto shadow-xl">
              {quickEmojis.map((emoji, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputText((prev) => prev + emoji)}
                  className="text-lg p-1.5 hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Live Voice Recording Console */}
          {isRecordingVoice ? (
            <VoiceRecorder
              onSend={handleSendVoice}
              onCancel={() => setIsRecordingVoice(false)}
            />
          ) : (
            <form onSubmit={handleSendText} className="flex items-center gap-2">
              {/* Attachment Plus Button */}
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/40 transition-colors shrink-0"
                title="Attach image or video"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors shrink-0 hidden sm:flex"
                title="Add emoji"
              >
                <Smile className="w-4 h-4" />
              </button>

              {/* Main Message Text Input */}
              <input
                type="text"
                placeholder={
                  isDirectMessage
                    ? `Message ${activeContact?.full_name}...`
                    : `Message #${activeChannel?.name}...`
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500/60 focus:ring-1 focus:ring-fuchsia-500/40 transition-all"
              />

              {/* Mic / Voice Note Record Button */}
              <button
                type="button"
                onClick={() => setIsRecordingVoice(true)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors shrink-0"
                title="Record voice note"
              >
                <Mic className="w-4 h-4 text-purple-400" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Media Fullscreen Lightbox */}
      <MediaLightbox
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData({ isOpen: false, url: '', type: 'image' })}
        mediaUrl={lightboxData.url}
        mediaType={lightboxData.type}
        mediaName={lightboxData.name}
      />

      {/* Preset Agency Media Picker */}
      <SampleMediaPicker
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleSendMediaAsset}
      />

      {/* Call Simulator Modal */}
      {callModal?.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-3xl glass-panel bg-slate-900 border border-slate-800 shadow-2xl p-6 max-w-sm w-full text-center space-y-4 animate-in zoom-in-95">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white mx-auto shadow-xl">
                {callModal.type === 'voice' ? <Phone className="w-8 h-8 animate-bounce" /> : <Video className="w-8 h-8 animate-pulse" />}
              </div>
              <span className="absolute bottom-0 right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Calling {callModal.name}...</h3>
              <p className="text-xs text-slate-400 mt-1">
                Connecting high-definition {callModal.type === 'voice' ? 'VoIP Audio' : 'Video Stream'}
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setCallModal(null)}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30"
              >
                <Phone className="w-4 h-4 rotate-[135deg]" />
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Channel Members Management Modal (Add / Remove Team Members) */}
      <ChannelMembersModal
        channel={managingChannel ? (chatChannels.find(c => c.id === managingChannel.id) || managingChannel) : null}
        isOpen={Boolean(managingChannel)}
        onClose={() => setManagingChannel(null)}
        contacts={chatContacts}
        onAddMember={addChannelMember}
        onRemoveMember={removeChannelMember}
        currentUserId={currentUserId}
      />

      {/* Create New Channel Modal */}
      <CreateChannelModal
        isOpen={showCreateChannelModal}
        onClose={() => setShowCreateChannelModal(false)}
        contacts={chatContacts}
        onCreateChannel={createChannel}
        onChannelCreated={(newChanId) => {
          setActiveTargetId(newChanId);
          setChatTab('channels');
        }}
      />
    </div>
  );
};
