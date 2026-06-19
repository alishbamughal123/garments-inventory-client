import React from "react";

const Loader = ({ message = "Retrieving database records...", fullPage = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4 select-none">
      <div className="relative flex items-center justify-center">
        {/* Pulsing core node */}
        <div className="absolute h-3.5 w-3.5 rounded-full bg-blue-600 animate-ping opacity-75" />
        <div className="absolute h-2.5 w-2.5 rounded-full bg-blue-600" />
        
        {/* Sleek rotating ring */}
        <div className="h-12 w-12 rounded-full border-[3px] border-slate-100 border-t-blue-600 animate-spin" />
      </div>
      {message && (
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50/50 p-4">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex min-h-[300px] w-full items-center justify-center p-8">
      {spinner}
    </div>
  );
};

export default Loader;
