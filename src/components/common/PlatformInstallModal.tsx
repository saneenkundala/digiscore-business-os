import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  Apple,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles,
  ExternalLink,
  Monitor,
  Check
} from 'lucide-react';
import { Modal } from './Modal';

interface PlatformInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlatformInstallModal: React.FC<PlatformInstallModalProps> = ({ isOpen, onClose }) => {
  const [activePlatform, setActivePlatform] = useState<'windows' | 'iphone' | 'mac' | 'android'>('windows');

  // Detect user's current operating system
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.userAgent) {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setActivePlatform('iphone');
      } else if (/android/.test(ua)) {
        setActivePlatform('android');
      } else if (/macintosh|mac os x/.test(ua)) {
        setActivePlatform('mac');
      } else {
        setActivePlatform('windows');
      }
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Install DIGI SCORE App Everywhere"
      subtitle="Cross-platform PWA support for Windows, iPhone, Mac, and Android"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Device selector tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl glass-panel border border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={() => setActivePlatform('windows')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activePlatform === 'windows'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Windows</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('iphone')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activePlatform === 'iphone'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>iPhone (iOS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('mac')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activePlatform === 'mac'
                ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white border border-slate-600 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Mac (macOS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('android')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activePlatform === 'android'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android</span>
          </button>
        </div>

        {/* Dynamic platform instructions */}
        <div className="rounded-2xl glass-panel border border-slate-800 p-5 space-y-4 bg-slate-900/40">
          {/* WINDOWS */}
          {activePlatform === 'windows' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Install on Windows 10 & 11 (PC / Laptop)</h4>
                  <p className="text-xs text-slate-400">Run as a standalone desktop application with desktop shortcuts</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Open in Chrome or Edge:</strong> Look at the right side of the address bar at the top of your browser.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Click "Install App":</strong> Click the computer icon with down arrow (⊕ or ⬇) or click the 3 dots ➔ <span className="text-fuchsia-400 font-semibold">"Install DIGI SCORE Business OS"</span>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Pin to Taskbar & Start Menu:</strong> You can launch DIGI SCORE anytime without opening browser tabs!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IPHONE (iOS) */}
          {activePlatform === 'iphone' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Install on iPhone & iPad (Apple iOS)</h4>
                  <p className="text-xs text-slate-400">Full-screen native app without Safari address bars and full touch gestures</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Open in Safari:</strong> Make sure you are viewing this page inside the Apple Safari browser.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Tap Share Button:</strong> Tap the <span className="text-blue-400 font-bold">Share icon (square with arrow 📤)</span> at the bottom bar of Safari.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Tap "Add to Home Screen":</strong> Scroll down the share menu and tap <span className="text-fuchsia-400 font-semibold">"Add to Home Screen" ➕</span>, then tap <strong>Add</strong>.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>The DIGI SCORE app icon will appear on your iPhone home screen with native full-screen mode!</span>
                </div>
              </div>
            </div>
          )}

          {/* MAC (macOS) */}
          {activePlatform === 'mac' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-700/40 border border-slate-600 flex items-center justify-center text-white font-bold">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Install on Mac (macOS Sonoma / Ventura)</h4>
                  <p className="text-xs text-slate-400">Native window mode with Mac Dock icon and macOS notifications</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Safari:</strong> In the top Mac menu bar, click <strong>File</strong> ➔ <span className="text-fuchsia-400 font-semibold">"Add to Dock..."</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Google Chrome:</strong> Click the 3 dots (⋮) in the top-right ➔ <strong>Save and Share</strong> ➔ <span className="text-fuchsia-400 font-semibold">"Install DIGI SCORE Business OS"</span>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Launch from Spotlight & Dock:</strong> Open via Command+Space or directly from your Mac Dock.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANDROID */}
          {activePlatform === 'android' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Install on Android (Samsung, Pixel, OnePlus, Xiaomi)</h4>
                  <p className="text-xs text-slate-400">Install APK-like Progressive Web App with audio chimes and offline support</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Open in Chrome:</strong> Open this URL in Google Chrome on your Android device.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Tap Menu (3 Dots):</strong> Tap the 3 vertical dots (⋮) in the top-right corner of Chrome.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Tap "Install App" or "Add to Home screen":</strong> Confirm the prompt to install the native app onto your phone.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-white block">Offline Ready</span>
            <span className="text-[10px] text-slate-400">Web Audio API</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-white block">Safe Area Notch</span>
            <span className="text-[10px] text-slate-400">iOS Dynamic Island</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-white block">Thumb Nav Bar</span>
            <span className="text-[10px] text-slate-400">Mobile Bottom Nav</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-white block">Zero App Store Fee</span>
            <span className="text-[10px] text-slate-400">Instant Updates</span>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95"
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </Modal>
  );
};
