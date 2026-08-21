import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Shield, 
  ShieldAlert, 
  UserCheck, 
  Key, 
  Check, 
  X,
  AlertTriangle
} from 'lucide-react';
import { User, UserRole, UserStatus } from '../../types';
import { storageService } from '../../services/storageService';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(storageService.getUsers());
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [status, setStatus] = useState<UserStatus>('ACTIVE');
  const [resetPwdSuccess, setResetPwdSuccess] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFullName('');
    setEmail('');
    setRole('USER');
    setStatus('ACTIVE');
    setShowModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFullName(user.fullName);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      alert('Full Name and Email are required.');
      return;
    }

    if (editingUser) {
      storageService.updateUser(editingUser.id, { fullName, email, role, status });
    } else {
      storageService.addUser({ fullName, email, role, status });
    }

    setUsers(storageService.getUsers());
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this user? This action is irreversible.')) {
      storageService.deleteUser(id);
      setUsers(storageService.getUsers());
    }
  };

  const handleToggleStatus = (user: User) => {
    const newStatus: UserStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    storageService.updateUser(user.id, { status: newStatus });
    setUsers(storageService.getUsers());
  };

  const handleResetPassword = (user: User) => {
    storageService.updatePassword(user.id, 'ChangeMeImmediately123!');
    setResetPwdSuccess(`Password for ${user.email} reset to default: ChangeMeImmediately123! (User forced to change on login)`);
    setTimeout(() => setResetPwdSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30 text-[10px] uppercase font-mono font-semibold tracking-wider">
              RBAC Directory
            </span>
            <span className="text-xs text-[#94A3B8]">• {users.length} Registered Accounts</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 font-sans">
            User Accounts & <span className="text-[#38BDF8]">Role-Based Authorization</span>
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-lg shadow-sky-950/40 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New User</span>
        </button>
      </div>

      {resetPwdSuccess && (
        <div className="p-3.5 bg-[#064E3B]/40 border border-[#059669]/50 rounded-xl text-xs text-[#34D399] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#34D399] shrink-0" />
          <span>{resetPwdSuccess}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111C35] text-[#94A3B8] font-mono uppercase text-[10px] border-b border-[#1E2D4D]">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Full Name</th>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-5 py-3.5">Assigned Role</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5">Last Login</th>
                <th className="px-5 py-3.5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4D] text-[#F8FAFC]">
              {users.map(user => {
                const isAdmin = user.role === 'ADMIN';
                const isAnalyst = user.role === 'SECURITY_ANALYST';
                return (
                  <tr key={user.id} className="hover:bg-[#111C35]/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-[#38BDF8]">
                      #{user.id}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white">
                      {user.fullName}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[#F8FAFC]">
                      {user.email}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isAdmin ? 'bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30' :
                        isAnalyst ? 'bg-[#451A03]/60 text-[#FBBF24] border border-[#D97706]/40' :
                        'bg-[#111C35] text-[#94A3B8] border border-[#1E2D4D]'
                      }`}>
                        {isAdmin && <ShieldAlert className="w-3 h-3 text-[#38BDF8]" />}
                        {isAnalyst && <UserCheck className="w-3 h-3 text-[#FBBF24]" />}
                        {!isAdmin && !isAnalyst && <Shield className="w-3 h-3 text-[#94A3B8]" />}
                        <span>{user.role}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                          user.status === 'ACTIVE'
                            ? 'bg-[#064E3B] text-[#34D399] border border-[#059669]/50'
                            : 'bg-[#450A0A] text-[#F87171] border border-[#DC2626]/50'
                        }`}
                        title="Click to toggle status"
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-[#94A3B8] text-[11px] font-mono">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleResetPassword(user)}
                          className="p-1.5 rounded-lg hover:bg-[#111C35] text-[#94A3B8] hover:text-[#FBBF24] transition-colors cursor-pointer"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 rounded-lg hover:bg-[#111C35] text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 rounded-lg hover:bg-[#450A0A] text-[#94A3B8] hover:text-[#EF4444] transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Provision / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-[#1E2D4D] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-[#1E2D4D] pb-3">
              <h2 className="text-base font-bold text-white">
                {editingUser ? 'Edit User Credentials & Role' : 'Provision New System User'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#111C35] text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#94A3B8] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Samuel Eto'o"
                  className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#94A3B8] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. analyst@bank.cm"
                  className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#94A3B8] mb-1">Role Assignment</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                  >
                    <option value="USER">USER (Banking Staff)</option>
                    <option value="SECURITY_ANALYST">SECURITY_ANALYST</option>
                    <option value="ADMIN">ADMIN (SOC Lead)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#94A3B8] mb-1">Account Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as UserStatus)}
                    className="w-full px-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white focus:outline-none focus:border-[#38BDF8] font-mono"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-[#111C35] rounded-xl border border-[#1E2D4D] text-[11px] text-[#94A3B8]">
                Passwords are never stored in plaintext and are hashed with standard BCrypt (<span className="font-mono text-[#38BDF8]">password_hash</span>).
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] text-[#94A3B8] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold cursor-pointer shadow-md"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
