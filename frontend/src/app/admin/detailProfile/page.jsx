"use client";

import { useState, useEffect } from "react";
import authApi from "@/api/authApi";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", password: "••••••••" });
  const [tempProfile, setTempProfile] = useState({ name: "", email: "", phone: "", password: "••••••••" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await authApi.getProfile();
      if (res.success && res.data) {
        const data = {
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          password: "••••••••",
        };
        setProfile(data);
        setTempProfile(data);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Gagal memuat profil admin."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFieldClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      // Clear password field to let them type a new one easily
      setTempProfile((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleInputChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setShowPassword(false);
    setTempProfile({ ...profile });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");
    setSuccess("");

    // Validate inputs
    if (!tempProfile.name.trim()) {
      setError("Nama tidak boleh kosong.");
      setSaveLoading(false);
      return;
    }
    if (!tempProfile.email.trim()) {
      setError("Email tidak boleh kosong.");
      setSaveLoading(false);
      return;
    }

    try {
      // handler untuk update data (PUT)
      const updateData = {
        name: tempProfile.name,
        email: tempProfile.email,
        phone: tempProfile.phone,
      };

      // Only send password if it has been updated and is not empty/placeholder
      if (
        tempProfile.password &&
        tempProfile.password !== "••••••••" &&
        tempProfile.password.trim() !== ""
      ) {
        updateData.password = tempProfile.password;
      }

      const res = await authApi.updateProfile(updateData);
      if (res.success) {
        setSuccess("Profil berhasil diperbarui!");
        const updated = {
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          password: "••••••••",
        };
        setProfile(updated);
        setTempProfile(updated);
        setIsEditing(false);
        setShowPassword(false);

        // Emit custom event so that sidebar can reactively update its state
        window.dispatchEvent(new Event("profileUpdated"));
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Gagal menyimpan perubahan profil."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400 dark:text-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#C89B3C] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Memuat informasi profil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Page Header
      // <div className="mb-8">
      //   <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Detail Profil Admin</h1>
      //   <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
      //     Lihat dan kelola informasi login akun administrator Anda.
      //   </p>
      // </div> */}

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden transition-all duration-300">
        {/* Background gradient decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Success / Error Alerts */}
        {success && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm px-4 py-3 rounded-2xl animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-2xl animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Profile Avatar Header */}
        <div className="flex flex-col items-center mb-8 pb-6 border-b border-slate-100 dark:border-white/5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-500/20 mb-3 relative group">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{profile.name}</h2>
          <span className="text-slate-400 text-sm mt-1">Administrator</span>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Name Field */}
          <div 
            onClick={handleFieldClick}
            className={`group transition-all duration-200 p-2 rounded-2xl ${
              !isEditing 
                ? "hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer" 
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 px-1">
              <label className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Nama Lengkap
              </label>
            </div>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={tempProfile.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                placeholder="Masukkan nama"
                required
                autoFocus
              />
            ) : (
              <p className="px-1 text-slate-800 dark:text-slate-200 font-medium text-sm">
                {profile.name || "-"}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div 
            onClick={handleFieldClick}
            className={`group transition-all duration-200 p-2 rounded-2xl ${
              !isEditing 
                ? "hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer" 
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 px-1">
              <label className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Email
              </label>
            </div>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={tempProfile.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                placeholder="nama@domain.com"
                required
              />
            ) : (
              <p className="px-1 text-slate-800 dark:text-slate-200 font-medium text-sm">
                {profile.email || "-"}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div 
            onClick={handleFieldClick}
            className={`group transition-all duration-200 p-2 rounded-2xl ${
              !isEditing 
                ? "hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer" 
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 px-1">
              <label className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Nomor Handphone
              </label>
            </div>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={tempProfile.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                placeholder="Masukkan nomor handphone (Contoh: 08123456789)"
              />
            ) : (
              <p className="px-1 text-slate-800 dark:text-slate-200 font-medium text-sm">
                {profile.phone || "-"}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div 
            onClick={handleFieldClick}
            className={`group transition-all duration-200 p-2 rounded-2xl ${
              !isEditing 
                ? "hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer" 
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 px-1">
              <label className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Password
              </label>               
            </div>
            {isEditing ? (
              <div>
                <div className="relative group/pwd flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={tempProfile.password}
                    onChange={handleInputChange}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                    placeholder="Masukkan password baru (kosongkan jika tidak ingin diubah)"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3.5 flex items-center text-slate-400 hover:text-slate-200 opacity-0 group-hover/pwd:opacity-100 transition-opacity"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1 px-1">
                  Biarkan kosong jika Anda tidak ingin mengubah password lama Anda.
                </p>
              </div>
            ) : (
              <div className="relative group/pwd flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={profile.password}
                  readOnly
                  className="w-full px-1 py-1 bg-transparent border-0 select-none text-slate-800 dark:text-slate-200 font-medium text-sm focus:outline-none cursor-pointer tracking-widest"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3.5 flex items-center text-slate-400 hover:text-slate-200 opacity-0 group-hover/pwd:opacity-100 transition-opacity"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-white/5">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saveLoading}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-500/50 disabled:to-pink-500/50 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
                >
                  {saveLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleFieldClick}
                className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-white text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
