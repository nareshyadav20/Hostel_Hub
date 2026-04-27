import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ChevronRight } from 'lucide-react';
import '../NexusElite.css';

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    // Add a slight delay for dramatic effect
    const btn = e.target.querySelector('.auth-btn-nexus');
    btn.innerHTML = 'Establishing Secure Connection...';
    btn.style.opacity = '0.7';
    setTimeout(() => navigate('/dashboard'), 800);
  };

  return (
    <div className="auth-view-nexus" style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#020617', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background Ambience */}
      <div style={{ 
        position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', 
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
        filter: 'blur(100px)'
      }}></div>
      <div style={{ 
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', 
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        filter: 'blur(100px)'
      }}></div>

      <div className="auth-card-nexus" style={{ 
        width: '100%', maxWidth: '440px', padding: '3.5rem', background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(32px)', border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        zIndex: 10, animation: 'fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', marginBottom: '1.5rem', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)'
          }}>
            <ShieldCheck size={40} />
          </div>
          <h1 style={{ 
            fontSize: '2.25rem', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', margin: 0 
          }}>LEVORA</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '0.5rem' }}>
            Global Command Center
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="nexus-input-group">
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Security Identifier
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="admin@levora.com" 
                required 
                style={{ 
                  width: '100%', padding: '1.1rem 1.1rem 1.1rem 3.5rem', background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', color: 'white',
                  fontSize: '1rem', outline: 'none', transition: 'all 0.3s'
                }}
              />
            </div>
          </div>

          <div className="nexus-input-group">
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Encryption Key
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="••••••••••••" 
                required 
                style={{ 
                  width: '100%', padding: '1.1rem 1.1rem 1.1rem 3.5rem', background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', color: 'white',
                  fontSize: '1rem', outline: 'none', transition: 'all 0.3s'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-btn-nexus"
            style={{ 
              marginTop: '1.5rem', padding: '1.25rem', borderRadius: '18px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              color: 'white', fontWeight: 900, fontSize: '1.1rem', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.75rem', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 10px 25px rgba(14, 165, 233, 0.4)'
            }}
          >
            Authenticate Access <ChevronRight size={20} />
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            System Protocol 7.2.0 • Authorized Personnel Only
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .auth-btn-nexus:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 15px 35px rgba(14, 165, 233, 0.5);
          filter: brightness(1.1);
        }
        .nexus-input-group input:focus {
          border-color: var(--accent-primary);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Login;
