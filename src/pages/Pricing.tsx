import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Star, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Founder",
      price: "Free",
      subtitle: "Perfect for getting started",
      icon: <Star className="w-6 h-6 text-blue-600" />,
      features: [
        "3 pitch sessions per month",
        "1 investor persona (Angel)",
        "Basic feedback reports",
        "Pitch deck upload (1 deck)",
        "Email support"
      ],
      cta: "Get Started Free",
      popular: false,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      name: "Pro",
      price: "$29",
      subtitle: "For serious founders",
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      features: [
        "Unlimited pitch sessions",
        "All 3 investor personas",
        "Advanced AI feedback",
        "Unlimited pitch decks",
        "Session recordings",
        "Progress tracking",
        "Priority support",
        "Export reports"
      ],
      cta: "Coming Soon",
      popular: true,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Enterprise",
      price: "Custom",
      subtitle: "For accelerators & VCs",
      icon: <Crown className="w-6 h-6 text-yellow-600" />,
      features: [
        "Everything in Pro",
        "Custom investor personas",
        "White-label solution",
        "Batch user management",
        "Advanced analytics",
        "API access",
        "Dedicated support",
        "Custom integrations"
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const faqs = [
    {
      question: "Is the free plan really free?",
      answer: "Yes! The Founder plan is completely free and includes 3 pitch sessions per month with our Angel investor persona. No credit card required."
    },
    {
      question: "When will the Pro plan be available?",
      answer: "We're currently in beta and the Pro plan will be available in Q2 2024. Sign up for free to be notified when it launches."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Once the Pro plan is available, you can upgrade or downgrade at any time. Your billing will be prorated accordingly."
    },
    {
      question: "Is my pitch deck data secure?",
      answer: "Absolutely. We use enterprise-grade security and encryption. Your pitch deck and session data are never shared with third parties."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment in full."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade as you grow. No hidden fees, no complicated tiers.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl border-2 transition-all duration-300 ${
                plan.popular
                  ? 'border-purple-500 shadow-lg shadow-purple-500/25 scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`bg-gradient-to-r ${plan.gradient} p-2 rounded-lg`}>
                    <div className="text-white">
                      {plan.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {plan.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.price !== "Free" && plan.price !== "Custom" && (
                      <span className="text-gray-600">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                      : plan.cta === 'Contact Sales'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg'
                  } ${plan.cta === 'Coming Soon' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={plan.cta === 'Coming Soon'}
                >
                  {plan.cta}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Compare Features
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-gray-900 font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">Founder</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">Pro</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { feature: "Pitch Sessions", founder: "3/month", pro: "Unlimited", enterprise: "Unlimited" },
                  { feature: "Investor Personas", founder: "1", pro: "3", enterprise: "Custom" },
                  { feature: "Pitch Decks", founder: "1", pro: "Unlimited", enterprise: "Unlimited" },
                  { feature: "Session Recordings", founder: "✗", pro: "✓", enterprise: "✓" },
                  { feature: "Advanced Analytics", founder: "✗", pro: "✓", enterprise: "✓" },
                  { feature: "API Access", founder: "✗", pro: "✗", enterprise: "✓" },
                  { feature: "White Label", founder: "✗", pro: "✗", enterprise: "✓" }
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-4 px-6 text-gray-900 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.founder}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.pro}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 rounded-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Practicing?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of founders who've improved their pitch with AgentVC. 
            Start free and upgrade when you're ready.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200"
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;