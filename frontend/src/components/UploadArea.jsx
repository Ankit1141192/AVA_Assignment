import React, { useCallback, useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { uploadInvoice } from '../api';

const UploadArea = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;

    // Basic type validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('File type not supported. Please upload a PDF or Image (JPEG/PNG).');
      return;
    }

    setUploading(true);
    setStatus(null);
    try {
      const result = await uploadInvoice(file);
      setStatus('success');
      if (onUploadSuccess) onUploadSuccess(result.data);
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const onZoneClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="fade-in">
      <div 
        className={`glass-card upload-zone ${isDragActive ? 'drag-active' : ''} ${status === 'success' ? 'upload-success' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onZoneClick}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '250px',
          cursor: 'pointer',
          textAlign: 'center',
          border: '2px dashed var(--border)',
          marginTop: '1rem',
          transition: 'all 0.3s ease'
        }}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          accept=".jpeg,.jpg,.png,.pdf"
          style={{ display: 'none' }}
          multiple={false}
        />
        
        {uploading ? (
          <>
            <Loader2 className="animate-spin text-primary" size={48} />
            <p style={{ marginTop: '1rem', fontWeight: 600 }}>Analyzing Invoice with Gemini...</p>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="text-success" size={48} color="#10b981" />
            <p style={{ marginTop: '1rem', fontWeight: 600 }}>Extracted Successfully!</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Click or drag another to continue</p>
          </>
        ) : (
          <>
            <Upload className="text-muted" size={48} color="var(--primary)" />
            <p style={{ marginTop: '1rem', fontWeight: 600, fontSize: '1.25rem' }}>
              {isDragActive ? 'Drop it here!' : 'Upload Invoice'}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Drag & Drop or Click to browse (PDF, JPEG, PNG)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadArea;

