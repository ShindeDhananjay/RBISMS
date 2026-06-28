import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

const Modal = ({ isOpen, onClose, title, children, width = '560px' }: ModalProps) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(17, 24, 39, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
      }}
    >
      <div
        className="glass-panel animate-slide-up"
        style={{
          width,
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '36px',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(85, 2, 98, 0.2), 0 8px 24px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ margin: 0, color: 'var(--ip-red)', fontSize: '1.4rem', fontWeight: 700 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--panel-border)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              transition: 'var(--transition)',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--ip-red)';
              (e.currentTarget as HTMLButtonElement).style.color = 'white';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ip-red)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--panel-bg)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--panel-border)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--panel-border)', marginBottom: '28px' }} />

        {/* Content */}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
