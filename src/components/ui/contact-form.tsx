'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
  },
};

export const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/mkownwpe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Enquiry sent successfully!",
          description: "We'll get back to you soon.",
        });
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send');
      }
    } catch {
      toast({
        title: "Failed to send enquiry",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-16 md:py-24 bg-bakery">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-2xl mx-auto px-6"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-cream mb-4">
            Book Your Order
          </h2>
          <p className="text-cream/70 max-w-md mx-auto mb-4">
            Have a special occasion? Let us create the perfect cake for you. Fill out the form below and we'll get back to you shortly.
          </p>
          <a 
            href="tel:8951227039" 
            className="inline-flex items-center gap-2 text-plum hover:text-plum-dark transition-colors font-semibold"
          >
            <Phone size={18} />
            Call us: 8951227039
          </a>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="space-y-6 bg-bakery-dark/60 p-8 rounded-2xl border border-cream/10 backdrop-blur-sm"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-cream flex items-center gap-2">
              <User size={16} className="text-plum" />
              Name <span className="text-rose-400">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
              className="bg-bakery border-cream/20 text-cream placeholder:text-cream/40 focus:border-plum focus:ring-plum"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-cream flex items-center gap-2">
              <Phone size={16} className="text-plum" />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={20}
              className="bg-bakery border-cream/20 text-cream placeholder:text-cream/40 focus:border-plum focus:ring-plum"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-cream flex items-center gap-2">
              <Mail size={16} className="text-plum" />
              Email <span className="text-rose-400">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              maxLength={255}
              className="bg-bakery border-cream/20 text-cream placeholder:text-cream/40 focus:border-plum focus:ring-plum"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-cream flex items-center gap-2">
              <MessageSquare size={16} className="text-plum" />
              Message <span className="text-rose-400">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your cake requirements, occasion, date, etc."
              value={formData.message}
              onChange={handleChange}
              maxLength={1000}
              rows={5}
              className="bg-bakery border-cream/20 text-cream placeholder:text-cream/40 focus:border-plum focus:ring-plum resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-plum hover:bg-plum-dark text-cream font-semibold py-6 text-base transition-all duration-300"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  ⏳
                </motion.span>
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={18} />
                Book Enquiry
              </span>
            )}
          </Button>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default ContactForm;
