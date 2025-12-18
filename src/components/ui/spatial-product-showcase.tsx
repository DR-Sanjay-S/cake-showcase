'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  ChevronRight,
  Heart,
  Sparkles,
  Clock,
  Star,
  LucideIcon,
} from 'lucide-react';
import plumCakeImg from '@/assets/plum-cake.png';
import cupcakeImg from '@/assets/cupcake.png';

// =========================================
// 1. CONFIGURATION & DATA TYPES
// =========================================

export type ProductId = 'plum' | 'cupcake';

export interface FeatureMetric {
  label: string;
  value: number;
  icon: LucideIcon;
}

export interface ProductData {
  id: ProductId;
  label: string;
  title: string;
  description: string;
  image: string;
  colors: {
    gradient: string;
    glow: string;
    ring: string;
  };
  stats: {
    availability: string;
    rating: number;
  };
  features: FeatureMetric[];
}

const PRODUCT_DATA: Record<ProductId, ProductData> = {
  plum: {
    id: 'plum',
    label: 'Plum Cake',
    title: 'Royal Plum Delight',
    description: 'Our signature plum cake infused with the finest seasonal plums, aged rum, and a hint of cinnamon. A timeless classic for celebrations.',
    image: plumCakeImg,
    colors: {
      gradient: 'from-plum to-plum-dark',
      glow: 'bg-plum',
      ring: 'border-l-plum/50',
    },
    stats: { availability: 'Fresh Daily', rating: 4.9 },
    features: [
      { label: 'Sweetness', value: 75, icon: Heart },
      { label: 'Freshness', value: 98, icon: Sparkles },
    ],
  },
  cupcake: {
    id: 'cupcake',
    label: 'Cupcake',
    title: 'Velvet Dream Cupcake',
    description: 'Fluffy vanilla sponge topped with our signature rose-tinted buttercream swirl. Perfect for gifting or treating yourself.',
    image: cupcakeImg,
    colors: {
      gradient: 'from-rose-400 to-rose-600',
      glow: 'bg-rose-400',
      ring: 'border-r-rose-400/50',
    },
    stats: { availability: 'Baked Fresh', rating: 4.8 },
    features: [
      { label: 'Fluffiness', value: 94, icon: Sparkles },
      { label: 'Love Factor', value: 100, icon: Heart },
    ],
  },
};

// =========================================
// 2. ANIMATION VARIANTS
// =========================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
  },
  exit: { opacity: 0, y: -10, filter: 'blur(5px)' },
};

const getImageVariants = (isLeft: boolean): Variants => ({
  initial: {
    opacity: 0,
    scale: 1.5,
    filter: 'blur(15px)',
    rotate: isLeft ? -30 : 30,
    x: isLeft ? -80 : 80,
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    rotate: 0,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
  },
  exit: {
    opacity: 0,
    scale: 0.6,
    filter: 'blur(20px)',
    transition: { duration: 0.25 },
  },
});

// =========================================
// 3. SUB-COMPONENTS
// =========================================

const BackgroundGradient = ({ isLeft }: { isLeft: boolean }) => (
  <div className="fixed inset-0 pointer-events-none">
    <motion.div
      animate={{
        background: isLeft
          ? 'radial-gradient(circle at 0% 50%, rgba(139, 92, 246, 0.15), transparent 50%)'
          : 'radial-gradient(circle at 100% 50%, rgba(251, 113, 133, 0.15), transparent 50%)',
      }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
    />
  </div>
);

const ProductVisual = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => (
  <motion.div layout="position" className="relative group shrink-0">
    {/* Glow Effect */}
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute inset-0 rounded-full bg-gradient-to-br ${data.colors.gradient} blur-3xl opacity-30`}
    />

    {/* Image Container */}
    <div className="relative h-80 w-80 md:h-[450px] md:w-[450px] flex items-center justify-center">
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={data.id}
            src={data.image}
            alt={`${data.title}`}
            variants={getImageVariants(isLeft)}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 scale-110"
            style={{
              maskImage: 'radial-gradient(ellipse 55% 55% at center, black 40%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse 55% 55% at center, black 40%, transparent 70%)',
            }}
            draggable={false}
          />
        </AnimatePresence>
      </motion.div>
    </div>

  </motion.div>
);

const ProductDetails = ({ data, isLeft }: { data: ProductData; isLeft: boolean }) => {
  const alignClass = isLeft ? 'items-start text-left' : 'items-end text-right';
  const flexDirClass = isLeft ? 'flex-row' : 'flex-row-reverse';
  const barColorClass = isLeft ? 'left-0 bg-plum' : 'right-0 bg-rose-400';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${alignClass}`}
    >
      <motion.h2 variants={itemVariants} className="text-sm font-bold uppercase tracking-[0.2em] text-cream/60 mb-2">
        {data.label}
      </motion.h2>
      <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-b from-cream to-cream/70">
        {data.title}
      </motion.h1>
      <motion.p variants={itemVariants} className={`text-cream/70 mb-8 max-w-sm leading-relaxed ${isLeft ? 'mr-auto' : 'ml-auto'}`}>
        {data.description}
      </motion.p>

      {/* Feature Grid */}
      <motion.div variants={itemVariants} className="w-full space-y-6 bg-bakery-dark/60 p-6 rounded-2xl border border-cream/10 backdrop-blur-sm">
        {data.features.map((feature, idx) => (
          <div key={feature.label} className="group">
            <div className={`flex items-center justify-between mb-3 text-sm ${flexDirClass}`}>
              <div className={`flex items-center gap-2 ${feature.value > 50 ? 'text-cream' : 'text-cream/60'}`}>
                <feature.icon size={16} /> <span>{feature.label}</span>
              </div>
              <span className="font-mono text-xs text-cream/50">{feature.value}%</span>
            </div>
            <div className="relative h-2 w-full bg-bakery-dark rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feature.value}%` }}
                transition={{ duration: 1, delay: 0.4 + idx * 0.15 }}
                className={`absolute top-0 bottom-0 ${barColorClass} opacity-80`}
              />
            </div>
          </div>
        ))}

        <div className={`pt-4 flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
          <button type="button" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cream hover:text-plum transition-colors group">
            <Clock size={14} /> Order Now
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Rating */}
      <motion.div variants={itemVariants} className={`mt-6 flex items-center gap-3 text-cream/60 ${flexDirClass}`}>
        <Star size={16} className="fill-amber-400 text-amber-400" />
        <span className="text-sm font-medium">{data.stats.rating} Rating • {data.stats.availability}</span>
      </motion.div>
    </motion.div>
  );
};

const Switcher = ({ 
  activeId, 
  onToggle,
  visible = true
}: { 
  activeId: ProductId; 
  onToggle: (id: ProductId) => void;
  visible?: boolean;
}) => {
  const options = Object.values(PRODUCT_DATA).map(p => ({ id: p.id, label: p.label }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-12 inset-x-0 flex justify-center z-50 pointer-events-none"
        >
          <motion.div layout className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-bakery-dark/90 backdrop-blur-2xl border border-cream/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] ring-1 ring-cream/5">
            {options.map((opt) => (
              <motion.button
                key={opt.id}
                onClick={() => onToggle(opt.id)}
                whileTap={{ scale: 0.96 }}
                className="relative w-28 h-12 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none"
              >
                {activeId === opt.id && (
                  <motion.div
                    layoutId="island-surface"
                    className="absolute inset-0 rounded-full bg-gradient-to-b from-cream/10 to-cream/5 shadow-inner"
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-300 ${activeId === opt.id ? 'text-cream' : 'text-cream/50 hover:text-cream/70'}`}>
                  {opt.label}
                </span>
                {activeId === opt.id && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-1 h-1 w-6 rounded-full bg-gradient-to-r from-transparent via-plum to-transparent"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =========================================
// 4. MAIN COMPONENT
// =========================================

export default function CakeShowcase() {
  const [activeSide, setActiveSide] = useState<ProductId>('plum');
  const [showSwitcher, setShowSwitcher] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Hide switcher when scrolled past 70% of first viewport
      setShowSwitcher(scrollY < windowHeight * 0.7);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const currentData = PRODUCT_DATA[activeSide];
  const isLeft = activeSide === 'plum';

  return (
    <div className="relative min-h-screen w-full bg-bakery text-cream overflow-hidden selection:bg-plum/30 flex flex-col items-center justify-center">
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-cream">
            Cakes & Tales
          </h1>
        </div>
      </header>

      <BackgroundGradient isLeft={isLeft} />

      <main className="relative z-10 w-full px-6 py-8 flex flex-col justify-center max-w-7xl mx-auto">
        <motion.div
          layout
          transition={{ type: 'spring', bounce: 0, duration: 0.9 }}
          className={`flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 lg:gap-48 w-full ${
            isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          <ProductVisual data={currentData} isLeft={isLeft} />

          <motion.div layout="position" className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <ProductDetails 
                key={activeSide}
                data={currentData} 
                isLeft={isLeft} 
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      <Switcher activeId={activeSide} onToggle={setActiveSide} visible={showSwitcher} />
    </div>
  );
}
