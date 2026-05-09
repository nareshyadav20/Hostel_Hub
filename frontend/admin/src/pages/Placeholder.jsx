import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';

const Placeholder = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-6">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
        <Rocket size={48} />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">{title} Module</h1>
        <p className="text-text-muted max-w-md mx-auto">
          We are currently deploying the advanced enterprise features for the {title} module. 
          Check back soon for the full intelligence suite.
        </p>
      </div>
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>
    </div>
  );
};

export default Placeholder;
