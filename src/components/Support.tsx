import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MessageSquare, ShieldCheck, Globe } from 'lucide-react';
import { supportTeam } from '../constants';

export default function Support() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-display font-black mb-4 tracking-tight">
            How can we <span className="text-accent">help?</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            Our dedicated support team is here to ensure your IndieForge experience is seamless. 
            Whether you're a gamer or a developer, we've got your back.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {supportTeam.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass-card p-8 flex flex-col items-center text-center group"
          >
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent transition-colors duration-500">
                <img 
                  src={member.avatarUrl} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full border-4 border-white dark:border-neutral-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>

            <h3 className="text-xl font-display font-bold mb-1">{member.name}</h3>
            <p className="text-sm font-medium text-accent mb-6 uppercase tracking-wider">
              {member.role}
            </p>

            <div className="w-full space-y-3">
              <a 
                href={`mailto:${member.email}`}
                className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-accent hover:text-white transition-all duration-300 group/link"
              >
                <Mail size={18} className="text-neutral-400 group-hover/link:text-white transition-colors" />
                <span className="text-sm font-semibold">{member.email}</span>
              </a>
              <a 
                href={`tel:${member.phone.replace(/\D/g, '')}`}
                className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-accent hover:text-white transition-all duration-300 group/link"
              >
                <Phone size={18} className="text-neutral-400 group-hover/link:text-white transition-colors" />
                <span className="text-sm font-semibold">{member.phone}</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Support Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <MessageSquare className="text-accent" />,
            title: "Live Chat",
            desc: "Available 24/7 for instant troubleshooting and quick questions."
          },
          {
            icon: <ShieldCheck className="text-accent" />,
            title: "Secure Billing",
            desc: "Our financial team ensures all transactions are encrypted and safe."
          },
          {
            icon: <Globe className="text-accent" />,
            title: "Global Reach",
            desc: "Support available in over 12 languages across all time zones."
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass p-6 rounded-2xl flex gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div>
              <h4 className="font-bold mb-1">{item.title}</h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
