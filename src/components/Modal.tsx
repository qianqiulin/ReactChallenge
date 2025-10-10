import { useEffect, ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;         // id for aria-labelledby
  children: ReactNode;
  width?: number;          // optional, default 560
};

export default function Modal({ isOpen, onClose, titleId, children, width = 560 }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose} // click on the backdrop closes
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
        padding: 16
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()} // clicks inside DO NOT close
        style={{
          width: '100%',
          maxWidth: width,
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }}
      >
        {children}
      </div>
    </div>
  );
}
