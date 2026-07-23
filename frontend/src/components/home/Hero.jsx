"use client"
import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"
import { HeroAvatar } from "@/assets"

const Hero = () => {
  const [hoveredSide, setHoveredSide] = useState(null)

  return (
    <section id="home" className="min-h-screen flex items-center overflow-hidden">
      <div className="w-full h-full relative flex flex-col md:flex-row">
        {/* Designer Side */}
        <div 
          className={`w-full md:w-1/2 h-screen flex items-center justify-center relative transition-all duration-500 ease-in-out ${
            hoveredSide === "coder" ? "opacity-30" : "opacity-100"
          }`}
          onMouseEnter={() => setHoveredSide("designer")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-r from-black to-black z-0"
            style={{ 
              clipPath: hoveredSide === "designer" ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 100% 0, 75% 100%, 0 100%)" 
            }}
          />
          
          <div className="relative z-10 px-8 md:px-16 max-w-md transition-all duration-500">
            <h2 className="text-5xl md:text-7xl font-bold text-gray-100 mb-8">designer</h2>
            <p className="text-lg md:text-xl text-gray-300 mb-6">
              Product designer specialising in UI design and design systems.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#design-projects" className="inline-flex items-center text-gray-200 hover:text-blue-400 font-medium">
                See my design work <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="z-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Image 
            src={HeroAvatar}
            alt="Hero Image" 
            width={400}
            height={400}
            className="object-cover" 
          />
        </div>

        {/* Coder Side */}
        <div 
          className={`w-full md:w-1/2 h-screen flex items-center justify-center relative transition-all duration-500 ease-in-out ${
            hoveredSide === "designer" ? "opacity-30" : "opacity-100"
          }`}
          onMouseEnter={() => setHoveredSide("coder")}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-l from-black to-black z-0"
            style={{ 
              clipPath: hoveredSide === "coder" ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : "polygon(25% 0, 100% 0, 100% 100%, 0 100%)" 
            }}
          />
            
          <div className="relative z-10 px-8 md:px-16 max-w-md transition-all duration-500">
            <h2 className="text-5xl md:text-7xl font-bold text-gray-100 mb-8">&lt;coder&gt;</h2>
            <p className="text-lg md:text-xl text-gray-300 mb-6">
              Front end developer who writes clean, elegant and efficient code.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#coding-projects" className="inline-flex items-center text-gray-200 hover:text-blue-400 font-medium">
                See my development work <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Social Links - Fixed Position */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 z-40">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github size={24} />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Linkedin size={24} />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Twitter size={24} />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero