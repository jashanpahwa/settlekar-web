import React, { useState, useEffect, useRef } from 'react';
import { verificationService } from '../../services/verificationService';

interface VideoVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  onVideoSubmitted?: () => void;
}

const VideoVerificationModal: React.FC<VideoVerificationModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  onVideoSubmitted,
}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [videoSuccess, setVideoSuccess] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'fetching' | 'acquired' | 'denied'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setVideoFile(null);
      setVideoProgress(0);
      setVideoError('');
      setVideoSuccess(false);
      setGpsStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_MB = 150;
    if (file.size > MAX_MB * 1024 * 1024) {
      setVideoError(`Video must be under ${MAX_MB}MB.`);
      return;
    }
    setVideoFile(file);
    setVideoError('');
    setGpsStatus('idle');
  };

  const handleUploadVideo = async () => {
    if (!videoFile || !propertyId) return;
    setVideoError('');
    setVideoUploading(true);

    try {
      setGpsStatus('fetching');
      try {
        await verificationService.captureGPSLocation();
        setGpsStatus('acquired');
      } catch (gpsErr: any) {
        setGpsStatus('denied');
        setVideoError(gpsErr.message);
        setVideoUploading(false);
        return;
      }

      const result = await verificationService.submitVideoVerification(
        propertyId,
        videoFile,
        (progress) => setVideoProgress(progress)
      );

      if (result.success) {
        setVideoSuccess(true);
        onVideoSubmitted?.();
      } else {
        setVideoError(result.error || 'Upload failed. Please try again.');
      }
    } catch (err: any) {
      setVideoError(err.message || 'Upload failed. Please try again.');
    } finally {
      setVideoUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-surface-elevated border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-head text-lg font-bold text-text-primary">Video Verification</h2>
            <p className="text-xs text-text-secondary mt-0.5">Submit location-aware proof of your property</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-border-light text-text-tertiary transition-colors border-0 bg-transparent cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-5">
            <div className="bg-warning/5 border border-warning/18 rounded-xl p-4 text-sm text-text-secondary leading-relaxed space-y-2">
              <p><strong className="text-text-primary">📍 Must be at the property</strong> — Your location will be captured automatically when you upload.</p>
              <p><strong className="text-text-primary">🎥 Record a short video</strong> — 5–30 seconds is enough. Show the entrance, main room, or exterior.</p>
              <p><strong className="text-text-primary">⏳ Reviewed within 48 hours</strong> — Videos are auto-deleted after 7 days.</p>
            </div>

            {propertyTitle && (
              <div className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-xl">
                <span className="text-base">🏠</span>
                <span className="text-sm text-text-primary font-medium truncate">{propertyTitle}</span>
              </div>
            )}

            {videoSuccess ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="w-16 h-16 bg-success/10 border border-success/20 rounded-full flex items-center justify-center text-3xl">📹</div>
                <h3 className="font-head text-base font-bold text-text-primary">Video Submitted!</h3>
                <p className="text-sm text-text-secondary">Your video is under review. Status will update within 48 hours.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-primary-accent text-white rounded-xl text-sm font-semibold hover:bg-primary-accent/90 transition-colors cursor-pointer border-0"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* File picker */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Select Video File
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full px-4 py-5 border-2 border-dashed rounded-xl text-sm transition-all cursor-pointer bg-transparent flex flex-col items-center gap-2 ${
                      videoFile
                        ? 'border-success/40 bg-success/5 text-success'
                        : 'border-border hover:border-primary-accent/40 hover:bg-primary-accent/3 text-text-tertiary'
                    }`}
                  >
                    <span className="text-2xl">{videoFile ? '✅' : '🎥'}</span>
                    <span className="font-medium text-text-secondary text-center truncate max-w-full px-2">
                      {videoFile ? videoFile.name : 'Tap to select video'}
                    </span>
                    {videoFile && (
                      <span className="text-xs text-text-tertiary">
                        {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    )}
                    {!videoFile && (
                      <span className="text-xs">MP4, MOV or WEBM · Max 150MB</span>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* GPS status */}
                {gpsStatus !== 'idle' && (
                  <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border ${
                    gpsStatus === 'acquired'
                      ? 'bg-success/8 border-success/20 text-success'
                      : gpsStatus === 'denied'
                      ? 'bg-error/8 border-error/20 text-error'
                      : 'bg-warning/8 border-warning/20 text-warning'
                  }`}>
                    <span>{gpsStatus === 'fetching' ? '📡' : gpsStatus === 'acquired' ? '📍' : '⚠️'}</span>
                    <span>
                      {gpsStatus === 'fetching' && 'Acquiring location...'}
                      {gpsStatus === 'acquired' && 'Location captured successfully'}
                      {gpsStatus === 'denied' && 'Location access denied'}
                    </span>
                  </div>
                )}

                {/* Upload progress */}
                {videoUploading && (
                  <div>
                    <div className="flex justify-between text-xs text-text-secondary mb-1.5">
                      <span>Uploading video...</span>
                      <span>{videoProgress}%</span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-accent rounded-full transition-all duration-300"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error */}
                {videoError && (
                  <div className="p-3 bg-error/8 border border-error/20 rounded-xl text-sm text-error">
                    ⚠️ {videoError}
                  </div>
                )}

                {/* Upload button */}
                <button
                  type="button"
                  onClick={handleUploadVideo}
                  disabled={!videoFile || videoUploading}
                  className="w-full py-3 bg-primary-accent text-white rounded-xl text-sm font-semibold hover:bg-primary-accent/90 transition-colors cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {videoUploading ? `⏳ Uploading ${videoProgress}%...` : '📤 Upload & Submit for Review'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoVerificationModal;
