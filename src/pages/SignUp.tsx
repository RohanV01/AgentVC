import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Building, Briefcase, Target, 
  DollarSign, FileText, Globe, Linkedin, ChevronDown,
  Zap, Mail, Lock, AlertCircle, RefreshCw, CheckCircle, Brain
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    founder_name: '',
    startup_name: '',
    website: '',
    linkedin_profile: '',
    one_liner_pitch: '',
    industry: '',
    business_model: '',
    funding_round: '',
    raise_amount: '',
    use_of_funds: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const industries = [
    'FinTech', 'HealthTech', 'EdTech', 'SaaS', 'E-commerce', 'Marketplace',
    'AI/ML', 'Blockchain', 'IoT', 'Cybersecurity', 'CleanTech', 'FoodTech',
    'PropTech', 'RetailTech', 'TravelTech', 'Gaming', 'Media', 'Other'
  ];

  const businessModels = [
    'B2B SaaS', 'B2C Subscription', 'Marketplace', 'E-commerce', 'Freemium',
    'Enterprise Software', 'Mobile App', 'Hardware', 'Consulting', 'Other'
  ];

  const fundingRounds = [
    'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Bridge Round'
  ];

  const clearExistingData = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      console.log('🧹 Clearing existing data...');
      
      // Clear any existing session
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('❌ Error signing out:', signOutError);
      }
      
      // Clear local storage
      localStorage.clear();
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        founder_name: '',
        startup_name: '',
        website: '',
        linkedin_profile: '',
        one_liner_pitch: '',
        industry: '',
        business_model: '',
        funding_round: '',
        raise_amount: '',
        use_of_funds: ''
      });
      
      setSuccess('Data cleared successfully. You can now try signing up again.');
      console.log('✅ Data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      setError('Failed to clear existing data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate required fields
      if (!formData.email || !formData.password || !formData.founder_name || 
          !formData.startup_name || !formData.one_liner_pitch || !formData.industry || 
          !formData.business_model || !formData.funding_round || !formData.raise_amount || 
          !formData.use_of_funds) {
        setError('Please fill in all required fields');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      
      console.log('🚀 Starting signup process with complete data');
      
      // Prepare all profile data for signup
      const profileData = {
        founder_name: formData.founder_name,
        website: formData.website || null,
        linkedin_profile: formData.linkedin_profile || null,
        startup_info: {
          startup_name: formData.startup_name,
          one_liner_pitch: formData.one_liner_pitch,
          industry: formData.industry,
          business_model: formData.business_model,
          funding_round: formData.funding_round,
          raise_amount: formData.raise_amount,
          use_of_funds: formData.use_of_funds
        }
      };

      console.log('📋 Profile data prepared:', profileData);
      
      // Create account with all profile data at once
      await signup(formData.email, formData.password, profileData);
      
      setSuccess('🎉 Account created successfully! Your data has been saved. Redirecting to dashboard...');
      console.log('🎉 Signup completed successfully, navigating to dashboard');
      
      // Small delay to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      
      // Check if user already exists and redirect to sign in
      if (error.message && (
        error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('user_already_exists') ||
        error.message.toLowerCase().includes('user already exists') ||
        error.message.toLowerCase().includes('please sign in instead')
      )) {
        console.log('⚠️ User already exists, redirecting to sign in');
        navigate('/signin', { 
          state: { 
            message: 'An account with this email already exists. Please sign in instead.',
            email: formData.email 
          }
        });
        return;
      }
      
      setError(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const formSections = [
    {
      title: "Account Information",
      icon: <Lock className="w-5 h-5 text-indigo-400" />,
      fields: [
        {
          name: "email",
          label: "Email Address *",
          type: "email",
          icon: <Mail className="w-5 h-5" />,
          placeholder: "founder@startup.com",
          required: true
        },
        {
          name: "password",
          label: "Password *",
          type: "password",
          icon: <Lock className="w-5 h-5" />,
          placeholder: "Min 6 characters",
          required: true,
          minLength: 6
        }
      ]
    },
    {
      title: "Personal & Company Information",
      icon: <User className="w-5 h-5 text-purple-400" />,
      fields: [
        {
          name: "founder_name",
          label: "Your Full Name *",
          type: "text",
          icon: <User className="w-5 h-5" />,
          placeholder: "e.g., Sarah Chen",
          required: true
        },
        {
          name: "startup_name",
          label: "Startup Name *",
          type: "text",
          icon: <Building className="w-5 h-5" />,
          placeholder: "e.g., TechFlow AI",
          required: true
        },
        {
          name: "website",
          label: "Company Website",
          type: "url",
          icon: <Globe className="w-5 h-5" />,
          placeholder: "https://yourcompany.com"
        },
        {
          name: "linkedin_profile",
          label: "LinkedIn Profile",
          type: "url",
          icon: <Linkedin className="w-5 h-5" />,
          placeholder: "https://linkedin.com/in/yourname"
        }
      ]
    },
    {
      title: "Business Context",
      icon: <Target className="w-5 h-5 text-cyan-400" />,
      fields: [
        {
          name: "one_liner_pitch",
          label: "One-Liner Pitch (Elevator Pitch) *",
          type: "textarea",
          icon: <Target className="w-5 h-5" />,
          placeholder: "We help small businesses automate their accounting with AI-powered bookkeeping software.",
          required: true,
          rows: 3
        },
        {
          name: "industry",
          label: "Industry / Sector *",
          type: "select",
          icon: <Briefcase className="w-5 h-5" />,
          options: industries,
          required: true
        },
        {
          name: "business_model",
          label: "Business Model *",
          type: "select",
          icon: <Building className="w-5 h-5" />,
          options: businessModels,
          required: true
        }
      ]
    },
    {
      title: "Funding Details",
      icon: <DollarSign className="w-5 h-5 text-green-400" />,
      fields: [
        {
          name: "funding_round",
          label: "Funding Round *",
          type: "select",
          icon: <Target className="w-5 h-5" />,
          options: fundingRounds,
          required: true
        },
        {
          name: "raise_amount",
          label: "Raise Amount *",
          type: "text",
          icon: <DollarSign className="w-5 h-5" />,
          placeholder: "e.g., $500k, $2M, $10M",
          required: true
        },
        {
          name: "use_of_funds",
          label: "Use of Funds (Top 3 priorities) *",
          type: "textarea",
          icon: <FileText className="w-5 h-5" />,
          placeholder: "1. Hire 3 engineers to accelerate product development\n2. Marketing and customer acquisition\n3. Expand to new markets",
          required: true,
          rows: 4
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-pattern-dots opacity-30" />
      
      {/* Header */}
      <motion.header 
        className="header-glass border-b border-slate-700/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              <motion.span 
                className="text-xl font-bold text-white"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                AgentVC
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto container-padding py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated glow-subtle"
        >
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-headline text-white mb-2">
              Join the Waitlist
            </h2>
            <p className="text-slate-400 text-lg">
              Complete your profile to get started with AgentVC
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="status-error p-4 rounded-lg mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span>{error}</span>
                    {error.includes('already registered') && (
                      <div className="mt-3">
                        <motion.button
                          onClick={clearExistingData}
                          disabled={loading}
                          className="btn-secondary text-sm px-4 py-2 disabled:opacity-50"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Clear Data & Try Again
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div 
                className="status-success p-4 rounded-lg mb-6 flex items-start gap-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            {formSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + sectionIndex * 0.1 }}
                className="glass rounded-xl p-6 border border-slate-700/30"
              >
                <h3 className="text-title text-white mb-4 flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </h3>
                
                <div className={`grid gap-6 ${section.fields.length > 2 ? 'md:grid-cols-2' : ''}`}>
                  {section.fields.map((field, fieldIndex) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + fieldIndex * 0.05 }}
                      className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                    >
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {field.label}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-slate-500">
                          {field.icon}
                        </div>
                        
                        {field.type === 'select' ? (
                          <>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
                            <motion.select
                              name={field.name}
                              value={formData[field.name as keyof typeof formData]}
                              onChange={handleInputChange}
                              required={field.required}
                              disabled={loading}
                              className="input-field pl-10 pr-10 appearance-none"
                              whileFocus={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                            >
                              <option value="">Select {field.label.replace(' *', '').toLowerCase()}</option>
                              {field.options?.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </motion.select>
                          </>
                        ) : field.type === 'textarea' ? (
                          <motion.textarea
                            name={field.name}
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handleInputChange}
                            required={field.required}
                            rows={field.rows}
                            disabled={loading}
                            className="input-field pl-10 resize-none"
                            placeholder={field.placeholder}
                            whileFocus={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          />
                        ) : (
                          <motion.input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handleInputChange}
                            required={field.required}
                            minLength={field.minLength}
                            disabled={loading}
                            className="input-field pl-10"
                            placeholder={field.placeholder}
                            whileFocus={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-4 relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0"
                whileHover={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <motion.div 
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Creating Account...
                  </>
                ) : (
                  'Create Account & Join Waitlist'
                )}
              </div>
            </motion.button>
          </form>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-slate-400">
              Already have an account?
              <Link
                to="/signin"
                className="text-white hover:text-slate-300 font-semibold ml-1 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;