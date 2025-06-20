import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Play, 
  BarChart3, 
  User, 
  LogOut,
  Plus,
  Clock,
  TrendingUp,
  Zap,
  Target,
  Award,
  Rocket,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  Heart,
  Star,
  Users,
  Building2,
  Briefcase,
  Brain,
  FolderOpen,
  Eye,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import PitchDeckViewer from '../components/PitchDeckViewer';

const Dashboard: React.FC = () => {
  const { user, userProfile, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [pitchDecks, setPitchDecks] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [loadingDecks, setLoadingDecks] = useState(true);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [user, loading, navigate]);

  // Load pitch decks
  useEffect(() => {
    if (user) {
      loadPitchDecks();
    }
  }, [user]);

  const loadPitchDecks = async () => {
    try {
      setLoadingDecks(true);
      const decks = await apiService.getPitchDecks();
      setPitchDecks(decks);
    } catch (error: any) {
      console.error('Error loading pitch decks:', error);
    } finally {
      setLoadingDecks(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-lg text-slate-300">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Don't render if no user
  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploadError('');
    setUploadSuccess('');
    
    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      const result = await apiService.uploadPitchDeck(file);
      setUploadSuccess(`Successfully uploaded and analyzed: ${result.fileName}`);
      await loadPitchDecks(); // Refresh the list
      
      // Clear success message after 5 seconds
      setTimeout(() => setUploadSuccess(''), 5000);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDeck = async (deckId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      await apiService.deletePitchDeck(deckId);
      await loadPitchDecks(); // Refresh the list
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Failed to delete deck: ${error.message}`);
    }
  };

  const handleDownloadDeck = async (storagePath: string, fileName: string) => {
    try {
      const downloadUrl = await apiService.getDownloadUrl(storagePath);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Download error:', error);
      alert(`Failed to download deck: ${error.message}`);
    }
  };

  const handleViewDeck = (deckId: string) => {
    setSelectedDeckId(deckId);
  };

  // Mock session data
  const recentSessions = [
    {
      id: 1,
      persona: 'Angel Investor',
      score: 85,
      date: '2024-01-15',
      feedback: 'Strong passion and vision. Work on market size validation.'
    },
    {
      id: 2,
      persona: 'Seed VC',
      score: 78,
      date: '2024-01-12',
      feedback: 'Good traction indicators. Improve financial projections.'
    }
  ];

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
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  {userProfile?.startup_info?.startup_name || 'AgentVC Dashboard'}
                </h1>
                <p className="text-sm text-slate-400">{user?.email}</p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors"
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto container-padding py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated glow-accent relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent"
                animate={{ 
                  background: [
                    "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)",
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%)",
                    "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white">Welcome back, {userProfile?.founder_name || 'Founder'}!</h2>
                </div>
                <p className="text-slate-300 mb-6 text-lg">
                  Your pitch training platform is ready. Upload your deck and start practicing with AI investors.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/pitch-session')}
                  className="btn-primary text-lg px-8 py-4 relative group overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative z-10 flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Rocket className="w-6 h-6" />
                    </motion.div>
                    Start Practice Session
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Pitch Deck Upload */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <Upload className="w-6 h-6 text-indigo-400" />
                <h3 className="text-2xl font-bold text-white">Upload Your Pitch Deck</h3>
              </div>

              {/* Upload Status Messages */}
              <AnimatePresence>
                {uploadError && (
                  <motion.div 
                    className="status-error p-3 rounded-lg flex items-center gap-2 mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <AlertCircle className="w-5 h-5" />
                    {uploadError}
                  </motion.div>
                )}

                {uploadSuccess && (
                  <motion.div 
                    className="status-success p-3 rounded-lg flex items-center gap-2 mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    {uploadSuccess}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-500/10 glow-accent' 
                    : 'border-slate-600 hover:border-slate-500'
                } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                {uploading ? (
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div 
                      className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <h4 className="text-xl font-bold text-white mb-2">
                      Uploading & Analyzing...
                    </h4>
                    <p className="text-slate-400">
                      Extracting text and analyzing your pitch deck
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Upload className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    </motion.div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      Drop your pitch deck here
                    </h4>
                    <p className="text-slate-400 mb-6">
                      Upload your pitch deck to get personalized AI feedback and text analysis
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="deck-upload"
                      disabled={uploading}
                    />
                    <motion.label
                      htmlFor="deck-upload"
                      className="btn-primary inline-flex items-center gap-2 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-5 h-5" />
                      Choose File
                    </motion.label>
                    <p className="text-sm text-slate-500 mt-4">
                      PDF files only, max 10MB • Text will be automatically extracted and analyzed
                    </p>
                  </>
                )}
              </motion.div>

              {/* Loading State */}
              {loadingDecks && (
                <motion.div 
                  className="mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-slate-400">Loading your pitch decks...</p>
                </motion.div>
              )}

              {/* Uploaded Decks List or Empty State */}
              {!loadingDecks && (
                <>
                  {pitchDecks.length > 0 ? (
                    <motion.div 
                      className="mt-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Your Pitch Decks ({pitchDecks.length})
                      </h4>
                      <div className="space-y-3">
                        {pitchDecks.map((deck, index) => (
                          <motion.div
                            key={deck.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass rounded-xl p-4 hover:bg-slate-800/30 transition-all duration-300 border border-slate-700/30"
                            whileHover={{ x: 4 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <FileText className="w-6 h-6 text-indigo-400" />
                                <div className="flex-1">
                                  <h5 className="font-semibold text-white">{deck.file_name}</h5>
                                  <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <span>Uploaded {new Date(deck.created_at).toLocaleDateString()}</span>
                                    {deck.extractedData && (
                                      <>
                                        <span>•</span>
                                        <span>{deck.extractedData.extractionStats?.totalWords || 'N/A'} words</span>
                                        <span>•</span>
                                        <span>{deck.extractedData.pageCount || 'N/A'} pages</span>
                                        {deck.extractedData.extractionStats?.pagesWithOCR > 0 && (
                                          <>
                                            <span>•</span>
                                            <span className="text-orange-400">OCR used</span>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <motion.button
                                  onClick={() => handleViewDeck(deck.id)}
                                  className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
                                  title="View Content"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Eye className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                  onClick={() => handleDownloadDeck(deck.storage_path, deck.file_name)}
                                  className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
                                  title="Download"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Download className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                  onClick={() => handleDeleteDeck(deck.id, deck.file_name)}
                                  className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                                  title="Delete"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="mt-8 text-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <FolderOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      </motion.div>
                      <h4 className="text-lg font-semibold text-slate-300 mb-2">
                        No pitch decks yet
                      </h4>
                      <p className="text-slate-500">
                        Upload your first pitch deck to get started with AI feedback and text analysis
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>

            {/* Recent Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Recent Practice Sessions</h3>
              </div>
              
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl p-6 hover:bg-slate-800/30 transition-all duration-300 border border-slate-700/30"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white text-lg">
                        {session.persona}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-lg font-bold text-white">
                          {session.score}/100
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-3">
                      {session.feedback}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Your Progress</h3>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Pitch Decks", value: pitchDecks.length, icon: FileText },
                  { label: "Practice Sessions", value: recentSessions.length, icon: Play },
                  { 
                    label: "Average Score", 
                    value: `${recentSessions.length > 0 
                      ? Math.round(recentSessions.reduce((acc, s) => acc + s.score, 0) / recentSessions.length)
                      : 0}/100`,
                    icon: Target
                  },
                  { label: "Improvement", value: "+7%", icon: TrendingUp, isPositive: true }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <div className="flex items-center gap-2">
                      <stat.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400">{stat.label}</span>
                    </div>
                    <span className={`font-bold text-xl ${
                      stat.isPositive ? 'text-green-400' : 'text-white'
                    }`}>
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Your Profile</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Founder", value: userProfile?.founder_name || 'Not set' },
                  { label: "Company", value: userProfile?.startup_info?.startup_name || 'Not set' },
                  { label: "Industry", value: userProfile?.startup_info?.industry || 'Not set' },
                  { label: "Funding Stage", value: userProfile?.startup_info?.funding_round || 'Not set' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <p className="font-semibold text-white">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                {[
                  { 
                    icon: Play, 
                    label: "Start Practice Session", 
                    action: () => navigate('/pitch-session'),
                    primary: true
                  },
                  { icon: FileText, label: "View All Sessions", action: () => {} },
                  { icon: Award, label: "Download Report", action: () => {} }
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    onClick={action.action}
                    className={`w-full flex items-center gap-3 p-4 text-left rounded-xl transition-all group ${
                      action.primary 
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/30' 
                        : 'glass hover:bg-slate-800/30 border border-slate-700/30'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <action.icon className={`w-6 h-6 ${
                      action.primary ? 'text-indigo-400' : 'text-slate-400'
                    }`} />
                    <span className={`font-medium ${
                      action.primary ? 'text-white' : 'text-slate-300'
                    }`}>
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Pitch Deck Viewer Modal */}
      <AnimatePresence>
        {selectedDeckId && (
          <PitchDeckViewer
            deckId={selectedDeckId}
            onClose={() => setSelectedDeckId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;