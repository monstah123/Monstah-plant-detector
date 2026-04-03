import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import UploadZone from './components/UploadZone';
import ResultCard from './components/ResultCard';
import Dashboard from './components/Dashboard';
import { identifyPlant, deletePlantFromS3 } from './utils/plantIdentifier';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('detect');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [savedPlants, setSavedPlants] = useState(() => {
    try {
      const stored = localStorage.getItem('monstah-plants');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isSaved, setIsSaved] = useState(false);

  // --- PREMIUM UI SOUND SYSTEM ---
  useEffect(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const playPop = () => {
      // Browsers block audio until first user interaction, resume securely
      if (audioCtx.state === 'suspended') audioCtx.resume().catch(()=>console.log("Audio blocked"));
      
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      // Crisp organic synthetic pop
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.04);
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.05);
    };

    const handleInteraction = (e) => {
      // Trigger sound ONLY if they hover over a button or interactive card
      if (e.target.closest('button') || e.target.closest('.plant-card')) {
        playPop();
      }
    };

    // Use capturing phase so we catch the hover before elements stop propagation
    document.addEventListener('mouseenter', handleInteraction, true);
    document.addEventListener('touchstart', handleInteraction, { passive: true });

    return () => {
      document.removeEventListener('mouseenter', handleInteraction, true);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);
  // --- END SOUND SYSTEM ---

  useEffect(() => {
    localStorage.setItem('monstah-plants', JSON.stringify(savedPlants));
  }, [savedPlants]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const plantResult = await identifyPlant(selectedImage);
      setResult(plantResult);
    } catch (err) {
      console.error('Analysis failed:', err);
      
      // Specifically grab the backend error message if Vercel kicks it back
      const backendError = err.response?.data?.error;
      const networkError = err.message;
      
      alert(`🚨 ANALYSIS FAILED\n\nReason: ${backendError || networkError}\n\nIf testing locally, start Vercel Dev. If on Vercel, check the Logs tab.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewScan = () => {
    setSelectedImage(null);
    setResult(null);
    setIsSaved(false);
  };

  const handleSavePlant = () => {
    if (result && !isSaved) {
      const plant = {
        ...result,
        id: Date.now().toString(),
        imageUrl: result.imageUrl || selectedImage,
      };
      setSavedPlants((prev) => [plant, ...prev]);
      setIsSaved(true);
    }
  };

  const handleDeletePlant = (id) => {
    const plantToDelete = savedPlants.find(p => p.id === id);
    // Delete from AWS silently in the background
    if (plantToDelete && plantToDelete.imageUrl && plantToDelete.imageUrl.includes('.amazonaws.com/')) {
        deletePlantFromS3(plantToDelete.imageUrl);
    }
    // Delete from Local UI
    setSavedPlants((prev) => prev.filter((p) => p.id !== id));
  };
  
  const handleRevisitPlant = (plant) => {
    setResult(plant);
    setSelectedImage(plant.imageUrl);
    setIsSaved(true);
    setCurrentView('detect');
  };

  return (
    <div className="app">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <AnimatePresence mode="wait">
        {currentView === 'detect' ? (
          <motion.main
            key="detect"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <section className="hero">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1>Identify Any <span>Plant</span> Instantly</h1>
                <p>Upload a photo and let Monstah Detect analyze your plant species, health, and care needs in seconds.</p>
              </motion.div>

              {!result && (
                <UploadZone
                  onImageSelected={setSelectedImage}
                  selectedImage={selectedImage}
                  onClear={handleNewScan}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />
              )}

              {isAnalyzing && (
                <motion.div
                  className="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="spinner" />
                  <h3>Analyzing your plant...</h3>
                  <p>Our AI is identifying species, checking health markers, and preparing care tips.</p>
                </motion.div>
              )}
            </section>

            {result && (
              <ResultCard
                result={result}
                imageUrl={selectedImage}
                onNewScan={handleNewScan}
                onSave={handleSavePlant}
                isSaved={isSaved}
              />
            )}
          </motion.main>
        ) : (
          <motion.main
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard
              plants={savedPlants}
              onDeletePlant={handleDeletePlant}
              onRevisitPlant={handleRevisitPlant}
              onSwitchToDetect={() => setCurrentView('detect')}
            />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
