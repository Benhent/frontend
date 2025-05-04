import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { Menu, X, User, LogOut, ChevronDown, Home, BookOpen, MessageSquare, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <span className="font-bold text-white">A</span>
              </div>
              <span className="font-bold text-xl">AppName</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150"
              >
                Features
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Authentication Controls */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span>{user?.name || user?.username}</span>
                  <ChevronDown size={16} />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-10"
                    >
                      <Link
                        to="/profile"
                        className="px-4 py-2 text-sm hover:bg-gray-600 transition duration-150 flex items-center"
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="px-4 py-2 text-sm hover:bg-gray-600 transition duration-150 flex items-center"
                      >
                        <Settings size={16} className="mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 transition duration-150 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 transition duration-150"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-150 flex items-center"
                onClick={closeMenu}
              >
                <Home size={18} className="mr-2" />
                Home
              </Link>
              <Link
                to="/features"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-150 flex items-center"
                onClick={closeMenu}
              >
                <BookOpen size={18} className="mr-2" />
                Features
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-150 flex items-center"
                onClick={closeMenu}
              >
                <MessageSquare size={18} className="mr-2" />
                About
              </Link>
              <Link
                to="/contact"
                className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-150 flex items-center"
                onClick={closeMenu}
              >
                <MessageSquare size={18} className="mr-2" />
                Contact
              </Link>
            </div>

            {/* Mobile Authentication Controls */}
            <div className="pt-4 pb-3 border-t border-gray-700">
              {isAuthenticated ? (
                <div className="px-2 space-y-1">
                  <div className="flex items-center px-3 py-2">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                        {user?.avatarUrl ? (
                          <img
                            src={user.avatarUrl || "/placeholder.svg"}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium">{user?.name}</div>
                      <div className="text-sm text-gray-400">{user?.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-150 flex items-center"
                    onClick={closeMenu}
                  >
                    <User size={18} className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-150 flex items-center"
                    onClick={closeMenu}
                  >
                    <Settings size={18} className="mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      closeMenu()
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 transition duration-150 flex items-center"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-2 space-y-1">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-150"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 hover:bg-green-700 transition duration-150 mt-2"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar