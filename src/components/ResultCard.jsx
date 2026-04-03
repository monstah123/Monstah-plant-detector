import { motion } from 'framer-motion';
import { Sun, Droplets, Wind, Thermometer, Sparkles, RotateCcw, BookmarkPlus, Check } from 'lucide-react';
import { getHealthColor } from '../utils/plantIdentifier';

export default function ResultCard({ result, imageUrl, onNewScan, onSave, isSaved }) {
  const healthColor = getHealthColor(result.health);

  return (
    <motion.div
      className="results-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="result-card">
        <div className="result-header">
          <img src={imageUrl} alt={result.name} className="plant-thumb" />
          <div className="plant-info">
            <h2>{result.name}</h2>
            <p className="scientific">{result.scientific}</p>
          </div>
          <div className="confidence-badge">{result.confidence}% Match</div>
        </div>

        <div className="result-body">
          <div className="health-meter">
            <div className="label">
              <span>Plant Health</span>
              <span style={{ color: healthColor }}>{result.health}%</span>
            </div>
            <div className="bar">
              <motion.div
                className="fill"
                initial={{ width: 0 }}
                animate={{ width: `${result.health}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <Sun size={18} className="detail-icon" />
              <div className="detail-label">Light</div>
              <div className="detail-value">{result.light}</div>
            </div>
            <div className="detail-item">
              <Droplets size={18} className="detail-icon" />
              <div className="detail-label">Water</div>
              <div className="detail-value">{result.water}</div>
            </div>
            <div className="detail-item">
              <Wind size={18} className="detail-icon" />
              <div className="detail-label">Humidity</div>
              <div className="detail-value">{result.humidity}</div>
            </div>
            <div className="detail-item">
              <Thermometer size={18} className="detail-icon" />
              <div className="detail-label">Temperature</div>
              <div className="detail-value">{result.temperature}</div>
            </div>
          </div>

          <div className="care-tips">
            <h3><Sparkles size={16} /> Care Tips</h3>
            <ul>
              {result.tips.map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Check size={16} className="tip-icon" />
                  {tip}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="result-actions">
          <button className="btn-secondary" onClick={onNewScan} id="btn-new-scan">
            <RotateCcw size={16} /> New Scan
          </button>
          <button
            className="btn-primary"
            onClick={onSave}
            id="btn-save-plant"
            style={isSaved ? { opacity: 0.6, pointerEvents: 'none' } : {}}
          >
            <BookmarkPlus size={16} /> {isSaved ? 'Saved!' : 'Save to Dashboard'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
