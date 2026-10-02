import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  Shield,
  LogOut,
  X,
  CheckCircle2,
  Camera,
  Upload,
  Check,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/utils';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const PRESET_AVATARS = [
  { label: 'Executive CEO', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300' },
  { label: 'Creative Designer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' },
  { label: 'Operations Lead', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' },
  { label: 'Sales Director', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
  { label: 'Tech Specialist', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300' },
  { label: 'Media Producer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300' },
  { label: 'Marketing Head', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' },
  { label: 'Finance Controller', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300' }
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onLogout }) => {
  const { currentUser, role, updateUserProfilePhoto } = useAuth();
  const { updateStaffPhoto } = useData();

  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !currentUser) return null;

  const currentAvatar = selectedPhoto || currentUser.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setSelectedPhoto(base64);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSavePhoto = () => {
    if (!selectedPhoto) return;
    updateUserProfilePhoto(currentUser.id, selectedPhoto);
    updateStaffPhoto(currentUser.id, selectedPhoto);
    updateStaffPhoto(currentUser.email, selectedPhoto);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditingPhoto(false);
      setSelectedPhoto(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl glass-panel bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Profile Summary with Photo */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative group shrink-0">
            <img
              src={currentAvatar}
              alt={currentUser.full_name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-xl"
            />
            {/* Change Photo Trigger Badge */}
            <button
              type="button"
              onClick={() => setIsEditingPhoto(!isEditingPhoto)}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/50 border border-purple-400 transition-transform hover:scale-105"
              title="Add or Change Staff Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center sm:text-left min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-lg font-bold text-white truncate">{currentUser.full_name}</h3>
              <button
                type="button"
                onClick={() => setIsEditingPhoto(!isEditingPhoto)}
                className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[11px] font-semibold border border-purple-500/30 transition-colors self-center sm:self-auto"
              >
                <Camera className="w-3 h-3" />
                <span>{isEditingPhoto ? 'Hide Photo Options' : 'Change Photo'}</span>
              </button>
            </div>

            <p className="text-xs text-purple-300 font-medium truncate mt-0.5">
              {currentUser.designation || 'Staff Associate'}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                {role}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Session
              </span>
            </div>
          </div>
        </div>

        {/* PHOTO EDITING / UPLOAD CONSOLE */}
        {isEditingPhoto && (
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/40 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Update Staff Profile Photo
                </h4>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/30"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Upload any image from your computer/phone, or select a preset professional portrait below:
            </p>

            {/* Preset Avatars Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
              {PRESET_AVATARS.map((avatar, idx) => {
                const isCurrent = currentAvatar === avatar.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhoto(avatar.url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      isCurrent
                        ? 'border-purple-400 ring-2 ring-purple-500/60 scale-105'
                        : 'border-slate-800 hover:border-slate-600 opacity-75 hover:opacity-100'
                    }`}
                    title={avatar.label}
                  >
                    <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                    {isCurrent && (
                      <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-purple-600 rounded-full flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Save Photo CTA */}
            {selectedPhoto && (
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Photo preview ready
                </span>
                <button
                  type="button"
                  onClick={handleSavePhoto}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile Photo</span>
                </button>
              </div>
            )}

            {saveSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Profile photo updated successfully across all profile bars!</span>
              </div>
            )}
          </div>
        )}

        {/* Details Grid */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-purple-400" /> Work Email:
            </span>
            <span className="font-semibold text-white truncate max-w-[200px]">{currentUser.email}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-pink-400" /> Phone:
            </span>
            <span className="font-semibold text-white">{currentUser.phone || '+91 98470 12345'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-blue-400" /> Department:
            </span>
            <span className="font-semibold text-white">{currentUser.department || 'Digital Operations'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Joining Date:
            </span>
            <span className="font-semibold text-white">{formatDate(currentUser.joining_date || currentUser.created_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Close Window
          </button>

          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
