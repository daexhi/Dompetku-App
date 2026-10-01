import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, X, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable || (!isIOS && !isInstalled)) {
    return (
      <button
        onClick={isInstallable ? install : () => {
          alert('Ketuk ikon tiga titik (⋮) di pojok kanan atas browser Chrome, lalu pilih "Instal aplikasi" atau "Tambahkan ke layar utama".');
        }}
        className="flex items-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-[2rem] font-bold transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20 group"
      >
        <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
          <Smartphone size={20} />
        </div>
        <div className="text-left">
          <p className="text-sm">Install App</p>
          <p className="text-[10px] opacity-70">Akses lebih cepat di HP</p>
        </div>
        <Download size={18} className="ml-auto" />
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-3 w-full bg-slate-800 hover:bg-slate-700 text-white p-5 rounded-[2rem] font-bold transition-all active:scale-[0.98] border border-slate-700 shadow-lg group"
        >
          <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
            <Smartphone size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm">Install on iOS</p>
            <p className="text-[10px] opacity-70">Gunakan sebagai aplikasi</p>
          </div>
          <Share size={18} className="ml-auto" />
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowIOSGuide(false)} />
            <div className="relative bg-slate-900 border border-slate-800 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-black text-white">Install di iPhone</h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-500 hover:text-white p-1">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-black shrink-0">1</div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Tap tombol <strong className="text-white">Share</strong> (kotak dengan panah ke atas) di bar bawah Safari.
                  </p>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-black shrink-0">2</div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Scroll ke bawah dan pilih <strong className="text-white">Add to Home Screen</strong>.
                  </p>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-black shrink-0">3</div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Klik <strong className="text-white">Add</strong> di pojok kanan atas.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-8 w-full py-4 bg-slate-800 rounded-2xl font-bold text-slate-300 active:scale-95 transition-all border border-slate-700"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
