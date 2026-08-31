import React from 'react';

// ============================================================
// NeoBrutalism.tsx — Basic UI kit
// Style: thick dark borders, hard offset shadows, high contrast,
// white-dominant background.
// ============================================================

const cx = (...cls) => cls.filter(Boolean).join(' ');

const BASE = 'border-[3px] border-black font-bold transition-all duration-100';
const SHADOW = 'shadow-[4px_4px_0_0_#000]';
const SHADOW_ACTIVE = 'active:translate-x-[4px] active:translate-y-[4px] active:shadow-none';

// ---------- Button ----------
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  const variants = {
    primary: 'bg-[#FF5747] text-white',      // merah kontras
    secondary: 'bg-[#DEFF8E] text-black',    // lime
    ghost: 'bg-white text-black',
    dark: 'bg-black text-white',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };
  return (
    <button
      className={cx(BASE, SHADOW, SHADOW_ACTIVE, 'hover:-translate-y-0.5', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

// ---------- Input ----------
export function Input({ label, className, invalid, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 inline-block bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
          {label}
        </span>
      )}
      <input
        className={cx(
          BASE,
          'w-full bg-white px-4 py-2.5 outline-none placeholder:text-neutral-400',
          'focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px]',
          invalid && 'border-red-600 bg-red-50',
          className
        )}
        {...props}
      />
    </label>
  );
}

// ---------- Textarea ----------
export function Textarea({ label, className, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 inline-block bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
          {label}
        </span>
      )}
      <textarea
        className={cx(
          BASE,
          'w-full bg-white px-4 py-2.5 outline-none placeholder:text-neutral-400 font-mono',
          'focus:shadow-[4px_4px_0_0_#000]',
          className
        )}
        {...props}
      />
    </label>
  );
}

// ---------- Select ----------
export function Select({ label, className, children, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 inline-block bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
          {label}
        </span>
      )}
      <select
        className={cx(BASE, SHADOW, 'w-full appearance-none bg-[#DEFF8E] px-4 py-2.5 outline-none', className)}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

// ---------- Card ----------
export function Card({ className, children, hoverable = false, ...props }) {
  return (
    <div
      className={cx(
        BASE,
        SHADOW,
        'bg-white p-5',
        hoverable && 'hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#000] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ---------- Badge ----------
export function Badge({ color = 'yellow', className, children }) {
  const colors = {
    yellow: 'bg-[#FFD93D] text-black',
    lime: 'bg-[#DEFF8E] text-black',
    red: 'bg-[#FF5747] text-white',
    blue: 'bg-[#6C9EFF] text-black',
    black: 'bg-black text-white',
    white: 'bg-white text-black',
  };
  return (
    <span className={cx('inline-block border-2 border-black px-2 py-0.5 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0_0_#000]', colors[color], className)}>
      {children}
    </span>
  );
}

// ---------- Modal ----------
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className={cx(BASE, 'w-full max-w-lg bg-white shadow-[8px_8px_0_0_#000]', 'max-h-[90vh] overflow-y-auto')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-[3px] border-black bg-[#FFD93D] px-5 py-3">
          <h2 className="text-lg font-black uppercase tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="border-2 border-black bg-white px-2.5 py-0.5 text-sm font-black shadow-[3px_3px_0_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
