import React from 'react';
import { InquiryItem } from './types';
interface InquiriesTabProps {
  inquiries: InquiryItem[];
  handleDeleteInquiry: (inqId: string) => void;
  formatDate: (date: string) => string;
}

const InquiriesTab: React.FC<InquiriesTabProps> = ({
  inquiries,
  handleDeleteInquiry,
  formatDate,
}) => {
  return (
    <div className="space-y-6 text-left">
      <div className="mb-6 space-y-1">
        <h2 className="font-head text-xl font-bold text-text-primary tracking-tight">Tenant Inquiries Panel</h2>
        <p className="text-xs text-text-secondary">See genuine inquiry letters sent directly by prospective renters on your properties.</p>
      </div>

      {inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-surface-elevated rounded-2xl border border-border shadow-sm">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">No Inquiries Received</h2>
          <p className="text-sm text-text-secondary max-w-sm mb-6">No tenant inquiries received yet. When users submit contact forms on SettleKar, they'll pop up here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {inquiries.map((inq: InquiryItem) => (
            <div key={inq.id} className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-border-light text-left">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">{inq.tenantName}</h3>
                  <span className="text-xs text-text-tertiary font-medium">Inquired on: <strong className="text-text-primary font-semibold">{inq.propertyTitle}</strong> ({inq.propertyPrice})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-tertiary font-mono">{formatDate(inq.createdAt)}</span>
                  <button
                    className="py-1 px-2.5 text-xs font-semibold text-error bg-transparent hover:bg-error/10 border border-transparent hover:border-error/20 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleDeleteInquiry(inq.id)}
                    title="Dismiss Inquiry"
                  >
                    ✕ Dismiss
                  </button>
                </div>
              </div>
              
              <div className="text-text-primary text-sm italic leading-relaxed mb-5 bg-surface p-4 rounded-xl border-l-2 border-border text-left">
                <p>"{inq.message}"</p>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-border-light text-left">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider font-head">Contact Prospective Tenant:</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={`mailto:${inq.tenantEmail}`} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer bg-primary-accent/10 border border-primary-accent/18 text-primary-accent hover:bg-primary-accent hover:text-white hover:border-primary-accent no-underline">
                    📧 Email: {inq.tenantEmail}
                  </a>
                  <a href={`tel:${inq.tenantPhone}`} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer bg-success/10 border border-success/18 hover:border-success text-success hover:bg-success hover:text-white no-underline">
                    📞 Call/WhatsApp: {inq.tenantPhone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiriesTab;
