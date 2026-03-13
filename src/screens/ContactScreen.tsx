import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Instagram, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left Side: Info */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-8">
              Get in <span className="text-[#ff6600]">touch.</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium mb-12 leading-relaxed max-w-lg">
              Have a question about a deal? Want to partner with us? 
              Or just want to say hello? We'd love to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Mail className="w-6 h-6 text-[#ff6600]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-500">support@gadgetprice.ng</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Instagram className="w-6 h-6 text-[#ff6600]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">Social Media</h3>
                  <p className="text-gray-500">@ditechinc_ on Instagram</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-50 rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm"
        >
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Message Sent!</h2>
              <p className="text-gray-500 mb-8 max-w-xs">
                Thank you for reaching out. We'll get back to you as soon as possible.
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-gray-800 transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                  Full Name
                </label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600] transition-all text-gray-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                  Email Address
                </label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600] transition-all text-gray-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                  Message
                </label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600] transition-all text-gray-900 font-medium resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={status === 'loading'}
                className={cn(
                  "w-full py-5 bg-[#ff6600] text-white rounded-2xl font-black text-lg shadow-lg shadow-[#ff6600]/20 hover:bg-[#e65c00] transition-all flex items-center justify-center gap-3",
                  status === 'loading' && "opacity-70 cursor-not-allowed"
                )}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
