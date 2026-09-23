import React, { useState } from 'react';
import { useRental } from '../../context/RentalContext';
import logoImg from '../../images/logo.jpg';

export default function AdminLoginPage() {
  const { loginAdmin, switchView } = useRental();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = loginAdmin(username.trim(), password.trim());
    if (!success) {
      setHasError(true);
    } else {
      setHasError(false);
      setUsername('');
      setPassword('');
    }
  };

  return (
    <section id="view-admin-login" className="max-w-md mx-auto px-4 py-16">
      <div className="card p-8 shadow-xl border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <img
            src={logoImg}
            alt="Layarasa Logo"
            className="w-16 h-16 rounded-full object-cover mx-auto shadow-lg border-2 border-brand-500 mb-2"
          />
          <h2 className="text-2xl font-black text-slate-900">Portal Login Staf Admin</h2>
          <p className="text-xs text-slate-500">
            Khusus staf pengelola Layarasa untuk memvalidasi pemesanan, serah-terima fisik, dan inventaris.
          </p>
        </div>

        <form id="admin-login-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-user-input" className="label">
              Username
            </label>
            <input
              type="text"
              id="admin-user-input"
              required
              autoComplete="username"
              placeholder="Masukkan username admin"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setHasError(false);
              }}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="admin-pass-input" className="label">
              Password
            </label>
            <input
              type="password"
              id="admin-pass-input"
              required
              autoComplete="current-password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setHasError(false);
              }}
              className="input"
            />
          </div>

          {hasError && (
            <div
              id="admin-login-error"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 text-red-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Username atau password salah! (Gunakan: admin / admin123)
            </div>
          )}

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="btn-primary w-full justify-center py-2.5 font-bold text-sm shadow-md"
            >
              Masuk Dashboard Admin
            </button>
            <button
              type="button"
              onClick={() => switchView('catalog')}
              className="btn-secondary w-full justify-center py-2 text-xs"
            >
              Kembali ke Beranda Pelanggan
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">Kredensial Default Staf:</span>
            <span>
              Username: <strong className="text-slate-800 font-mono">admin</strong> &bull; Password:{' '}
              <strong className="text-slate-800 font-mono">admin123</strong>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
