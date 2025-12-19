import React, { useState, useEffect } from 'react';
import { NameplateData, AppState } from './types';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { generateNameplateImage } from './services/geminiService';
import { Crown, Key } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    const checkKey = async () => {
       if (window.aistudio) {
         const has = await window.aistudio.hasSelectedApiKey();
         setHasApiKey(has);
       } else {
         // If aistudio is not available, assume we are in a dev environment with pre-configured env vars,
         // or effectively just bypass the UI check, though the service call might fail if key is missing.
         setHasApiKey(true);
       }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success after dialog closes or trigger returns
      setHasApiKey(true);
    }
  };

  const handleGenerate = async (data: NameplateData) => {
    setAppState(AppState.GENERATING);
    try {
      const imageUrl = await generateNameplateImage(data);
      setGeneratedImage(imageUrl);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setGeneratedImage(null);
  };

  if (!hasApiKey) {
    return (
        <div className="min-h-screen bg-[#0a0502] text-amber-50 flex items-center justify-center p-4 selection:bg-amber-500/30">
             <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" 
                 style={{
                   backgroundImage: `radial-gradient(circle at 50% 0%, #451a03 0%, #0a0502 60%)`
                 }}>
             </div>
             <div className="relative z-10 max-w-md w-full text-center p-8 bg-neutral-900/80 backdrop-blur-md border border-amber-900/50 rounded-2xl shadow-2xl">
                 <div className="inline-flex items-center justify-center p-4 rounded-full bg-amber-900/20 border border-amber-700/50 mb-6 shadow-lg">
                     <Crown className="w-10 h-10 text-amber-500" />
                 </div>
                 <h1 className="text-3xl font-bold mb-4 serif-font bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                    Chế Tác Biển Tên Cao Cấp
                 </h1>
                 <p className="text-neutral-400 mb-8 leading-relaxed">
                    Để sử dụng mô hình tạo ảnh chất lượng cao <b>Nano Banana Pro</b> (Gemini 3 Pro) với khả năng xử lý Tiếng Việt chính xác, vui lòng kết nối API Key của bạn.
                 </p>
                 <button 
                    onClick={handleSelectKey} 
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-900/50"
                 >
                     <Key className="w-5 h-5" />
                     Kết Nối API Key
                 </button>
                 <div className="mt-6 text-xs text-neutral-600">
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-amber-500 transition-colors">
                        Xem thông tin về thanh toán
                    </a>
                 </div>
             </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0502] text-amber-50 selection:bg-amber-500/30 selection:text-amber-100">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" 
           style={{
             backgroundImage: `radial-gradient(circle at 50% 0%, #451a03 0%, #0a0502 60%)`
           }}>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-b from-amber-800/30 to-amber-900/10 border border-amber-700/30 mb-6 shadow-lg shadow-amber-900/20 backdrop-blur-sm">
            <Crown className="w-8 h-8 text-amber-500 mr-2" />
            <span className="text-amber-200 tracking-widest text-xs font-bold uppercase">AI Dành Cho Lãnh Đạo</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent serif-font drop-shadow-md">
            Kiến Tạo Biển Chức Danh Cao Cấp
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-light">
            Chế tác biển tên gỗ gụ và vàng 3D siêu thực với chân dung chạm nổi đẳng cấp dành cho bạn.
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-2 space-y-6">
            <InputForm onSubmit={handleGenerate} appState={appState} />
            
            {/* Disclaimer */}
            <div className="text-xs text-neutral-600 text-center px-4">
              <p>Được hỗ trợ bởi mô hình <b>Gemini 3 Pro Image (Nano Banana Pro)</b>.</p>
              <p className="mt-1">Để có kết quả tốt nhất, vui lòng tải lên ảnh chân dung rõ nét, nhìn thẳng.</p>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-3">
             <ResultDisplay 
                imageUrl={generatedImage} 
                appState={appState} 
                onReset={handleReset} 
             />
          </div>
          
        </div>
      </div>
      
      {/* Decorative footer line */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-800 to-transparent opacity-50"></div>
    </div>
  );
};

export default App;
