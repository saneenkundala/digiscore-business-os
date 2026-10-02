import React from 'react';
import { X, Download, ExternalLink, Image, Video, Sparkles } from 'lucide-react';
import { Modal } from '../../common/Modal';

interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  mediaName?: string;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  isOpen,
  onClose,
  mediaUrl,
  mediaType,
  mediaName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-white">
          {mediaType === 'image' ? <Image className="w-5 h-5 text-fuchsia-400" /> : <Video className="w-5 h-5 text-indigo-400" />}
          <span className="text-sm font-bold truncate max-w-xs sm:max-w-md">{mediaName || 'Media File'}</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={mediaName || 'media'}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors"
            title="Download Media"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="max-w-5xl max-h-[85vh] flex items-center justify-center p-2">
        {mediaType === 'image' ? (
          <img
            src={mediaUrl}
            alt={mediaName || 'Chat Image'}
            className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800"
          />
        ) : (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="max-h-[80vh] max-w-full rounded-2xl shadow-2xl border border-slate-800"
          />
        )}
      </div>
    </div>
  );
};

// Preset Media Gallery Picker for quick sharing in Chat
interface SampleMediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mediaUrl: string, mediaType: 'image' | 'video', mediaName: string) => void;
}

export const SampleMediaPicker: React.FC<SampleMediaPickerProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const sampleImages = [
    {
      name: 'Sheikhs_Gold_Ramadan_Banner.png',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      tag: 'Ad Creative'
    },
    {
      name: 'Odell_Paris_Luxury_Render.jpg',
      url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
      tag: 'Packaging 3D'
    },
    {
      name: 'DIGISCORE_Typography_System.png',
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
      tag: 'Brand Identity'
    },
    {
      name: 'Kerala_Spices_Reel_Cover.jpg',
      url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
      tag: 'Reel Cover'
    }
  ];

  const sampleVideos = [
    {
      name: 'Sheikhs_Gold_Prestige_Reel.mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      tag: 'Cinema 4K Reel'
    },
    {
      name: 'Brand_Motion_Ident_V1.mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      tag: 'Motion Graphics'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Agency Media Asset" maxWidth="xl">
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Pick an asset from the DIGI SCORE Creative Asset Library or upload from device.
        </p>

        {/* Creative Images */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5" />
            <span>Design Creatives & Mockups</span>
          </span>

          <div className="grid grid-cols-2 gap-3">
            {sampleImages.map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  onSelect(img.url, 'image', img.name);
                  onClose();
                }}
                className="group relative cursor-pointer rounded-xl overflow-hidden border border-slate-800 hover:border-fuchsia-500/50 transition-all bg-slate-950"
              >
                <img src={img.url} alt={img.name} className="w-full h-24 object-cover group-hover:scale-105 transition-transform" />
                <div className="p-2">
                  <span className="text-[10px] text-fuchsia-300 font-semibold">{img.tag}</span>
                  <p className="text-xs font-bold text-white truncate">{img.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Reels */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" />
            <span>Short-form Reels & Video Clips</span>
          </span>

          <div className="grid grid-cols-2 gap-3">
            {sampleVideos.map((vid, i) => (
              <div
                key={i}
                onClick={() => {
                  onSelect(vid.url, 'video', vid.name);
                  onClose();
                }}
                className="group relative cursor-pointer rounded-xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all bg-slate-950 p-3 flex flex-col justify-between h-24"
              >
                <div>
                  <span className="text-[10px] text-indigo-300 font-semibold">{vid.tag}</span>
                  <p className="text-xs font-bold text-white truncate">{vid.name}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Click to send</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
