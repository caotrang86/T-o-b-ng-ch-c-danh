import React, { useState, useRef } from 'react';
import { NameplateData, AppState } from '../types.ts';
import { Camera, Briefcase, Phone, User, Upload } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: NameplateData) => void;
  appState: AppState;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, appState }) => {
  const [formData, setFormData] = useState<NameplateData>({
    name: '',
    jobTitle: '',
    phone: '',
    imageBase64: null,
    imageMimeType: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Extract Base64 data and mime type
        const matches = result.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          setPreviewUrl(result);
          setFormData((prev) => ({
            ...prev,
            imageMimeType: matches[1],
            imageBase64: matches[2],
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (appState !== AppState.GENERATING) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-neutral-900/80 backdrop-blur-md border border-amber-900/50 rounded-2xl p-6 shadow-2xl shadow-black/50">
      <h2 className="text-2xl font-bold text-amber-500 mb-6 serif-font tracking-wide border-b border-amber-900/50 pb-4">
        Thông Tin Lãnh Đạo
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="block text-amber-200 text-sm font-medium mb-1">Ảnh Chân Dung Tham Khảo</label>
          <div 
            className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group
              ${previewUrl ? 'border-amber-500/50 bg-neutral-800' : 'border-neutral-700 hover:border-amber-500 hover:bg-neutral-800'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            {previewUrl ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-amber-500 shadow-lg">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Upload className="text-white w-6 h-6" />
                </div>
              </div>
            ) : (
              <div className="text-center">
                 <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-900/30 transition-colors">
                    <Camera className="w-8 h-8 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                 </div>
                 <p className="text-neutral-400 text-sm group-hover:text-amber-200">Nhấn để tải ảnh lên</p>
                 <p className="text-xs text-neutral-500 mt-1">Ảnh độ phân giải cao sẽ tốt nhất</p>
              </div>
            )}
          </div>
        </div>

        {/* Text Inputs */}
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-amber-600/70" />
            <input
              type="text"
              name="name"
              placeholder="Họ và Tên (ví dụ: Lê Hiếu)"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-neutral-800 border border-neutral-700 text-amber-100 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder-neutral-500"
            />
          </div>

          <div className="relative">
            <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-amber-600/70" />
            <input
              type="text"
              name="jobTitle"
              placeholder="Chức danh (ví dụ: Giám đốc Kinh doanh)"
              required
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full bg-neutral-800 border border-neutral-700 text-amber-100 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder-neutral-500"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-amber-600/70" />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-neutral-800 border border-neutral-700 text-amber-100 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder-neutral-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={appState === AppState.GENERATING || !formData.imageBase64}
          className={`w-full py-4 rounded-lg font-bold text-lg tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg
            ${appState === AppState.GENERATING || !formData.imageBase64
              ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-600 to-amber-800 text-white hover:from-amber-500 hover:to-amber-700 shadow-amber-900/50 hover:shadow-amber-900/80 transform hover:-translate-y-0.5'
            }`}
        >
          {appState === AppState.GENERATING ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang Chế Tác...
            </>
          ) : (
            'Tạo Biển Chức Danh'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;