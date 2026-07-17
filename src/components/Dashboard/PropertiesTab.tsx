import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PropertyItem } from './types';
interface PropertiesTabProps {
  properties: PropertyItem[];
  triggerEditProperty: (propId: string | number) => void;
  handleDeleteProperty: (propId: string | number) => void;
  setActiveTab: (tab: 'overview' | 'list' | 'properties' | 'inquiries') => void;
}

const PropertiesTab: React.FC<PropertiesTabProps> = ({
  properties,
  triggerEditProperty,
  handleDeleteProperty,
  setActiveTab,
}) => {
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const handleCopyUid = (id: string | number) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };
  return (
    <div className="space-y-6 text-left">
      <div className="mb-6 space-y-1">
        <h2 className="font-head text-xl font-bold text-text-primary tracking-tight">My Listed Properties</h2>
        <p className="text-xs text-text-secondary">Verify or remove property advertisements currently live on SettleKar.</p>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-surface-elevated rounded-2xl border border-border shadow-sm">
          <div className="text-4xl mb-4">🏢</div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">No Properties Listed Yet</h2>
          <p className="text-sm text-text-secondary max-w-sm mb-6">You haven't listed any property yet. Open the "List Property" tab to post your first rental!</p>
          <button className="px-4 py-2 bg-primary-accent hover:bg-primary-accent/90 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer" onClick={() => setActiveTab('list')}>
            Post Listing Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop: PropertyItem) => (
            <div key={prop.id} className="bg-surface-elevated rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col">
              <button 
                type="button"
                onClick={() => triggerEditProperty(prop.id)}
                className="block relative h-48 overflow-hidden cursor-pointer w-full border-0 p-0"
                title="✏️ Edit Property"
              >
                <img src={prop.image} alt={prop.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
              </button>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-base font-semibold text-text-primary">
                    <button 
                      type="button"
                      onClick={() => triggerEditProperty(prop.id)}
                      className="text-left hover:text-primary-accent transition-colors cursor-pointer border-0 bg-transparent p-0 font-semibold text-text-primary"
                      title="✏️ Edit Property"
                    >
                      {prop.title}
                    </button>
                  </h3>
                  <span className="px-2.5 py-0.5 bg-primary-accent/10 text-primary-accent border border-primary-accent/18 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{prop.badge}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-tertiary mb-3">
                  <span className="font-medium">UID:</span>
                  <span className="font-mono bg-surface border border-border px-1.5 py-0.5 rounded text-text-secondary">{prop.id}</span>
                  <button 
                    type="button" 
                    className="inline-flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer bg-transparent border-0 text-text-tertiary font-sans text-xs"
                    onClick={() => handleCopyUid(prop.id)}
                    title="Copy Property UID"
                    aria-label="Copy Property UID"
                  >
                    {copiedId === prop.id ? (
                      <>
                        <Check size={12} className="mr-0.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} className="mr-0.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-text-secondary mb-2 flex items-center flex-wrap gap-1.5 text-left">
                  📍 {prop.address || (prop.location && !prop.location.startsWith('http') ? prop.location : '') || prop.city}
                  {prop.location && prop.location.startsWith('http') && (
                    <a 
                      href={prop.location} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-xs text-primary-accent bg-primary-accent/10 border border-primary-accent/18 hover:bg-primary-accent/20 px-1.5 py-0.5 rounded font-medium transition-colors no-underline"
                      title="Open Google Maps"
                    >
                      🌐 Maps
                    </a>
                  )}
                </p>
                {prop.overallscore !== undefined && prop.overallscore !== null && (
                  <div className="text-left mb-2.5">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      prop.overallscore >= 80 
                        ? 'bg-success/10 text-success border-success/18' 
                        : prop.overallscore >= 60 
                          ? 'bg-warning/10 text-warning border-warning/18' 
                          : 'bg-error/10 text-error border-error/18'
                    }`}>
                      🛡️ Livability Score: <strong>{prop.overallscore}/100</strong>
                    </div>
                  </div>
                )}
                <p className="text-xs text-text-tertiary mb-4 text-left">{prop.features}</p>
                <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-border-light">
                  <span className="text-lg font-bold text-text-primary font-mono">{prop.price}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-semibold text-primary-accent hover:bg-primary-accent/10 border border-primary-accent/30 hover:border-primary-accent/50 rounded-lg transition-all cursor-pointer bg-transparent"
                      onClick={() => triggerEditProperty(prop.id)}
                      aria-label={`Edit ${prop.title}`}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/10 border border-error/30 hover:border-error/50 rounded-lg transition-all cursor-pointer bg-transparent"
                      onClick={() => handleDeleteProperty(prop.id)}
                      aria-label={`Delete ${prop.title}`}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesTab;
