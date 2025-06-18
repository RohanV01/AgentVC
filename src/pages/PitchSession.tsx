import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Building, Zap, Target, Brain, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PitchSession: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const personas = [
    {
      id: 'angel',
      name: 'Angel Investor',
      subtitle: 'The Visionary Believer',
      icon: <User className="w-10 h-10 text-white" />,
      philosophy: '"I invest in people and big ideas first, businesses second. Show me your passion and a problem you\'re uniquely obsessed with solving."',
      focus: [
        'Compelling founder story',
        'Deep connection to the problem',
        'Massive vision and potential',
        'Evidence of grit and resourcefulness'
      ],
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-500/10 to-purple-600/10',
      borderColor: 'border-indigo-500/30',
      hoverBorder: 'hover:border-indigo-500/50'
    },
    {
      id: 'seed',
      name: 'Seed VC',
      subtitle: 'The Pattern Matcher',
      icon: <Building className="w-10 h-10 text-white" />,
      philosophy: '"I look for early signs of product-market fit and a massive market opportunity. I need to see a clear path from your first 100 users to your first 10,000."',
      focus: [
        'Target customer understanding',
        'Market size validation (TAM/SAM/SOM)',
        'Early traction indicators',
        'Scalable go-to-market strategy'
      ],
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/10 to-pink-600/10',
      borderColor: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-500/50'
    }
  ];

  const startSession = () => {
    if (selectedPersona) {
      alert('Backend functionality not implemented yet. This would start an AI-powered pitch session.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header 
        className="header-glass shadow-lg border-b border-slate-700/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center h-16">
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              whileHover={{ x: -4 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto container-padding py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div 
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 border border-slate-600/30"
            whileHover={{ scale: 1.05 }}
          >
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-slate-300">Choose Your Investor</span>
          </motion.div>
          
          <h1 className="text-display mb-6 text-gradient">
            Practice with AI
            <br />
            <span className="text-gradient-accent">Investors</span>
          </h1>
          <p className="text-subtitle max-w-4xl mx-auto">
            Each AI investor has different priorities and questioning patterns.
            <br />
            <span className="text-white font-semibold">Choose your practice partner and start training.</span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
          {personas.map((persona, index) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative card hover-lift cursor-pointer transition-all duration-300 group ${
                selectedPersona === persona.id
                  ? `${persona.borderColor} shadow-xl scale-105 glow-accent`
                  : `border-slate-700/30 ${persona.hoverBorder} hover:shadow-lg`
              }`}
              onClick={() => setSelectedPersona(persona.id)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${persona.bgGradient} rounded-2xl opacity-0 transition-opacity duration-300 ${
                  selectedPersona === persona.id ? 'opacity-100' : 'group-hover:opacity-50'
                }`}
              />
              
              <div className="relative z-10 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className={`bg-gradient-to-r ${persona.gradient} p-4 rounded-xl shadow-lg relative overflow-hidden`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative z-10">
                      {persona.icon}
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {persona.name}
                    </h3>
                    <p className="text-slate-400 font-semibold text-lg">
                      {persona.subtitle}
                    </p>
                  </div>
                </div>

                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <p className="text-slate-300 italic text-sm leading-relaxed glass p-4 rounded-xl border border-slate-700/30">
                    {persona.philosophy}
                  </p>
                </motion.div>

                <div>
                  <h4 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Focus Areas:
                  </h4>
                  <ul className="space-y-3">
                    {persona.focus.map((item, idx) => (
                      <motion.li 
                        key={idx} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                      >
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 mt-2 flex-shrink-0"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                        />
                        <span className="text-slate-300 font-medium">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <AnimatePresence>
                {selectedPersona === persona.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -top-3 -right-3"
                  >
                    <motion.div 
                      className={`bg-gradient-to-r ${persona.gradient} text-white rounded-full p-3 shadow-lg`}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Target className="w-6 h-6" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedPersona && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                className="card-elevated max-w-2xl mx-auto mb-8 glow-accent"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-12 h-12 text-indigo-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">Ready to Practice</h3>
                </div>
                <p className="text-slate-300 mb-6">
                  You've selected the {personas.find(p => p.id === selectedPersona)?.name}. 
                  This AI investor will ask questions based on their investment philosophy and focus areas.
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm mb-6">
                  {[
                    { label: "AI Powered", color: "bg-green-500" },
                    { label: "Real-time Feedback", color: "bg-indigo-500" },
                    { label: "Personalized", color: "bg-purple-500" }
                  ].map((item, index) => (
                    <motion.div 
                      key={item.label}
                      className="flex items-center justify-center gap-2 text-slate-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div 
                        className={`w-2 h-2 ${item.color} rounded-full`}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      />
                      <span>{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={startSession}
                className="btn-primary text-2xl px-12 py-6 relative group overflow-hidden"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10 flex items-center gap-4">
                  <Play className="w-8 h-8" />
                  Start Practice Session
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Zap className="w-8 h-8" />
                  </motion.div>
                </div>
              </motion.button>
              
              <motion.p 
                className="text-slate-500 mt-6 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Get ready for realistic investor questions and feedback
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PitchSession;