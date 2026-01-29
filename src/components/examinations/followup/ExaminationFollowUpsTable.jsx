import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  DollarSign, 
  Edit, 
  CreditCard,
  Plus,
  FileText
} from 'lucide-react';
import { formatNumberWithThousands } from '@/utilities/number';
import { CURRENCY } from '@/constants/currency';
import { useExaminationFollowUps, useMarkExaminationFollowUpFullyPaid, useUpdateExaminationFollowUp } from '@/hooks/queries/useExaminationFollowUpQueries';
import ConfirmDialog from '../../common/ConfirmDialog';
import { AddEditExaminationFollowUp } from './AddEditExaminationFollowUp';
import { toast } from 'react-toastify';

export function ExaminationFollowUpsTable({ examinationId, examinationDate }) {
  const { t } = useTranslation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [isQuickPayDialogOpen, setIsQuickPayDialogOpen] = useState(false);
  const [quickPayFollowUp, setQuickPayFollowUp] = useState(null);

  const { data: followUps = [], isLoading } = useExaminationFollowUps(examinationId);
  const markFullyPaidMutation = useMarkExaminationFollowUpFullyPaid();
  const updateFollowUpMutation = useUpdateExaminationFollowUp();

  const handleMarkFullyPaid = async (followUpId) => {
    try {
      await markFullyPaidMutation.mutateAsync(followUpId);
      toast.success(t('examinations.followup.mark_fully_paid_success'));
    } catch (error) {
      // Global API interceptor already shows toast error, so we don't need to show it here
      console.error('Mark fully paid error:', error);
    }
  };

  const handleQuickPay = (followUp) => {
    setQuickPayFollowUp(followUp);
    setIsQuickPayDialogOpen(true);
  };

  const confirmQuickPay = async () => {
    if (!quickPayFollowUp) return;
    
    try {
      // If follow-up has no payment, set a default amount
      const amount = quickPayFollowUp.payment?.amount || 100; // Default amount if not set
      
      await updateFollowUpMutation.mutateAsync({
        id: quickPayFollowUp.id,
        data: {
          examinationId: quickPayFollowUp.examinationId,
          date: quickPayFollowUp.date,
          description: quickPayFollowUp.description,
          status: quickPayFollowUp.status,
          amount: amount,
          receivedAmount: amount // Pay the full amount
        }
      });
      toast.success(t('examinations.followup.quick_pay_success'));
      setIsQuickPayDialogOpen(false);
      setQuickPayFollowUp(null);
    } catch (error) {
      // Global API interceptor already shows toast error, so we don't need to show it here
      console.error('Quick pay error:', error);
    }
  };

  const getPaymentStatusBadge = (payment) => {
    if (!payment) return <Badge variant="secondary">{t('examinations.followup.no_payment')}</Badge>;
    
    if (payment.isFullyPaid) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">{t('examinations.followup.fully_paid')}</Badge>;
    } else if (payment.isPartiallyPaid) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900">{t('examinations.followup.partially_paid')}</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900">{t('examinations.followup.unpaid')}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t('examinations.followup.title')}</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          {t('examinations.followup.loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">{t('examinations.followup.title')}</h3>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('examinations.followup.add_button')}
        </Button>
      </div>

      {/* Examination Date Reference */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <Calendar className="w-4 h-4" />
          <span>{t('examinations.followup.original_date')}: {(() => {
            try {
              // Handle .NET datetime format with high precision
              const cleanDate = examinationDate?.split('T')[0] || examinationDate;
              const date = new Date(cleanDate);
              return isNaN(date.getTime()) ? t('common.invalid_date') : date.toLocaleDateString('en-SA');
            } catch (error) {
              return t('common.invalid_date');
            }
          })()}</span>
        </div>
      </div>

      {followUps.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>{t('examinations.followup.no_followups')}</p>
          <p className="text-sm">{t('examinations.followup.add_instruction')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {followUps.map((followUp) => (
            <div key={followUp.id} className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-zinc-100">
                      {new Date(followUp.date).toLocaleDateString('en-SA')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-zinc-400">{t('examinations.followup.date_label')}</div>
                  </div>
                  {getPaymentStatusBadge(followUp.payment)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingFollowUp(followUp)}
                    className="hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {followUp.payment && followUp.payment.amount > 0 && !followUp.payment.isFullyPaid && (
                    <Button
                      size="sm"
                      onClick={() => handleQuickPay(followUp)}
                      disabled={markFullyPaidMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CreditCard className="w-4 h-4 ml-1" />
                      {t('examinations.followup.pay_button')}
                    </Button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Status */}
                {followUp.status && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{t('examinations.followup.status_label')}:</span>
                    <span className="text-sm text-gray-900 dark:text-zinc-100 bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-md">{followUp.status}</span>
                  </div>
                )}

                {/* Description */}
                {followUp.description && (
                  <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">{t('examinations.followup.desc_label')}:</div>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">{followUp.description}</p>
                  </div>
                )}

                {/* Payment Details */}
                {followUp.payment && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg p-4 border border-green-100 dark:border-green-900/30">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{t('examinations.followup.payment_details')}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-zinc-400 mb-1">{t('examinations.followup.total_cost')}</div>
                        <div className="font-semibold text-gray-900 dark:text-zinc-100">
                          {formatNumberWithThousands(followUp.payment.amount)} {CURRENCY.SHORT_NAME}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-zinc-400 mb-1">{t('examinations.followup.received_amount')}</div>
                        <div className="font-semibold text-blue-600 dark:text-blue-400">
                          {formatNumberWithThousands(followUp.payment.receivedAmount)} {CURRENCY.SHORT_NAME}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-zinc-400 mb-1">{t('examinations.followup.remaining_amount')}</div>
                        <div className={`font-semibold ${
                          followUp.payment.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatNumberWithThousands(followUp.payment.remainingAmount)} {CURRENCY.SHORT_NAME}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <AddEditExaminationFollowUp
        isOpen={showAddDialog || !!editingFollowUp}
        onClose={() => {
          setShowAddDialog(false);
          setEditingFollowUp(null);
        }}
        examinationId={examinationId}
        followUp={editingFollowUp}
        isEdit={!!editingFollowUp}
      />

      {/* Quick Pay Confirmation Dialog */}
      <ConfirmDialog
        open={isQuickPayDialogOpen}
        onOpenChange={setIsQuickPayDialogOpen}
        title={t('examinations.followup.quick_pay_confirm_title')}
        description={quickPayFollowUp ? t("examinations.followup.quick_pay_confirm_desc", {
          amount: formatNumberWithThousands(quickPayFollowUp.payment?.amount || 0),
          remaining: formatNumberWithThousands((quickPayFollowUp.payment?.amount || 0) - (quickPayFollowUp.payment?.receivedAmount || 0)),
          currency: CURRENCY.SHORT_NAME
        }) : ''}
        confirmLabel={t('examinations.followup.pay_button')}
        cancelLabel={t('common.cancel')}
        onConfirm={confirmQuickPay}
        isLoading={updateFollowUpMutation.isPending}
        confirmVariant="default"
      />
    </div>
  );
}
