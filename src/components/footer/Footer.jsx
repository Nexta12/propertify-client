import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { useState } from "react";
import whiteLogo from "@assets/img/white-logo.png";
import ToggleSwitch from "@components/toggleSwitch/ToggleSwitch";

const FooterLinkSection = ({ title, links }) => (
  <div>
    <h3 className="text-white font-primary text-lg mb-4 font-semibold">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, i) => (
        <li key={i}>
          <a
            href={link.to}
            className="text-secondary hover:text-main-green transition-colors duration-200 font-secondary text-sm"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = ({ className }) => {
  const exploreLinks = [
    { to: "#", label: "Apartments" },
    { to: "#", label: "Commercial" },
    { to: "#", label: "Short Lets" },
  ];

  const companyLinks = [
    { to: "#", label: "About Us" },
    { to: "#", label: "Careers" },
    { to: "#", label: "Blog" },
  ];

  const supportLinks = [
    { to: "#", label: "FAQs" },
    { to: "#", label: "Privacy Policy" },
    { to: "#", label: "Terms of Service" },
  ];

  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscriptionStatus("success");
      setEmail("");
      setTimeout(() => setSubscriptionStatus(null), 3000);
    } else {
      setSubscriptionStatus("error");
    }
  };

  return (
    <footer className={`bg-tertiary dark:bg-[#0f172a] pt-16 pb-8 ${className}`}>
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-5">
            <a href="/">
              <img src={whiteLogo} className="w-40" alt="Company Logo" />
            </a>
            <p className="text-secondary dark:text-gray-400 font-secondary text-sm leading-relaxed">
              Nigeria&apos;s fastest-growing real estate platform connecting buyers, sellers, and
              agents nationwide.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-secondary dark:text-gray-400 hover:text-main-green transition-colors duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          <FooterLinkSection title="Explore Properties" links={exploreLinks} />
          <FooterLinkSection title="Company" links={companyLinks} />
          <FooterLinkSection title="Support" links={supportLinks} />

          {/* Contact Info */}
          <div>
            <h3 className="text-white dark:text-white font-primary text-lg mb-4 font-semibold">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-white mt-1 flex-shrink-0" size={14} />
                <span className="text-secondary dark:text-gray-400 font-secondary text-sm">
                  Aquarius block, Eleganza Plaza, Apapa
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-white" size={14} />
                <span className="text-secondary dark:text-gray-400 font-secondary text-sm">
                  +234 813-4728097
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-white" size={14} />
                <span className="text-secondary dark:text-gray-400 font-secondary text-sm">
                  info@propertifynigeria.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 dark:border-white/5 pt-10 pb-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-white font-primary text-lg mb-3 text-center">
              Get Property Updates
            </h3>
            <p className="text-secondary dark:text-gray-400 text-sm text-center mb-6">
              Subscribe to receive exclusive property listings and market insights
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <div className="flex-grow relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 dark:bg-white/10 text-white placeholder-secondary dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-main-green border border-white/10 dark:border-white/20"
                  required
                />
                {subscriptionStatus === "error" && (
                  <p className="absolute -bottom-5 left-0 text-orange text-xs mt-1">
                    Please enter a valid email
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="bg-main-green hover:bg-green-hover text-white px-6 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>

            {subscriptionStatus === "success" && (
              <p className="text-center text-main-green text-sm mt-3">
                Thank you for subscribing! Check your email for confirmation.
              </p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 dark:border-white/5 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex flex-col space-y-2">
              <span className="text-secondary dark:text-gray-400 text-xs font-secondary">
                &copy; {new Date().getFullYear()} Propertify Nigeria. All rights reserved.
              </span>
              <ToggleSwitch />
            </div>
            <div className="flex gap-4">
              {["Privacy Policy", "Terms of Service", "Sitemap"].map((text, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-secondary dark:text-gray-400 hover:text-main-green text-xs transition-colors"
                >
                  {text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
