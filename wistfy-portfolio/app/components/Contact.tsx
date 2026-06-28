'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MapPin, Phone, Check } from 'lucide-react'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <section id="contact" className="section-padding relative mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary"
        >
          Contact
        </motion.div>

        <h3 className="mb-12 text-4xl font-bold md:text-5xl">
          Let&apos;s <span className="text-gradient">Build Together</span>
        </h3>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p className="mb-10 text-lg leading-relaxed text-gray-text">
              Working on a graphics project or game engine? I&apos;d love to
              hear about it. Let&apos;s push pixels together.
            </p>

            <div className="space-y-6">
              <ContactInfo icon={Mail} label="Email" value="hello@wistfy.dev" />
              <ContactInfo icon={MapPin} label="Location" value="Vietnam" />
              <ContactInfo icon={Phone} label="Phone" value="+84 123 456 789" />
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="group relative">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-xl border border-dark-3 bg-dark-2/50 px-5 py-3.5 text-sm text-light placeholder-gray-text outline-none transition-all duration-300 focus:border-primary focus:glow"
                />
                <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-focus-within:w-4/5" />
              </div>
              <div className="group relative">
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-xl border border-dark-3 bg-dark-2/50 px-5 py-3.5 text-sm text-light placeholder-gray-text outline-none transition-all duration-300 focus:border-primary focus:glow"
                />
                <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-focus-within:w-4/5" />
              </div>
            </div>
            <div className="group relative">
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                className="w-full rounded-xl border border-dark-3 bg-dark-2/50 px-5 py-3.5 text-sm text-light placeholder-gray-text outline-none transition-all duration-300 focus:border-primary focus:glow"
              />
              <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-focus-within:w-4/5" />
            </div>
            <div className="group relative">
              <textarea
                rows={5}
                placeholder="Your Message"
                required
                value={formData.message}
                onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                className="w-full resize-none rounded-xl border border-dark-3 bg-dark-2/50 px-5 py-3.5 text-sm text-light placeholder-gray-text outline-none transition-all duration-300 focus:border-primary focus:glow"
              />
              <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-focus-within:w-4/5" />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={sent}
              className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-3.5 font-medium text-white transition-all hover:glow-lg sm:w-auto sm:px-10 ${
                sent ? 'bg-green-600' : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/10 transition-transform duration-300 group-hover:translate-x-full" />
              <span className="relative flex items-center gap-2">
                {sent ? (
                  <>
                    Message Sent!
                    <Check size={16} />
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </section>
  )
}

function ContactInfo({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="group flex items-center gap-4">
      <div className="relative rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-3.5 transition-all duration-300 group-hover:glow">
        <Icon size={18} className="text-primary" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-text">
          {label}
        </p>
        <p className="font-medium text-light transition-colors group-hover:text-primary">
          {value}
        </p>
      </div>
    </div>
  )
}
