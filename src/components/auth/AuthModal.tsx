import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  X,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { User as UserType } from '../../types';
import { storageService } from '../../services/storageService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('analyst@bank.cm');
  const [password, setPassword] = useState('Analyst123!');
  const [fullName, setFullName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      if (isRegister) {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          setErrorMessage('Please fill in all registration fields.');
          setIsLoading(false);
          return;
        }

        const newUser = storageService.addUser({
          fullName: fullName.trim(),
          email: email.trim(),
          role: 'USER',
          status: 'ACTIVE'
        });

        onLoginSuccess(newUser);
        onClose();
      } else {
        const user = storageService.authenticate(email.trim(), password.trim());
        if (user) {
          onLoginSuccess(user);
          onClose();
        } else {
          setErrorMessage('Invalid authentication credentials. (Try quick login buttons below)');
        }
      }
      setIsLoading(false);
    }, 300);
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setIsRegister(false);
    setErrorMessage(null);

    const user = storageService.authenticate(quickEmail, quickPass);
    if (user) {
      onLoginSuccess(user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#0F172A] border border-[#1E2D4D] rounded-2xl w-full max-w-md p-8 shadow-2xl space-y-6 relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#111C35] text-[#94A3B8] hover:text-white hover:bg-[#1A2A4E] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0284C7] flex items-center justify-center mx-auto shadow-lg shadow-sky-950/40 text-white">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight pt-2 font-sans">
            CyberPhish <span className="text-[#38BDF8]">Security Gateway</span>
          </h2>
          <p className="text-xs text-[#94A3B8]">
            {isRegister ? 'Create an authorized banking operator account' : 'Authenticate to access cyber threat telemetry'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 bg-[#450A0A]/80 border border-[#DC2626]/50 rounded-xl text-xs text-[#F87171] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#F87171] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block font-semibold text-[#94A3B8] mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marie Claire"
                  className="w-full pl-9 pr-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#94A3B8] mb-1">Corporate Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. analyst@bank.cm"
                className="w-full pl-9 pr-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#94A3B8] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs shadow-lg shadow-sky-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isRegister ? 'Register Account' : 'Authenticate & Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Fast Role Gateway Credentials */}
        <div className="pt-3 border-t border-[#1E2D4D] space-y-2">
          <div className="text-[11px] font-mono text-[#94A3B8] text-center uppercase font-semibold">
            Fast Role Gateway Sign-In:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin@bank.cm', 'Admin123!')}
              className="px-2 py-2 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] border border-[#1E2D4D] text-[#38BDF8] text-[11px] font-mono font-semibold transition-colors text-center cursor-pointer"
            >
              SOC Admin
            </button>
            <button
              onClick={() => handleQuickLogin('analyst@bank.cm', 'Analyst123!')}
              className="px-2 py-2 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] border border-[#1E2D4D] text-[#38BDF8] text-[11px] font-mono font-semibold transition-colors text-center cursor-pointer"
            >
              Sec Analyst
            </button>
            <button
              onClick={() => handleQuickLogin('user@bank.cm', 'User123!')}
              className="px-2 py-2 rounded-xl bg-[#111C35] hover:bg-[#1A2A4E] border border-[#1E2D4D] text-[#38BDF8] text-[11px] font-mono font-semibold transition-colors text-center cursor-pointer"
            >
              Bank User
            </button>
          </div>
        </div>

        {/* Toggle Login/Register */}
        <div className="text-center pt-1 text-xs text-[#94A3B8]">
          {isRegister ? (
            <span>
              Already registered?{' '}
              <button
                onClick={() => { setIsRegister(false); setErrorMessage(null); }}
                className="text-[#38BDF8] hover:underline font-semibold"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new account?{' '}
              <button
                onClick={() => { setIsRegister(true); setErrorMessage(null); }}
                className="text-[#38BDF8] hover:underline font-semibold"
              >
                Register Here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
