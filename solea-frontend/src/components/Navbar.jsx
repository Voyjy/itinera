import React, { useState, useEffect, useRef } from 'react';
import { scroller } from 'react-scroll';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { useTranslation } from 'react-i18next';
import logo from '../assets/images/logo2.png';
import Button from '../layouts/Button';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [menu, setMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOnHero4, setIsOnHero4] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleChange = () => setMenu(!menu);

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);

      const hero4Start = 2000;
      const hero4End = 2600;
      setIsOnHero4(currentScrollY >= hero4Start && currentScrollY <= hero4End);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const scrollToSection = (id) => {
    scroller.scrollTo(id, {
      duration: 500,
      smooth: true,
      offset: -80,
    });
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      scrollToSection('home');
    } else {
      navigate('/');
      setTimeout(() => scrollToSection('home'), 300);
    }
  };

  const isLoginPage = location.pathname === '/login';
  const linkColorClass = isOnHero4 ? 'text-black hover:text-gray-700' : 'text-white hover:text-white';
  const currentLang = i18n.language;

  if (isLoginPage) {
    return (
      <div className="fixed top-0 left-0 w-full z-50 bg-transparent px-6 py-4">
        <img src={logo} alt="Logo" style={{ width: '60px', height: '40px' }} />
      </div>
    );
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 border-b border-white/10 ${isScrolled ? 'bg-white/5 backdrop-blur-lg' : 'bg-transparent backdrop-blur-md'
      }`}>
      <div className="flex flex-row justify-between px-5 md:px-32 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <span onClick={handleHomeClick} className="cursor-pointer">
            <img src={logo} alt="Logo" className="h-12 md:h-14 w-auto" />
          </span>
        </div>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          <span onClick={handleHomeClick} className={`oswald text-sm cursor-pointer ${linkColorClass}`}>
            {t('nav.home')}
          </span>
          <span onClick={() => scrollToSection('ContinentCrousel')} className={`oswald text-sm cursor-pointer ${linkColorClass}`}>{t('nav.destinations')}</span>
          <span onClick={() => scrollToSection('hero2')} className={`oswald text-sm cursor-pointer ${linkColorClass}`}>{t('nav.activities')}</span>
          <span onClick={() => scrollToSection('blog')} className={`oswald text-sm cursor-pointer ${linkColorClass}`}>{t('nav.blogs')}</span>
          <span onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className={`oswald text-sm cursor-pointer ${linkColorClass}`}>{t('nav.contact')}</span>

          {/* Language Toggle */}
          <div className={`flex items-center gap-1 text-xs oswald ${linkColorClass}`}>
            <button
              onClick={() => toggleLanguage('fr')}
              className={`px-1.5 py-0.5 rounded transition-opacity ${currentLang === 'fr' ? 'opacity-100 font-bold' : 'opacity-50 hover:opacity-80'}`}
            >
              FR
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={() => toggleLanguage('en')}
              className={`px-1.5 py-0.5 rounded transition-opacity ${currentLang === 'en' ? 'opacity-100 font-bold' : 'opacity-50 hover:opacity-80'}`}
            >
              EN
            </button>
          </div>

          {/* User Dropdown */}
          {user ? (
            <div className="relative font-oswald" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                className={`oswald px-4 py-1 rounded-full border text-sm tracking-wide transition-all duration-300
                  ${isOnHero4
                    ? 'text-black border-black hover:bg-black hover:text-white'
                    : 'text-white border-white hover:bg-white hover:text-black'
                  }`}
              >
                {user.name.split(" ")[0]} 🇻
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-700 text-white rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                  <a
                    href="/profile"
                    className="oswald block px-4 py-3 hover:bg-zinc-800 text-md font-oswald transition"
                  >
                    {t('nav.profile')}
                  </a>
                  <button
                    onClick={handleLogout}
                    className="oswald block w-full text-left px-4 py-3 hover:bg-zinc-800 text-md font-oswald transition"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button title={t('nav.signIn')} link="login" className={isOnHero4 ? "text-black" : "text-white"} />
          )}
        </nav>

        {/* Hamburger Menu */}
        <div className="md:hidden flex items-center" onClick={handleChange}>
          <AiOutlineMenuUnfold size={28} className={isOnHero4 ? 'text-black' : 'text-white'} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
