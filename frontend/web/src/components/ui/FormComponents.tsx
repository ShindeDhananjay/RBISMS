

/* ─── FormField ─────────────────────────────────── */
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  defaultValue?: any;
}

export const FormField = ({ label, name, type = 'text', required = false, fullWidth = false, placeholder = '', defaultValue }: FormFieldProps) => (
  <div style={{ gridColumn: fullWidth ? 'span 2' : 'span 1' }}>
    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
      {label} {required && <span style={{ color: 'var(--ip-red)' }}>*</span>}
    </label>
    <input
      name={name}
      type={type}
      required={required}
      defaultValue={defaultValue}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      style={{
        width: '100%',
        padding: '12px 16px',
        background: '#fff',
        border: '1.5px solid var(--panel-border)',
        borderRadius: '12px',
        color: 'var(--text-primary)',
        fontSize: '0.95rem',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        outline: 'none',
      }}
      onFocus={e => {
        e.target.style.borderColor = 'var(--ip-red)';
        e.target.style.boxShadow = '0 0 0 4px rgba(85, 2, 98, 0.08)';
      }}
      onBlur={e => {
        e.target.style.borderColor = 'var(--panel-border)';
        e.target.style.boxShadow = 'none';
      }}
    />
  </div>
);

/* ─── FormButtons ───────────────────────────────── */
interface FormButtonsProps {
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export const FormButtons = ({ onCancel, submitLabel = 'Save', loading = false }: FormButtonsProps) => (
  <div style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid var(--panel-border)',
  }}>
    <button
      type="button"
      onClick={onCancel}
      style={{
        padding: '11px 28px',
        borderRadius: '50px',
        border: '1.5px solid var(--panel-border)',
        background: 'transparent',
        color: 'var(--text-secondary)',
        fontWeight: 600,
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ip-red)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--ip-red)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--panel-border)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
      }}
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={loading}
      style={{
        padding: '11px 32px',
        borderRadius: '50px',
        border: 'none',
        background: loading ? 'var(--panel-border)' : 'linear-gradient(135deg, var(--ip-red) 0%, var(--ip-yellow) 100%)',
        color: 'white',
        fontWeight: 700,
        fontSize: '0.95rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
        boxShadow: loading ? 'none' : '0 4px 14px rgba(85, 2, 98, 0.3)',
      }}
      onMouseEnter={e => {
        if (!loading) {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(85, 2, 98, 0.4)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'none';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(85, 2, 98, 0.3)';
      }}
    >
      {loading ? 'Saving...' : submitLabel}
    </button>
  </div>
);
