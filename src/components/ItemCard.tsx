import { Item } from '../types';
import { cn } from '../utils/cn';

interface ItemCardProps {
  item: Item;
  onRent: (item: Item) => void;
  onReturn: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function ItemCard({ item, onRent, onReturn, onDelete }: ItemCardProps) {
  const isAvailable = item.status === 'available';

  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-lg border overflow-hidden transition-all hover:shadow-xl",
      isAvailable ? "border-gray-200" : "border-orange-200 bg-orange-50/30"
    )}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="text-5xl mb-4">{item.imageUrl}</div>
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold",
            isAvailable 
              ? "bg-green-100 text-green-700" 
              : "bg-orange-100 text-orange-700"
          )}>
            {isAvailable ? '대여 가능' : '대여 중'}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md mb-2">
          {item.category}
        </span>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
        
        {!isAvailable && (
          <div className="bg-orange-100 rounded-lg p-3 mb-4 text-sm">
            <p className="text-orange-800">
              <span className="font-semibold">대여자:</span> {item.borrower}
            </p>
            <p className="text-orange-700 text-xs mt-1">
              반납 예정: {item.dueDate?.toLocaleDateString('ko-KR')}
            </p>
          </div>
        )}
        
        <div className="flex gap-2">
          {isAvailable ? (
            <button
              onClick={() => onRent(item)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors"
            >
              대여하기
            </button>
          ) : (
            <button
              onClick={() => onReturn(item)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors"
            >
              반납하기
            </button>
          )}
          <button
            onClick={() => onDelete(item)}
            className="px-4 py-2.5 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-xl transition-colors"
            title="삭제"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
