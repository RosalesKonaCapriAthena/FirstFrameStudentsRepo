import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import emailjs from '@emailjs/browser';

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Replace these with your actual EmailJS values
      const SERVICE_ID = 'service_ghndhun';
      const TEMPLATE_ID = 'template_51lf1nk';
      const PUBLIC_KEY = '0wMfSsa4TgwxSoztk';
      
      // Create a more detailed message that includes sender info
      const detailedMessage = `Name: ${form.name}
Email: ${form.email}

Message:
${form.message}

---
This message was sent from the First Frame contact form.`;
      
      const templateParams = {
        from_name: form.name,
        from_email: form.email,
        message: detailedMessage,
        to_email: 'firstframestudents@gmail.com',
        // Additional parameters for better email formatting
        sender_name: form.name,
        sender_email: form.email,
        subject: `Contact Form Message from ${form.name}`,
      };
      
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setError('There was a problem sending your message. Please try again.');
      console.error('EmailJS error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 px-4 py-16 relative">
      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 bg-neutral-800 hover:bg-orange-500 text-white hover:text-white rounded-full p-2 shadow transition-colors duration-200 z-10"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Back</span>
      </button>
      <Card className="w-full max-w-lg bg-neutral-800 border-neutral-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-3xl text-center mb-2 font-['Merriweather',serif]">
            Contact Us
          </CardTitle>
          <p className="text-gray-300 text-center font-['Figtree',sans-serif]">
            Have a question, suggestion, or want to get involved? Fill out the form below and we'll get back to you soon!
          </p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-8">
              <div className="text-2xl text-orange-500 font-bold mb-2">Thank you!</div>
              <div className="text-gray-300">Your message has been sent. We'll be in touch soon.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Name</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-neutral-700 border-neutral-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="bg-neutral-700 border-neutral-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-1 block">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full bg-neutral-700 border border-neutral-600 text-white rounded-md p-3 resize-none h-28"
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center pt-2">{error}</div>
              )}
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          )}
          <div className="mt-8 text-center text-gray-400 text-sm">
            Or email us directly at <a href="mailto:firstframestudents@gmail.com" className="text-orange-400 underline">firstframestudents@gmail.com</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 