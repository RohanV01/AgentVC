import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Resources: React.FC = () => {
  const navigate = useNavigate();

  const articles = [
    {
      id: 1,
      title: "The Ultimate Guide to Seed Funding",
      excerpt: "Everything you need to know about raising your first institutional round.",
      readTime: "8 min read",
      author: "Sarah Chen",
      category: "Fundraising",
      image: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 2,
      title: "10 Questions Every Investor Will Ask",
      excerpt: "Prepare for the most common questions and how to answer them confidently.",
      readTime: "6 min read",
      author: "Michael Torres",
      category: "Pitch Prep",
      image: "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 3,
      title: "Building Your Pitch Deck: A Step-by-Step Guide",
      excerpt: "Create a compelling pitch deck that tells your story and wins investors.",
      readTime: "12 min read",
      author: "Emily Rodriguez",
      category: "Pitch Deck",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 4,
      title: "Understanding Valuation and Equity",
      excerpt: "Navigate the complexities of startup valuation and equity distribution.",
      readTime: "10 min read",
      author: "David Kim",
      category: "Valuation",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 5,
      title: "Due Diligence: What to Expect",
      excerpt: "A comprehensive guide to the due diligence process and how to prepare.",
      readTime: "15 min read",
      author: "Lisa Park",
      category: "Due Diligence",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      id: 6,
      title: "Negotiating Your Term Sheet",
      excerpt: "Key terms to understand and negotiate when you receive a term sheet.",
      readTime: "9 min read",
      author: "James Wilson",
      category: "Term Sheets",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const categories = [
    "All",
    "Fundraising",
    "Pitch Prep",
    "Pitch Deck",
    "Valuation",
    "Due Diligence",
    "Term Sheets"
  ];

  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredArticles = selectedCategory === "All" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Fundraising Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert guides, tips, and insights to help you navigate the fundraising journey 
            and build a successful startup.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 rounded-2xl"
        >
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-3xl font-bold mb-4">
            More Resources Coming Soon
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            We're constantly adding new guides, templates, and resources to help you succeed. 
            Check back regularly for the latest fundraising insights.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;