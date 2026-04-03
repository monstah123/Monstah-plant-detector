import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, X, ScanLine } from 'lucide-react';

export default function UploadZone({ onImageSelected, selectedImage, onClear, onAnalyze, isAnalyzing }) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => onImageSelected(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) processFile(file);
    };
    input.click();
  };

  return (
    <AnimatePresence mode="wait">
      {!selectedImage ? (
        <motion.div
          key="upload"
          className={`upload-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          id="upload-zone"
        >
          <Upload size={40} className="upload-icon" />
          <h3>Drop your plant photo here</h3>
          <p>or click to browse • PNG, JPG up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="file-input"
          />
          <div className="upload-actions" onClick={(e) => e.stopPropagation()}>
            <button className="btn-primary" onClick={() => fileInputRef.current?.click()} id="btn-browse">
              <Upload size={16} /> Browse Files
            </button>
            <button className="btn-secondary" onClick={handleCameraCapture} id="btn-camera">
              <Camera size={16} /> Use Camera
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="image-preview">
            <img src={selectedImage} alt="Selected plant" />
            <button className="remove-btn" onClick={onClear} id="btn-remove-image">
              <X size={18} />
            </button>
          </div>
          {!isAnalyzing && (
            <motion.div
              style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button className="btn-primary" onClick={onAnalyze} id="btn-analyze">
                <ScanLine size={16} /> Analyze Plant
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
