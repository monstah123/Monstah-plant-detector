import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Cloud, Volume2, ArrowRight } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  const features = [
    {
      icon: <Leaf className="icon-green" />,
      title: "AI Species ID",
      desc: "Instantly identify 10,000+ plant species with 99% accuracy using GPT-4o Vision."
    },
    {
      icon: <ShieldCheck className="icon-blue" />,
      title: "Health Diagnostic",
      desc: "Detect leaf spots, root rot, and pest infestations before they spread."
    },
    {
      icon: <Cloud className="icon-purple" />,
      title: "Cloud Archive",
      desc: "Securely store high-res plant history in AWS S3, accessible from any device."
    },
    {
      icon: <Volume2 className="icon-yellow" />,
      title: "Premium Haptics",
      desc: "Experience a reactive interface with organic sound design for every interaction."
    }
  ];

  return (
    <div className="landing-container">
      {/* GLOWING ORBS FOR DEPTH */}
      <div className="bg-glow-1" />
      <div className="bg-glow-2" />

      <motion.section 
        className="landing-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="badge">VERSION 2.0 LIVE</div>
        <h1 className="hero-text">
          The Future of <span>Plant Care</span> is Autonomous.
        </h1>
        <p className="hero-sub">
          Monstah Detect combines sophisticated AI with cloud-native persistence to give your garden a voice. 
          Stop guessing, start knowing.
        </p>
        
        <div className="hero-actions">
          <motion.button 
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
          >
            Launch Scanner <ArrowRight size={20} />
          </motion.button>
          <button className="btn-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
            See Features
          </button>
        </div>
      </motion.section>

      <section id="features" className="features-grid">
        {features.map((f, i) => (
          <motion.div 
            key={i}
            className="feature-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </motion.div>
        ))}
      </section>

      <footer className="landing-footer">
        <p>© 2026 Monstah Detect • Powered by OpenAI & AWS</p>
      </footer>
    </div>
  );
};

export default LandingPage;
