import { useState } from 'react';

interface AddItemModalProps {
  onConfirm: (name: string, category: string, description: string, imageUrl: string) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['💻', '📽️', '🪑', '📷', '🎤', '📋', '🔌', '🔊', '📦', '🎒', '⌨️', '🖥️', '📱', '🎧', '🔧'];
const CATEGORY_OPTIONS = ['전자기기', '가구', '음향장비', '사무용품', '전기용품', '기타'];

export function AddItemModal({ onConfirm, onClose }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(EMOJI_OPTIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && category && description.trim()) {
      onConfirm(name.trim(), category, description.trim(), imageUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-violet-600 text-white p-6">
          <h2 className="text-xl font-bold">새 물품 추가</h2>
          <p className="text-violet-100 text-sm mt-1">등록할 물품 정보를 입력해주세요</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              아이콘 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setImageUrl(emoji)}
                  className={`text-2xl p-2 rounded-lg transition ${
                    imageUrl === emoji 
                      ? 'bg-violet-100 ring-2 ring-violet-500' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              물품명 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="물품 이름을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리 *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition bg-white"
              required
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명 *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="물품에 대한 상세 설명을 입력하세요"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition resize-none"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition"
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
