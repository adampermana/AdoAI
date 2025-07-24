import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Zap, Shield, Sparkles, ArrowRight, Brain, Cpu, Star } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Video Background - menggunakan CSS yang sudah ada */}
      <div id="video-background">
        <video
          src="https://openaicomproductionae4b.blob.core.windows.net/production-twill-01/121dd5e0-eaea-424d-bdf2-db02ca1f5e55/gpt-4-92586ac_1080p60.mp4"
          autoPlay
          muted
          loop
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        />
      </div>

      {/* Main Content - menggunakan #content dari CSS */}
      <main id="content" className="sm:p-8 px-4 py-8 w-full min-h-screen">
        <section className="max-w-7xl mx-auto">
          {/* Hero Section dengan overlay untuk readability */}
          <div className="relative">
            {/* Dark overlay untuk text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-2xl"></div>
            
            <div className="relative z-10 text-center py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-100 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Powered by Forgecode API
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-extrabold text-white text-4xl md:text-6xl mb-6"
              >
                Introducing AdoAI, Your Most{' '}
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Advanced AI System
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-2 text-white text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
              >
                We've integrated multiple AI models including Claude 3, GPT-4, and more through Forgecode API. 
                Switch between models seamlessly to get the perfect response for any task - from creative writing to complex analysis.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link to="/chat">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Try AdoAI Now ?</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                >
                  Explore Models
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section dengan backdrop blur */}
        <section className="py-20 mt-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="glass rounded-2xl p-8 backdrop-blur-md">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Why Choose AdoAI?
                </h2>
                <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                  Experience the power of multiple AI models through one beautiful interface
                </p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Brain}
                title="Multiple AI Models"
                description="Access Claude 3 Opus, Sonnet, Haiku, GPT-4, and GPT-3.5 Turbo through one unified interface."
                delay={0.2}
              />
              <FeatureCard
                icon={Zap}
                title="Real-time Streaming"
                description="Get responses as they're generated with smooth streaming technology for better user experience."
                delay={0.4}
              />
              <FeatureCard
                icon={Shield}
                title="Secure & Private"
                description="Your conversations are encrypted and protected with enterprise-grade security measures."
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* Model Showcase */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="glass rounded-2xl p-8 backdrop-blur-md">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Choose Your AI Model
                </h2>
                <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                  Each model excels at different tasks. Switch anytime during conversation.
                </p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ModelCard
                name="Claude 3 Opus"
                provider="Anthropic"
                description="Most capable model for complex reasoning and analysis"
                features={["Advanced Analysis", "Research Tasks", "Complex Problem Solving"]}
                icon={Brain}
                color="purple"
                delay={0.2}
              />
              <ModelCard
                name="Claude 3 Sonnet"
                provider="Anthropic"
                description="Balanced performance and speed - perfect for most tasks"
                features={["General Chat", "Writing", "Coding", "Explanations"]}
                icon={Star}
                color="blue"
                delay={0.4}
              />
              <ModelCard
                name="Claude 3 Haiku"
                provider="Anthropic"
                description="Fastest and most economical for quick responses"
                features={["Quick Answers", "Simple Tasks", "Fast Processing"]}
                icon={Zap}
                color="green"
                delay={0.6}
              />
              <ModelCard
                name="GPT-4"
                provider="OpenAI"
                description="Excellent for creative and analytical tasks"
                features={["Creative Writing", "Problem Solving", "Analysis"]}
                icon={Cpu}
                color="orange"
                delay={0.8}
              />
              <ModelCard
                name="GPT-3.5 Turbo"
                provider="OpenAI"
                description="Fast and efficient for everyday conversations"
                features={["Quick Chat", "General Tasks", "Coding Help"]}
                icon={MessageSquare}
                color="teal"
                delay={1.0}
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-12 text-center backdrop-blur-md"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Experience the Future?
              </h2>
              <p className="text-xl text-gray-200 mb-8 opacity-90">
                Join thousands who are already using AdoAI's multi-model approach to get better AI responses
              </p>
              <Link to="/chat">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Start Your First Chat</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="glass rounded-xl p-8 hover:bg-white/20 transition-all duration-300 backdrop-blur-md hover-lift"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-200 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

const ModelCard = ({ name, provider, description, features, icon: Icon, color, delay }) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    teal: 'from-teal-500 to-teal-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass rounded-xl p-6 hover:bg-white/20 transition-all duration-300 backdrop-blur-md hover-lift"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-1">
        {name}
      </h3>
      <p className="text-sm text-gray-300 mb-3">
        by {provider}
      </p>
      <p className="text-gray-200 mb-4 text-sm">
        {description}
      </p>
      
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center text-sm text-gray-300">
            <div className={`w-2 h-2 bg-gradient-to-r ${colorClasses[color]} rounded-full mr-2`}></div>
            {feature}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Home;