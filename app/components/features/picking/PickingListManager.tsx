'use client';

import { useState, useEffect } from 'react';
import NexusCard from '@/app/components/ui/NexusCard';
import NexusButton from '@/app/components/ui/NexusButton';
import BaseModal from '@/app/components/ui/BaseModal';
import { useToast } from '@/app/components/features/notifications/ToastProvider';

interface PickingItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  location: string;
  quantity: number;
  pickedQuantity: number;
  status: 'pending' | 'picking' | 'completed';
}

interface PickingList {
  id: string;
  orderId: string;
  customerName: string;
  shippingMethod: string;
  priority: 'normal' | 'high' | 'urgent';
  items: PickingItem[];
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export default function PickingListManager() {
  const [pickingLists, setPickingLists] = useState<PickingList[]>([]);
  const [selectedList, setSelectedList] = useState<PickingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [listToStart, setListToStart] = useState<PickingList | null>(null);
  const [listToComplete, setListToComplete] = useState<PickingList | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchPickingLists();
  }, []);

  const fetchPickingLists = async () => {
    setLoading(true);
    try {
      // モックデータ
      const mockLists: PickingList[] = [
        {
          id: '1',
          orderId: 'ORD-2024-001',
          customerName: '田中太郎',
          shippingMethod: 'ヤマト運輸',
          priority: 'urgent',
          status: 'pending',
          items: [
            {
              id: '1-1',
              productId: 'TWD-CAM-001',
              productName: 'Canon EOS R5',
              sku: 'TWD-CAM-001',
              location: 'A-01',
              quantity: 1,
              pickedQuantity: 0,
              status: 'pending',
            },
            {
              id: '1-2',
              productId: 'TWD-LEN-005',
              productName: 'Canon RF 24-70mm F2.8',
              sku: 'TWD-LEN-005',
              location: 'A-15',
              quantity: 1,
              pickedQuantity: 0,
              status: 'pending',
            },
          ],
        },
        {
          id: '2',
          orderId: 'ORD-2024-002',
          customerName: '佐藤花子',
          shippingMethod: '佐川急便',
          priority: 'high',
          status: 'in_progress',
          assignedTo: 'スタッフA',
          startedAt: '2024-06-28T14:00:00',
          items: [
            {
              id: '2-1',
              productId: 'TWD-WAT-007',
              productName: 'Rolex GMT Master',
              sku: 'TWD-WAT-007',
              location: 'V-03',
              quantity: 1,
              pickedQuantity: 1,
              status: 'completed',
            },
          ],
        },
        {
          id: '3',
          orderId: 'ORD-2024-003',
          customerName: '鈴木次郎',
          shippingMethod: '日本郵便',
          priority: 'normal',
          status: 'pending',
          items: [
            {
              id: '3-1',
              productId: 'TWD-CAM-012',
              productName: 'Sony α7R V',
              sku: 'TWD-CAM-012',
              location: 'H2-08',
              quantity: 1,
              pickedQuantity: 0,
              status: 'pending',
            },
            {
              id: '3-2',
              productId: 'TWD-ACC-003',
              productName: 'Peak Design Everyday Backpack',
              sku: 'TWD-ACC-003',
              location: 'B-12',
              quantity: 1,
              pickedQuantity: 0,
              status: 'pending',
            },
          ],
        },
      ];
      setPickingLists(mockLists);
    } catch (error) {
      console.error('[ERROR] Fetching picking lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPicking = (list: PickingList) => {
    setListToStart(list);
    setIsStartModalOpen(true);
  };

  const confirmStartPicking = () => {
    if (!listToStart) return;

    // ピッキング開始処理（実装時にはAPIを呼び出す）
    setPickingLists(prev => prev.map(l => 
      l.id === listToStart.id
        ? { ...l, status: 'in_progress', assignedTo: '現在のスタッフ', startedAt: new Date().toISOString() }
        : l
    ));
    setSelectedList({ ...listToStart, status: 'in_progress' });
    
    showToast({
      type: 'success',
      title: 'ピッキング開始',
      message: `注文 ${listToStart.orderId} のピッキングを開始しました`,
      duration: 3000
    });
    
    setIsStartModalOpen(false);
    setListToStart(null);
  };

  const handleItemPicked = (listId: string, itemId: string) => {
    setPickingLists(prev => prev.map(list => 
      list.id === listId
        ? {
            ...list,
            items: list.items.map(item => 
              item.id === itemId
                ? { ...item, pickedQuantity: item.quantity, status: 'completed' as const }
                : item
            )
          }
        : list
    ));
  };

  const handleCompletePicking = (list: PickingList) => {
    const allItemsPicked = list.items.every(item => item.status === 'completed');
    if (!allItemsPicked) {
      showToast({
        type: 'warning',
        title: 'ピッキング未完了',
        message: 'すべての商品をピッキングしてから完了してください',
        duration: 4000
      });
      return;
    }

    setListToComplete(list);
    setIsCompleteModalOpen(true);
  };

  const confirmCompletePicking = () => {
    if (!listToComplete) return;

    // 完了処理（実装時にはAPIを呼び出す）
    setPickingLists(prev => prev.map(l => 
      l.id === listToComplete.id
        ? { ...l, status: 'completed', completedAt: new Date().toISOString() }
        : l
    ));
    setSelectedList(null);
    
    showToast({
      type: 'success',
      title: 'ピッキング完了',
      message: `注文 ${listToComplete.orderId} のピッキングが完了しました`,
      duration: 3000
    });
    
    setIsCompleteModalOpen(false);
    setListToComplete(null);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="cert-nano cert-ruby">緊急</span>;
      case 'high':
        return <span className="cert-nano cert-gold">優先</span>;
      case 'normal':
        return <span className="cert-nano cert-mint">通常</span>;
      default:
        return <span className="cert-nano">{priority}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="cert-nano">待機中</span>;
      case 'in_progress':
        return <span className="cert-nano cert-premium">作業中</span>;
      case 'completed':
        return <span className="cert-nano cert-mint">完了</span>;
      default:
        return <span className="cert-nano">{status}</span>;
    }
  };

  const filteredLists = pickingLists.filter(list => {
    const matchesPriority = filterPriority === 'all' || list.priority === filterPriority;
    const matchesSearch = 
      list.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch && list.status !== 'completed';
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-b-2 border-nexus-blue rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="注文番号、顧客名で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-nexus-bg-secondary border border-nexus-border rounded-lg focus:ring-2 focus:ring-nexus-blue text-nexus-text-primary"
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 bg-nexus-bg-secondary border border-nexus-border rounded-lg focus:ring-2 focus:ring-nexus-blue text-nexus-text-primary"
        >
          <option value="all">すべての優先度</option>
          <option value="urgent">緊急</option>
          <option value="high">優先</option>
          <option value="normal">通常</option>
        </select>
      </div>

      {/* Picking Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* List Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-nexus-text-primary">ピッキングリスト</h3>
          {filteredLists.map((list) => (
            <div
              key={list.id}
              className={`p-4 cursor-pointer transition-all border-2 rounded-lg bg-nexus-surface ${
                selectedList?.id === list.id
                  ? 'border-nexus-blue bg-nexus-blue/5'
                  : 'border-nexus-border hover:border-nexus-border-hover'
              }`}
              onClick={(e) => {
                // ボタンクリックでない場合のみカードを選択
                if (!(e.target as HTMLElement).closest('button')) {
                  setSelectedList(list);
                }
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-nexus-text-primary">
                    {list.orderId}
                  </h4>
                  <p className="text-sm text-nexus-text-secondary">
                    {list.customerName} | {list.shippingMethod}
                  </p>
                </div>
                <div className="flex gap-2">
                  {getPriorityBadge(list.priority)}
                  {getStatusBadge(list.status)}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-nexus-text-secondary">
                  商品数: {list.items.length}点
                </span>
                {list.status === 'pending' && (
                  <NexusButton
                    onClick={() => handleStartPicking(list)}
                    variant="primary"
                    size="sm"
                  >
                    開始
                  </NexusButton>
                )}
                {list.assignedTo && (
                  <span className="text-nexus-text-secondary">
                    担当: {list.assignedTo}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected List Detail */}
        <div>
          <h3 className="text-lg font-semibold text-nexus-text-primary mb-4">詳細</h3>
          {selectedList ? (
            <NexusCard className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-semibold text-nexus-text-primary">
                      {selectedList.orderId}
                    </h4>
                    <p className="text-sm text-nexus-text-secondary">
                      {selectedList.customerName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {getPriorityBadge(selectedList.priority)}
                    {getStatusBadge(selectedList.status)}
                  </div>
                </div>

                <div className="border-t border-nexus-border pt-4">
                  <h5 className="font-medium text-nexus-text-primary mb-3">商品リスト</h5>
                  <div className="space-y-3">
                    {selectedList.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border ${
                          item.status === 'completed'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-nexus-bg-secondary border-nexus-border'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-nexus-text-primary">
                              {item.productName}
                            </p>
                            <p className="text-sm text-nexus-text-secondary">
                              {item.sku} | 場所: {item.location}
                            </p>
                            <p className="text-sm text-nexus-text-secondary mt-1">
                              数量: {item.pickedQuantity}/{item.quantity}
                            </p>
                          </div>
                          {selectedList.status === 'in_progress' && item.status !== 'completed' && (
                            <NexusButton
                              onClick={() => handleItemPicked(selectedList.id, item.id)}
                              variant="primary"
                              size="sm"
                            >
                              ピック完了
                            </NexusButton>
                          )}
                          {item.status === 'completed' && (
                            <span className="cert-nano cert-mint">✓</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedList.status === 'in_progress' && (
                  <div className="flex justify-end pt-4">
                    <NexusButton
                      onClick={() => handleCompletePicking(selectedList)}
                      variant="primary"
                      disabled={!selectedList.items.every(item => item.status === 'completed')}
                    >
                      ピッキング完了
                    </NexusButton>
                  </div>
                )}
              </div>
            </NexusCard>
          ) : (
            <div className="flex items-center justify-center h-64 text-nexus-text-secondary">
              リストを選択してください
            </div>
          )}
        </div>
      </div>

      {/* Start Picking Modal */}
      <BaseModal
        isOpen={isStartModalOpen}
        onClose={() => {
          setIsStartModalOpen(false);
          setListToStart(null);
        }}
        title="ピッキング開始確認"
        size="md"
      >
        <div>
          <p className="text-nexus-text-primary mb-4">
            注文 {listToStart?.orderId} のピッキングを開始しますか？
          </p>
          <div className="bg-nexus-bg-secondary rounded-lg p-3 mb-6">
            <p className="text-sm text-nexus-text-secondary">
              顧客: {listToStart?.customerName}
            </p>
            <p className="text-sm text-nexus-text-secondary">
              商品数: {listToStart?.items.length}点
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <NexusButton
              onClick={() => {
                setIsStartModalOpen(false);
                setListToStart(null);
              }}
              variant="default"
            >
              キャンセル
            </NexusButton>
            <NexusButton
              onClick={confirmStartPicking}
              variant="primary"
            >
              開始する
            </NexusButton>
          </div>
        </div>
      </BaseModal>

      {/* Complete Picking Modal */}
      <BaseModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setListToComplete(null);
        }}
        title="ピッキング完了確認"
        size="md"
      >
        <div>
          <p className="text-nexus-text-primary mb-4">
            ピッキングを完了しますか？
          </p>
          <div className="bg-nexus-bg-secondary rounded-lg p-3 mb-6">
            <p className="text-sm text-nexus-text-secondary">
              注文: {listToComplete?.orderId}
            </p>
            <p className="text-sm text-nexus-text-secondary">
              顧客: {listToComplete?.customerName}
            </p>
            <p className="text-sm text-nexus-text-secondary">
              ピック済商品: {listToComplete?.items.length}点
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <NexusButton
              onClick={() => {
                setIsCompleteModalOpen(false);
                setListToComplete(null);
              }}
              variant="default"
            >
              キャンセル
            </NexusButton>
            <NexusButton
              onClick={confirmCompletePicking}
              variant="primary"
            >
              完了する
            </NexusButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
} 