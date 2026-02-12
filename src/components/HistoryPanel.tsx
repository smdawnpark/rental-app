import { RentalHistory } from '../types';
import { cn } from '../utils/cn';

interface HistoryPanelProps {
  history: RentalHistory[];
  onClose: () => void;
}

export function HistoryPanel({ history, onClose }: HistoryPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gray-800 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">대여 이력</h2>
            <p className="text-gray-300 text-sm mt-1">전체 대여/반납 기록</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-5xl block mb-4">📝</span>
              <p>대여 이력이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice().reverse().map((record) => (
                <div
                  key={record.id}
                  className={cn(
                    "p-4 rounded-xl border flex items-center gap-4",
                    record.status === 'active' 
                      ? "bg-orange-50 border-orange-200" 
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-xl",
                    record.status === 'active' 
                      ? "bg-orange-100" 
                      : "bg-green-100"
                  )}>
                    {record.status === 'active' ? '📤' : '📥'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{record.itemName}</h4>
                    <p className="text-sm text-gray-600">
                      대여자: {record.borrower}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      대여일: {record.rentedAt.toLocaleDateString('ko-KR')}
                      {record.returnedAt && (
                        <> • 반납일: {record.returnedAt.toLocaleDateString('ko-KR')}</>
                      )}
                    </p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    record.status === 'active' 
                      ? "bg-orange-100 text-orange-700" 
                      : "bg-green-100 text-green-700"
                  )}>
                    {record.status === 'active' ? '대여 중' : '반납 완료'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
