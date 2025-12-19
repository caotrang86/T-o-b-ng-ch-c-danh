import React from 'react';
import { Download, RefreshCw, Share2 } from 'lucide-react';
import { AppState } from '../types.ts';

interface ResultDisplayProps {
  imageUrl: string | null;
  appState: AppState;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, appState, onReset }) => {
  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'luxury-nameplate.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (appState === AppState.IDLE) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-neutral-900/40 border-2 border-dashed border-neutral-700 rounded-2xl">
        <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">💎</span>
        </div>
        <h3 className="text-xl font-bold text-neutral-400 mb-2">Sẵn Sàng Chế Tác</h3>
        <p className="text-neutral-500 text-center max-w-sm">
          Nhập thông tin và tải ảnh lên để tạo biển chức danh gỗ gụ 3D sang trọng siêu thực.
        </p>
      </div>
    );
  }

  if (appState === AppState.GENERATING) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-neutral-900/40 border border-amber-900/30 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 to-transparent animate-pulse"></div>
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-6 relative z-10"></div>
        <h3 className="text-2xl font-bold text-amber-500 mb-2 serif-font relative z-10">Đang Chế Tác Tuyệt Phẩm</h3>
        <p className="text-amber-200/60 text-center animate-pulse relative z-10">
          Đang điêu khắc chi tiết gỗ... <br/>
          Đang dát vàng kim loại... <br/>
          Đang đánh bóng bề mặt...
        </p>
      </div>
    );
  }

  if (appState === AppState.ERROR) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-red-900/20 border border-red-500/30 rounded-2xl">
        <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl text-red-400">⚠</span>
        </div>
        <h3 className="text-xl font-bold text-red-400 mb-2">Chế Tác Thất Bại</h3>
        <p className="text-red-200/60 text-center mb-6">
          Đã xảy ra lỗi trong quá trình tạo. Vui lòng thử lại.
        </p>
        <button 
            onClick={onReset}
            className="px-6 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 rounded-lg transition-colors"
        >
            Đặt Lại Ứng Dụng
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="relative group rounded-xl overflow-hidden shadow-2xl shadow-black border border-amber-900/50 bg-black">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Generated Luxury Nameplate" 
            className="w-full h-auto object-contain max-h-[600px] transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
           <p className="text-amber-100 font-medium">✨ Kết Xuất Cao Cấp (Premium Render)</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleDownload}
          className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-5 h-5" />
          Tải Xuống Ảnh 8K
        </button>
        
        <button
          onClick={onReset}
          className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all border border-neutral-700"
        >
          <RefreshCw className="w-5 h-5" />
          Tạo Mới
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;