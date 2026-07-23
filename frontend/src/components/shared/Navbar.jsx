"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "about" },
    { name: "Skills", href: "skills" },
    { name: "Experience", href: "experience" },
    { name: "Projects", href: "projects" },
    { name: "TechStack", href: "techstack" },
    { name: "Blogs", href: "blogs" },
    { name: "Contact", href: "contact" },
  ]

  return (
    <nav
      className={`border-b-1 border-gray-700 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 backdrop-blur-md fixed w-full z-50 transition-all duration-300 text-gray-300 ${scrolled ? "bg-black shadow-md py-3" : "bg-transparent py-5"}`}
    >
      <div className="container flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center">
          <span className="gradient-text text-gray-300">Sartaj Ashraf</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 ">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-medium text-gray-300 hover:text-gray-200 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <button className="md:hidden text-gray-300 focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-black absolute top-full left-0 w-full shadow-md py-4 px-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-medium text-gray-300 hover:text-gray-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
