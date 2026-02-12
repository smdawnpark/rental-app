import { useState, useMemo } from 'react';
import { Item, RentalHistory } from './types';
import { initialItems } from './data/initialItems';
import { ItemCard } from './components/ItemCard';
import { RentModal } from './components/RentModal';
import { AddItemModal } from './components/AddItemModal';
import { HistoryPanel } from './components/HistoryPanel';

type FilterStatus = 'all' | 'available' | 'rented';

export function App() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [history, setHistory] = useState<RentalHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filterStatus === 'all' || item.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: items.length,
    available: items.filter(i => i.status === 'available').length,
    rented: items.filter(i => i.status === 'rented').length,
  }), [items]);

  const handleRent = (borrower: string, dueDate: Date) => {
    if (!selectedItem) return;
    
    setItems(prev => prev.map(item => 
      item.id === selectedItem.id 
        ? { ...item, status: 'rented' as const, borrower, rentedAt: new Date(), dueDate }
        : item
    ));
    
    setHistory(prev => [...prev, {
      id: Date.now().toString(),
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      borrower,
      rentedAt: new Date(),
      status: 'active',
    }]);
    
    setSelectedItem(null);
  };

  const handleReturn = (item: Item) => {
    setItems(prev => prev.map(i => 
      i.id === item.id 
        ? { ...i, status: 'available' as const, borrower: undefined, rentedAt: undefined, dueDate: undefined }
        : i
    ));
    
    setHistory(prev => prev.map(h => 
      h.itemId === item.id && h.status === 'active'
        ? { ...h, status: 'returned' as const, returnedAt: new Date() }
        : h
    ));
  };

  const handleDelete = (item: Item) => {
    if (item.status === 'rented') {
      alert('대여 중인 물품은 삭제할 수 없습니다. 먼저 반납해주세요.');
      return;
    }
    if (confirm(`"${item.name}" 물품을 삭제하시겠습니까?`)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleAddItem = (name: string, category: string, description: string, imageUrl: string) => {
    const newItem: Item = {
      id: Date.now().toString(),
      name,
      category,
      description,
      imageUrl,
      status: 'available',
    };
    setItems(prev => [...prev, newItem]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2.5 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">물품 대여 반납 시스템</h1>
                <p className="text-sm text-gray-500">Equipment Rental Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition flex items-center gap-2"
              >
                <span>📋</span>
                <span className="hidden sm:inline">대여 이력</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition flex items-center gap-2"
              >
                <span>+</span>
                <span>물품 추가</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">전체 물품</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <p className="text-sm text-green-600 mb-1">대여 가능</p>
            <p className="text-2xl font-bold text-green-600">{stats.available}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
            <p className="text-sm text-orange-600 mb-1">대여 중</p>
            <p className="text-2xl font-bold text-orange-600">{stats.rented}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="물품명, 카테고리로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'available', 'rented'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? '전체' : status === 'available' ? '대여 가능' : '대여 중'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <span className="text-6xl block mb-4">📦</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">물품이 없습니다</h3>
            <p className="text-gray-500">검색 조건을 변경하거나 새 물품을 추가해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onRent={() => setSelectedItem(item)}
                onReturn={handleReturn}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedItem && (
        <RentModal
          item={selectedItem}
          onConfirm={handleRent}
          onClose={() => setSelectedItem(null)}
        />
      )}
      
      {showAddModal && (
        <AddItemModal
          onConfirm={handleAddItem}
          onClose={() => setShowAddModal(false)}
        />
      )}
      
      {showHistory && (
        <HistoryPanel
          history={history}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
