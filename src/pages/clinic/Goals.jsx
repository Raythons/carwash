import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ContentContainer } from '../../components/ContentContainer';
import { Button } from '../../components/ui/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { AddEditGoalModal } from '../../components/goals/AddEditGoalModal';
import { GoalsTable } from '../../components/goals/GoalsTable';
import { clinicalGoalApi } from '../../api/clinicalGoalApi';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export function Goals() {
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const queryClient = useQueryClient();

  const getMonthName = (month) => {
    return t(`goals.form.months.${month}`);
  };

  // Fetch goals for current year
  const { data: goals = [], isLoading, error } = useQuery({
    queryKey: ['clinical-goals', currentYear],
    queryFn: () => clinicalGoalApi.getGoalsByYear(currentYear),
    staleTime: 5 * 60 * 1000,
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: clinicalGoalApi.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries(['clinical-goals']);
      setIsAddModalOpen(false);
      toast.success(t('goals.create_success'));
    },
    onError: (error) => {
      toast.error(error.message || t('goals.create_error'));
    },
  });

  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: ({ id, data }) => clinicalGoalApi.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clinical-goals']);
      setEditingGoal(null);
      toast.success(t('goals.update_success'));
    },
    onError: (error) => {
      toast.error(error.message || t('goals.update_error'));
    },
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: clinicalGoalApi.deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries(['clinical-goals']);
      setDeletingGoal(null);
      toast.success(t('goals.delete_success'));
    },
    onError: (error) => {
      toast.error(error.message || t('goals.delete_error'));
    },
  });

  const handleAddGoal = (goalData) => {
    createGoalMutation.mutate(goalData);
  };

  const handleEditGoal = (goalData) => {
    updateGoalMutation.mutate({
      id: editingGoal.id,
      data: goalData,
    });
  };

  const handleDeleteGoal = () => {
    if (deletingGoal) {
      deleteGoalMutation.mutate(deletingGoal.id);
    }
  };

  const getMonthsWithGoals = () => {
    // Ensure goals is always an array
    const goalsArray = Array.isArray(goals) ? goals : [];
    const monthsWithGoals = new Set(goalsArray.map(goal => goal.month));
    return Array.from({ length: 12 }, (_, i) => i + 1).map(month => ({
      month,
      hasGoal: monthsWithGoals.has(month),
      goal: goalsArray.find(g => g.month === month)
    }));
  };

  if (error) {
    return (
      <ContentContainer>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('goals.load_error')}</h3>
          <p className="text-gray-500">{error.message}</p>
        </div>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('goals.page_title')}</h1>
            <p className="text-gray-600 mt-1">{t('goals.page_subtitle')}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select
              value={currentYear.toString()}
              onValueChange={(value) => setCurrentYear(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t("goals.select_year")} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 13 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('goals.add_button')}
            </Button>
          </div>
        </div>

        <GoalsTable
          goals={goals}
          monthsWithGoals={getMonthsWithGoals()}
          currentYear={currentYear}
          isLoading={isLoading}
          onEdit={setEditingGoal}
          onDelete={setDeletingGoal}
        />

        {/* Add/Edit Goal Modal */}
        <AddEditGoalModal
          isOpen={isAddModalOpen || !!editingGoal}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingGoal(null);
          }}
          onSubmit={editingGoal ? handleEditGoal : handleAddGoal}
          goal={editingGoal}
          existingGoals={goals}
          currentYear={currentYear}
          isLoading={createGoalMutation.isLoading || updateGoalMutation.isLoading}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={!!deletingGoal}
          onOpenChange={() => setDeletingGoal(null)}
          onConfirm={handleDeleteGoal}
          title={t('goals.delete_confirm_title')}
          description={`${t('goals.delete_confirm_desc')} ${deletingGoal?.month ? getMonthName(deletingGoal.month) : ''}؟`}
          confirmLabel={t('goals.confirm_delete')}
          cancelLabel={t('goals.confirm_cancel')}
          isLoading={deleteGoalMutation.isLoading}
          confirmVariant="destructive"
        />
      </div>
    </ContentContainer>
  );
}
