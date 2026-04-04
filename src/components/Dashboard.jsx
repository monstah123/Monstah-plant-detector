import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, TreePine, Heart, Trash2, ScanLine, Eye, Search, X } from 'lucide-react';
import { getHealthColor } from '../utils/plantIdentifier';

export default function Dashboard({ plants, onDeletePlant, onSwitchToDetect, onRevisitPlant }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlants = plants.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.scientific.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.family && p.family.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const avgHealth = plants.length
    ? Math.round(plants.reduce((sum, p) => sum + p.health, 0) / plants.length)
    : 0;

  if (plants.length === 0) {
    return (
      <motion.div
        className="empty-dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <TreePine size={64} className="empty-icon" />
        <h3>No plants detected yet</h3>
        <p>Start by scanning a plant to build your collection!</p>
        <button className="btn-primary" onClick={onSwitchToDetect} id="btn-start-scanning">
          <ScanLine size={16} /> Start Scanning
        </button>
      </motion.div>
    );
  }

  return (
    <div className="dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>My Plant Collection</h2>
      </motion.div>

      <div className="dashboard-controls">
        <motion.div 
          className="search-bar"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search your collection..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </motion.div>
      </div>

      <motion.div
        className="dashboard-stats"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="stat-card">
          <div className="stat-value">{plants.length}</div>
          <div className="stat-label">Plants Detected</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: getHealthColor(avgHealth) }}>{avgHealth}%</div>
          <div className="stat-label">Avg Health Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{new Set(plants.map(p => p.family)).size}</div>
          <div className="stat-label">Plant Families</div>
        </div>
      </motion.div>

      <div className="plant-grid">
        <AnimatePresence mode="popLayout">
          {filteredPlants.length > 0 ? (
            filteredPlants.map((plant, index) => (
              <motion.div
                key={plant.id}
                className="plant-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <img src={plant.imageUrl} alt={plant.name} />
                <div className="plant-card-body">
                  <h3>{plant.name}</h3>
                  <p className="card-scientific">{plant.scientific}</p>
                  <div className="card-health">
                    <span className="health-dot" style={{ background: getHealthColor(plant.health) }} />
                    {plant.health}% Health
                  </div>
                  <p className="card-date">{new Date(plant.detectedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '13px', padding: '8px', background: '#ecfdf5', color: '#10b981', border: '1px solid #10b981' }}
                      onClick={() => onRevisitPlant(plant)}
                    >
                      <Eye size={14} /> Revisit
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '13px', padding: '8px' }}
                      onClick={() => onDeletePlant(plant.id)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="no-search-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Search size={48} />
              <p>No plants found matching "{searchTerm}"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
