"use client";

import { Hero } from "@/components/Hero";
import { motion } from "framer-motion";
import Link from "next/link";
import { Leaf, Award, Heart, ShieldCheck, Sprout, Sun, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "Sourced directly from certified organic farms in the Himalayas."
  },
  {
    icon: ShieldCheck,
    title: "Lab Tested",
    description: "Every batch is rigorously tested for heavy metals and purity."
  },
  {
    icon: Heart,
    title: "Cruelty Free",
    description: "We never test on animals. Pure kindness in every bottle."
  }
];

const ingredients = [
  {
    name: "Ashwagandha",
    desc: "Known as 'Indian Ginseng,' this ancient root is a powerful adaptogen that helps the body manage stress, improves energy levels, and enhances cognitive function.",
    color: "from-amber-100 to-amber-200",
    icon: Sun,
    badge: "Vitality & Stress Relief",
    image: "/ashwagandha.png"
  },
  {
    name: "Neem",
    desc: "The 'Village Pharmacy.' Neem is celebrated for its potent antibacterial and detoxifying properties, purifying the blood and promoting radiant skin health.",
    color: "from-green-100 to-green-200",
    icon: Leaf,
    badge: "Detox & Purification",
    image: "/neem.png",
    animate: {
      rotate: [0, 5, 0, -5, 0],
      x: [0, 10, 0, -10, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  {
    name: "Tulsi",
    desc: "Holy Basil, the 'Queen of Herbs,' is a cornerstone of Ayurveda. It boosts immunity, supports respiratory health, and uplifting the spirit.",
    color: "from-emerald-100 to-emerald-200",
    icon: Sprout,
    badge: "Immunity & Spirit",
    image: "/tulsi.png"
  },
  {
    name: "Turmeric",
    desc: "The 'Golden Spice,' renowned for its anti-inflammatory properties and ability to boost immunity and promote healing.",
    color: "from-orange-100 to-orange-200",
    icon: Sun,
    badge: "Heal & Defense",
    image: "/turmeric.png"
  },
  {
    name: "Shilajit",
    desc: "The 'Destroyer of Weakness,' a mineral-rich resin that enhances strength, stamina, and vitality.",
    color: "from-stone-700 to-stone-500",
    icon: ShieldCheck,
    badge: "Power & Stamina",
    image: "/shilajit.png"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-secondary overflow-hidden">
      <Hero />

      {/* Philosophy / Features Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Gradient & Splash */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F2F7F2] -z-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4">Why Prashayan?</h2>
            <p className="text-primary/70 max-w-2xl mx-auto text-lg">
              We bridge the gap between ancient Ayurvedic wisdom and modern quality standards.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl text-center border border-primary/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-primary mb-3">{feature.title}</h3>
                <p className="text-primary/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-48 relative bg-secondary text-primary overflow-hidden flex items-center justify-center min-h-[120vh] md:min-h-[140vh]">
        {/* Organic Background Blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#E0EBE0] rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FAF3E0] rounded-full blur-[120px] opacity-60"></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/pattern.svg')] bg-repeat pointer-events-none"></div>

        {/* Foreground Herbs (Floating Orbit) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Ashwagandha - Top Left */}
          <motion.img
            src="/ashwagandha.png"
            alt="Ashwagandha"
            className="absolute top-[10%] left-[5%] w-[180px] md:w-[250px] object-contain drop-shadow-xl z-20"
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Neem - Top Right */}
          <motion.img
            src="/neem.png"
            alt="Neem"
            className="absolute top-[15%] right-[5%] w-[180px] md:w-[240px] object-contain drop-shadow-xl z-20"
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          {/* Tulsi - Bottom Left */}
          <motion.img
            src="/tulsi.png"
            alt="Tulsi"
            className="absolute bottom-[10%] left-[8%] w-[160px] md:w-[220px] object-contain drop-shadow-xl z-20"
            animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          {/* Kesar - Bottom Right */}
          <motion.img
            src="/kesar.png"
            alt="Kesar"
            className="absolute bottom-[15%] right-[8%] w-[150px] md:w-[200px] object-contain drop-shadow-xl z-20"
            animate={{ y: [0, 10, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          {/* Shilajit - Top Center (Floating higher) */}
          <motion.img
            src="/shilajit.png"
            alt="Shilajit"
            className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[140px] md:w-[180px] object-contain drop-shadow-xl z-10 opacity-90"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          {/* Turmeric - Bottom Center */}
          <motion.img
            src="/turmeric.png"
            alt="Turmeric"
            className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[160px] md:w-[220px] object-contain drop-shadow-xl z-20"
            animate={{ y: [0, -10, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          />
        </div>

        {/* Center Content */}
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-tertiary font-medium tracking-[0.3em] uppercase text-sm md:text-base block mb-6">
              Ancient Wisdom
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-8">
            <motion.span
              className="block text-primary/90"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Rooted in
            </motion.span>
            <div className="relative inline-block my-4">
              <motion.span
                className="text-tertiary relative z-10 block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                5,000 Years
              </motion.span>
            </div>
            <motion.span
              className="block text-primary/80 font-light italic"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              of Tradition.
            </motion.span>
          </h2>

          <motion.div
            className="w-12 h-12 mx-auto mb-8 text-tertiary/60"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Sprout className="w-full h-full" />
          </motion.div>

          <motion.p
            className="text-primary/70 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Ayurveda is not just medicine; it is the science of life.
            We honor this legacy by adhering to classical formulations while ensuring modern purity.
            <br /><span className="text-tertiary mt-2 block font-normal">Timeless healing for the modern soul.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-64 md:mt-80 mb-4"
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-primary border border-tertiary/50 px-8 py-3 rounded-full hover:bg-tertiary hover:text-white transition-all duration-300 group relative z-30"
            >
              <span className="tracking-widest uppercase text-sm">Our Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Ingredients Spotlight */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2F7F2] to-white -z-10"></div>
        {/* Color splashes */}
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-secondary-dark font-medium tracking-widest uppercase mb-4">Pure Ingredients</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-primary">Nature's Potent Healers</h3>
          </motion.div>

          <div className="space-y-32">
            {ingredients.map((item, i) => (
              <motion.div
                key={item.name}
                className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-100px", once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* Text Side */}
                <div className="flex-1 text-center md:text-left space-y-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mx-auto md:mx-0`}>
                    <item.icon className="w-8 h-8 text-primary-dark" />
                  </div>
                  <h4 className="text-3xl font-serif font-bold text-primary">{item.name}</h4>
                  <p className="text-xl text-primary/70 leading-relaxed">{item.desc}</p>
                  <div className="inline-flex items-center gap-2 text-primary-dark font-medium bg-white/50 px-4 py-2 rounded-full border border-primary/10">
                    <span className="w-2 h-2 rounded-full bg-primary-dark"></span>
                    <span>{item.badge}</span>
                  </div>
                </div>

                {/* Image Side */}
                <div className="flex-1 relative flex justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 blur-[80px] rounded-full`}></div>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    // @ts-ignore - Ignoring strict type check for animation object to allow rapid prototyping
                    animate={item.animate}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-[300px] h-[300px] object-contain relative z-10 drop-shadow-2xl"
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-secondary-dark relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">Join the Wellness Circle</h2>
          <p className="text-primary/70 mb-8 max-w-xl mx-auto">Subscribe for exclusive wellness tips, Ayurvedic recipes, and early access to new launches.</p>

          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full border border-primary/20 bg-white focus:outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary text-secondary px-8 py-3 rounded-full font-medium hover:bg-primary-dark transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
