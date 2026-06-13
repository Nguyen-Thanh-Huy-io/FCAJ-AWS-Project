import React from 'react';
import { useConfirmStore } from '@/store/useConfirmStore';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

/**
 * GlobalConfirmDialog
 * Component xác nhận toàn cục sử dụng AlertDialog của Radix UI.
 * Đồng bộ trạng thái từ useConfirmStore.
 */
export function GlobalConfirmDialog() {
  const { isOpen, title, description, confirmText, cancelText, variant, onConfirm, onCancel } = useConfirmStore();

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-sm mt-2">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            variant={variant}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
