import os
import subprocess

def create_site():
    project_name = "melonmagnets-web"
    
    print(f"🚀 Creating {project_name}...")

    # 1. Create Vite Project
    subprocess.run(f"npm create vite@latest {project_name} -- --template react-ts", shell=True)
    os.chdir(project_name)

    # 2. Install Tailwind CSS and Lucide Icons
    print("📦 Installing dependencies (Tailwind, Lucide, Framer Motion)...")
    subprocess.run("npm install -D tailwindcss postcss autoprefixer", shell=True)
    subprocess.run("npx tailwindcss init -p", shell=True)
    subprocess.run("npm install lucide-react framer-motion", shell=True)

    # 3. Configure Tailwind
    with open("tailwind.config.js", "w") as f:
        f.write("""
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'melon-green': '#2D5A27',
        'melon-orange': '#FF8C42',
      }
    },
  },
  plugins: [],
}
""")

    # 4. Create the Main App Component
    app_code = """
import React from 'react';
import { MessageCircle, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const MagnetSizes = [
  { id: 1, name: 'Mini Square', size: '2x2 inch', price: '₹99', img: 'https://images.unsplash.com/photo-1598604439031-bc6607e0c80c?auto=format&fit=crop&q=80&w=300' },
  { id: 2, name: 'Classic Round', size: '3x3 inch', price: '₹149', img: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=300' },
  { id: 3, name: 'Premium Portrait', size: '4x6 inch', price: '₹249', img: 'https://images.unsplash.com/photo-1583241800698-e8ab01c85b27?auto=format&fit=crop&q=80&w=300' },
  { id: 4, name: 'Collector XL', size: 'A5 Size', price: '₹399', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300' },
];

function App() {
  const whatsappNumber = "91XXXXXXXXXX"; // REPLACe WITH YOUR ACTUAL NUMBER
  
  const openWhatsApp = (msg: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-container flex justify-between items-center p-4 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-melon-green tracking-tight">Melon<span className="text-melon-orange">Magnets</span></h1>
          <button 
            onClick={() => openWhatsApp("Hi MelonMagnets! I'd like to place an order.")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all font-medium text-sm"
          >
            <MessageCircle size={18} /> Order Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 text-center bg-gradient-to-b from-white to-orange-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Premium Collection</span>
          <h2 className="text-4xl md:text-6xl font-black mt-6 mb-4 text-slate-800">Sticky Memories.</h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Premium quality fridge magnets and souvenirs delivered all over India.
          </p>
        </motion.div>
      </section>

      {/* Pricing Grid */}
      <section className="max-w-6xl mx-auto py-12 px-4" id="pricing">
        <h3 className="text-2xl font-bold mb-8 text-center">Available Sizes & Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MagnetSizes.map((item) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={item.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col"
            >
              <img src={item.img} alt={item.name} className="h-48 w-full object-cover" />
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="font-bold text-xl mb-1">{item.name}</h4>
                <p className="text-slate-500 text-sm mb-4">Size: {item.size}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-black text-melon-green">{item.price}</span>
                  <button 
                    onClick={() => openWhatsApp(`Hi! I am interested in the ${item.name} (${item.size}) for ${item.price}.`)}
                    className="p-2 bg-slate-100 hover:bg-orange-100 rounded-full transition-colors text-orange-600"
                  >
                    <MessageCircle size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Business Overview */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="mx-auto mb-6 text-orange-400" size={40} />
          <h3 className="text-2xl font-bold mb-4">Crafted with Love in India</h3>
          <p className="text-slate-400 leading-relaxed italic">
            "MelonMagnets is an India-based e-commerce store specializing in premium quality fridge magnets, 
            pin badges, and souvenirs, providing nationwide shipping for customers looking to personalize 
            their spaces or commemorate special occasions."
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-4">
        <div className="flex flex-col items-center text-center">
          <ShieldCheck size={32} className="text-melon-green mb-2" />
          <p className="font-bold">Premium Quality</p>
          <p className="text-xs text-slate-500">Waterproof & Scratch Resistant</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Truck size={32} className="text-melon-green mb-2" />
          <p className="font-bold">Pan-India Delivery</p>
          <p className="text-xs text-slate-500">Fast shipping to your doorstep</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <MessageCircle size={32} className="text-melon-green mb-2" />
          <p className="font-bold">Easy Support</p>
          <p className="text-xs text-slate-500">Direct chat with the creator</p>
        </div>
      </div>

      <footer className="py-8 text-center text-slate-400 text-sm border-t">
        © 2024 MelonMagnets. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
"""
    
    with open("src/App.tsx", "w") as f:
        f.write(app_code)

    # 5. Add Tailwind Directives to CSS
    with open("src/index.css", "w") as f:
        f.write("@tailwind base;\n@tailwind components;\n@tailwind utilities;")

    print("\n✅ Project Setup Complete!")
    print("\n👉 To run your website:")
    print(f"1. cd {project_name}")
    print("2. npm install")
    print("3. npm run dev")

if __name__ == "__main__":
    create_site()