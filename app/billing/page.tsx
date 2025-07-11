'use client';

import DashboardLayout from '../components/layouts/DashboardLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDownTrayIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import NexusButton from '@/app/components/ui/NexusButton';
import HoloTable from '@/app/components/ui/HoloTable';
import BaseModal from '@/app/components/ui/BaseModal';
import { BusinessStatusIndicator } from '@/app/components/ui';
import { useToast } from '@/app/components/features/notifications/ToastProvider';

export default function BillingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [billingData] = useState({
    currentBalance: 2456789,
    pendingPayment: 456789,
    lastPayment: 1200000,
    nextPaymentDate: '2024-02-01',
  });

  const [transactions] = useState([
    { id: 1, date: '2024-01-15', type: '売上', description: 'Canon EOS R5 販売', amount: 450000, status: '確定' },
    { id: 2, date: '2024-01-14', type: '手数料', description: '販売手数料 (8.5%)', amount: -38250, status: '確定' },
    { id: 3, date: '2024-01-13', type: '売上', description: 'Sony FE 24-70mm 販売', amount: 280000, status: '確定' },
    { id: 4, date: '2024-01-12', type: '手数料', description: '撮影手数料', amount: -300, status: '確定' },
    { id: 5, date: '2024-01-10', type: '振込', description: '売上金振込', amount: -1200000, status: '完了' },
  ]);

  const [monthlyReport] = useState({
    totalSales: 12456789,
    totalFees: 1058327,
    netIncome: 11398462,
    taxAmount: 2279692,
  });

  const handleExportHistory = () => {
    // CSVエクスポート機能を実装
    const csvData = transactions.map(t => 
      `${t.date},${t.type},${t.description},${t.amount},${t.status}`
    ).join('\n');
    
    const blob = new Blob([`日付,種別,詳細,金額,ステータス\n${csvData}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `支払履歴_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePaymentMethod = async () => {
    try {
      // フォームデータの取得をシミュレート
      const bankData = {
        bankName: '実際のフォームから取得', 
        branchName: '実際のフォームから取得',
        branchCode: '実際のフォームから取得',
        accountType: '実際のフォームから取得',
        accountNumber: '実際のフォームから取得',
        accountHolder: '実際のフォームから取得'
      };
      
      // バリデーション
      if (!bankData.bankName || !bankData.accountNumber || !bankData.accountHolder) {
        showToast({
          title: '入力エラー',
          message: '銀行名、口座番号、口座名義は必須項目です',
          type: 'warning'
        });
        return;
      }
      
      // 口座番号の形式チェック
      if (!/^\d{7,8}$/.test(bankData.accountNumber)) {
        showToast({
          title: '口座番号エラー',
          message: '口座番号は7-8桁の数字で入力してください',
          type: 'warning'
        });
        return;
      }
      
      // APIシミュレーション（実際の銀行口座登録処理）
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 銀行口座情報を暗号化して保存をシミュレート
      const encryptedBankData = {
        ...bankData,
        registeredAt: new Date().toISOString(),
        verified: false,
        id: `bank_${Date.now()}`
      };
      
      localStorage.setItem('paymentMethod', JSON.stringify(encryptedBankData));
      
      showToast({
        title: '支払い方法登録完了',
        message: '銀行口座情報を正常に登録しました。確認処理には1-2営業日かかります。',
        type: 'success'
      });
      
      setIsPaymentModalOpen(false);
      // 支払い方法登録ログを記録
      const paymentLog = {
        action: 'payment_method_added',
        timestamp: new Date().toISOString(),
        user: 'current_user',
        bank: encryptedBankData.bankName
      };
      const logs = JSON.parse(localStorage.getItem('paymentLogs') || '[]');
      logs.push(paymentLog);
      localStorage.setItem('paymentLogs', JSON.stringify(logs));
      
    } catch (error) {
      showToast({
        title: '登録エラー',
        message: '支払い方法の登録に失敗しました。もう一度お試しください。',
        type: 'error'
      });
    }
  };

  return (
    <DashboardLayout userType="seller">
      <div className="space-y-8">
        {/* Page Header - Intelligence Card Style */}
        <div className="intelligence-card oceania">
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-nexus-text-primary mb-2">請求管理</h1>
                <h2 className="text-xl font-bold text-nexus-text-primary flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  請求・精算
                </h2>
                <p className="text-nexus-text-secondary mt-1">
                  売上金の請求と精算状況を管理します
                </p>
              </div>
              <div className="flex gap-4">
                <NexusButton
                  onClick={handleExportHistory}
                  icon={<ArrowDownTrayIcon className="w-5 h-5" />}
                >
                  支払履歴をエクスポート
                </NexusButton>
                <NexusButton
                  onClick={() => setIsPaymentModalOpen(true)}
                  variant="primary"
                  icon={<CreditCardIcon className="w-5 h-5" />}
                >
                  支払い方法を登録
                </NexusButton>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Modal */}
        <BaseModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title="支払い方法登録"
          size="md"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-nexus-text-secondary mb-2">
                銀行名
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-nexus-border rounded-lg focus:ring-2 focus:ring-nexus-blue"
                placeholder="例: みずほ銀行"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-nexus-text-secondary mb-2">
                  支店名
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-nexus-border rounded-lg focus:ring-2 focus:ring-nexus-blue"
                  placeholder="例: 新宿支店"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nexus-text-secondary mb-2">
                  支店コード
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-nexus-border rounded-lg focus:ring-2 focus:ring-nexus-blue"
                  placeholder="例: 123"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-nexus-text-secondary mb-2">
                  口座種別
                </label>
                <select className="w-full px-3 py-2 border border-nexus-border rounded-lg focus:ring-2 focus:ring-nexus-blue">
                  <option value="">選択してください</option>
                  <option value="ordinary">普通預金</option>
                  <option value="current">当座預金</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-nexus-text-secondary mb-2">
                  口座番号
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-nexus-border rounded-lg focus:ring-2 focus:ring-nexus-blue"
                  placeholder="例: 1234567"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-nexus-text-secondary mb-2">
                口座名義（カタカナ）
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-nexus-border rounded-lg focus:ring-2 focus:ring-nexus-blue"
                placeholder="例: ヤマダ タロウ"
              />
            </div>
            
            <div className="text-right mt-6 space-x-2">
              <NexusButton onClick={() => setIsPaymentModalOpen(false)}>
                キャンセル
              </NexusButton>
              <NexusButton onClick={handlePaymentMethod} variant="primary">
                登録
              </NexusButton>
            </div>
          </div>
        </BaseModal>

        {/* Balance Overview - Intelligence Metrics Style */}
        <div className="intelligence-metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="intelligence-card oceania">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="action-orb blue">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="status-badge info">残高</span>
                </div>
                <div className="metric-value font-display text-3xl font-bold text-nexus-text-primary">
                  ¥{(billingData.currentBalance / 10000).toLocaleString()}
                  <span className="text-lg font-normal text-nexus-text-secondary ml-1">万</span>
                </div>
                <div className="metric-label text-nexus-text-secondary font-medium mt-2">
                  現在残高
                </div>
              </div>
            </div>

            <div className="intelligence-card oceania">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="action-orb">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="status-badge warning">予定</span>
                </div>
                <div className="metric-value font-display text-3xl font-bold text-nexus-text-primary">
                  ¥{billingData.pendingPayment.toLocaleString()}
                </div>
                <div className="metric-label text-nexus-text-secondary font-medium mt-2">
                  振込予定額
                </div>
              </div>
            </div>

            <div className="intelligence-card oceania">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="action-orb green">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="status-badge success">完了</span>
                </div>
                <div className="metric-value font-display text-3xl font-bold text-nexus-text-primary">
                  ¥{(billingData.lastPayment / 10000).toLocaleString()}
                  <span className="text-lg font-normal text-nexus-text-secondary ml-1">万</span>
                </div>
                <div className="metric-label text-nexus-text-secondary font-medium mt-2">
                  前回振込額
                </div>
              </div>
            </div>

            <div className="intelligence-card oceania">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="action-orb red">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-nexus-purple">日付</span>
                </div>
                <div className="metric-value font-display text-2xl font-bold text-nexus-text-primary">
                  {billingData.nextPaymentDate}
                </div>
                <div className="metric-label text-nexus-text-secondary font-medium mt-2">
                  次回振込日
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History - Holo Table Style */}
        <div className="intelligence-card oceania">
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-display font-bold text-nexus-text-primary">取引履歴</h3>
              <p className="text-nexus-text-secondary mt-1">直近の入出金明細</p>
            </div>
            
            <div className="holo-table">
              <table className="w-full">
                <thead className="holo-header">
                  <tr>
                    <th className="text-left">日付</th>
                    <th className="text-left">種別</th>
                    <th className="text-left">詳細</th>
                    <th className="text-right">金額</th>
                    <th className="text-center">ステータス</th>
                  </tr>
                </thead>
                <tbody className="holo-body">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="holo-row">
                      <td className="text-sm text-nexus-text-primary">{transaction.date}</td>
                      <td>
                        <span className={`status-badge ${
                          transaction.type === '売上' ? 'success' :
                          transaction.type === '手数料' ? 'warning' :
                          'info'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="text-nexus-text-primary">{transaction.description}</td>
                      <td className={`text-right font-display font-bold ${transaction.amount > 0 ? 'text-nexus-green' : 'text-nexus-red'}`}>
                        {transaction.amount > 0 ? '+' : ''}¥{Math.abs(transaction.amount).toLocaleString()}
                      </td>
                      <td className="text-center">
                        <BusinessStatusIndicator 
                          status={transaction.status === '確定' ? 'confirmed' : transaction.status === '完了' ? 'completed' : 'pending'} 
                          size="sm" 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Monthly Report - Intelligence Card Style */}
        <div className="intelligence-card oceania">
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-display font-bold text-nexus-text-primary">月次レポート</h3>
              <p className="text-nexus-text-secondary mt-1">今月の売上・手数料・税金の概要</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-nexus-bg-secondary rounded-lg p-8 border border-nexus-border">
                <div className="text-sm text-nexus-text-secondary mb-2">総売上</div>
                <div className="text-2xl font-display font-bold text-nexus-text-primary">
                  ¥{monthlyReport.totalSales.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-nexus-bg-secondary rounded-lg p-8 border border-nexus-border">
                <div className="text-sm text-nexus-text-secondary mb-2">手数料</div>
                <div className="text-2xl font-display font-bold text-nexus-red">
                  -¥{monthlyReport.totalFees.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-nexus-bg-secondary rounded-lg p-8 border border-nexus-border">
                <div className="text-sm text-nexus-text-secondary mb-2">純利益</div>
                <div className="text-2xl font-display font-bold text-nexus-green">
                  ¥{monthlyReport.netIncome.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-nexus-bg-secondary rounded-lg p-8 border border-nexus-border">
                <div className="text-sm text-nexus-text-secondary mb-2">予想税額</div>
                <div className="text-2xl font-display font-bold text-nexus-text-primary">
                  ¥{monthlyReport.taxAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}