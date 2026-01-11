import { FC, memo, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const modalRoot = useMemo(() => document.getElementById('modals'), []);

  if (!modalRoot) return null;

  return createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot
  );
});
