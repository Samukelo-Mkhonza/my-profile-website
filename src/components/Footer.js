import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope, 
  FaPhone,
  FaMapMarkerAlt,
  FaArrowUp,
  FaHeart,
  FaCode,
  FaRocket,
  FaPaperPlane
} from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #000 0%, #1a1a1a 50%, #000 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  margin-top: clamp(3rem, 8vw, 6rem);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  /* Small mobile */
  @media (max-width: 480px) {
    margin-top: clamp(2rem, 6vw, 3rem);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(2.5rem, 6vw, 5rem) clamp(1rem, 4vw, 2rem) clamp(1.5rem, 4vw, 3rem);

  /* Small mobile */
  @media (max-width: 480px) {
    padding: clamp(2rem, 5vw, 3rem) clamp(0.75rem, 3vw, 1.5rem) clamp(1.25rem, 3vw, 2rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    padding: 1.5rem 0.75rem 1rem;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: clamp(2rem, 4vw, 4rem);
  margin-bottom: clamp(2.5rem, 5vw, 4rem);

  /* Tablets */
  @media (max-width: 1024px) {
    grid-template-columns: 1.5fr 1fr 1.5fr;
    gap: clamp(1.5rem, 3vw, 3rem);
  }

  /* Mobile */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: clamp(2rem, 5vw, 3rem);
    margin-bottom: clamp(2rem, 4vw, 3rem);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    gap: clamp(1.5rem, 4vw, 2.5rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const ContactSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 1.5rem);
`;

const SectionTitle = styled.h3`
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: clamp(0.75rem, 2vw, 1.25rem);
  color: #fff;
  position: relative;
  padding-bottom: 0.75rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: clamp(3rem, 8vw, 4rem);
    height: 3px;
    background: linear-gradient(90deg, #fff, transparent);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(1rem, 4vw, 1.25rem);
    letter-spacing: 0.05em;
    margin-bottom: 0.75rem;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 0.9375rem;
    
    &:after {
      width: 2.5rem;
      height: 2px;
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1.5vw, 0.875rem);
`;

const ContactItem = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1rem);
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: clamp(0.8125rem, 2vw, 1rem);
  transition: all 0.3s ease;
  padding: clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.75rem, 2vw, 1rem);
  border-radius: 8px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.02);
  min-height: 44px;
  word-break: break-word;

  @media (hover: hover) {
    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateX(8px);
    }
  }

  &:active {
    transform: scale(0.98);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(0.75rem, 3vw, 0.875rem);
    padding: 0.625rem 0.75rem;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 0.75rem;
    gap: 0.625rem;
    padding: 0.5rem 0.625rem;
  }
`;

const ContactIcon = styled.div`
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  width: clamp(20px, 5vw, 28px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  color: #fff;

  @media (max-width: 360px) {
    font-size: 1rem;
    width: 18px;
  }
`;

const QuickLinks = styled(motion.div)`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const QuickLinksGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1.5vw, 0.875rem);

  @media (max-width: 768px) {
    align-items: center;
  }

  @media (max-width: 360px) {
    gap: 0.5rem;
  }
`;

const QuickLink = styled(motion.a)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);
  border-radius: 6px;
  border: 1px solid transparent;
  display: inline-block;
  min-height: 44px;
  display: flex;
  align-items: center;

  @media (hover: hover) {
    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateX(4px);
    }
  }

  &:active {
    transform: scale(0.98);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(0.75rem, 3vw, 0.875rem);
    padding: 0.625rem 0.875rem;
    letter-spacing: 0.03em;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
`;

const NewsletterSection = styled(motion.div)`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const NewsletterDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  line-height: 1.6;
  margin-bottom: clamp(0.75rem, 2vw, 1rem);

  @media (max-width: 480px) {
    font-size: clamp(0.75rem, 2.5vw, 0.875rem);
  }

  @media (max-width: 360px) {
    font-size: 0.75rem;
    line-height: 1.5;
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2vw, 1rem);
  margin-top: clamp(0.75rem, 2vw, 1rem);
  width: 100%;

  @media (min-width: 481px) {
    flex-direction: row;
    max-width: 400px;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const NewsletterInput = styled.input`
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.25rem);
  color: #fff;
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: all 0.3s ease;
  flex: 1;
  min-height: 44px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(0.8125rem, 3vw, 0.9375rem);
    padding: 0.75rem 1rem;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 0.8125rem;
    padding: 0.625rem 0.875rem;
  }
`;

const NewsletterButton = styled(motion.button)`
  background: #fff;
  color: #000;
  border: 2px solid #fff;
  border-radius: 8px;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover {
      background: transparent;
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(255, 255, 255, 0.1);
    }
  }

  &:active {
    transform: scale(0.98);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(0.8125rem, 3vw, 0.9375rem);
    padding: 0.75rem 1.5rem;
    width: 100%;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 0.75rem;
    padding: 0.625rem 1.25rem;
    letter-spacing: 0.03em;
  }
`;

const SocialSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(1rem, 3vw, 2rem);
  margin-bottom: clamp(2rem, 4vw, 3rem);
  padding: clamp(1.5rem, 3vw, 2.5rem) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  /* Background pattern */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
    pointer-events: none;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    gap: clamp(0.75rem, 3vw, 1.25rem);
    padding: clamp(1.25rem, 3vw, 2rem) 0;
    margin-bottom: clamp(1.5rem, 3vw, 2rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    gap: 0.75rem;
    padding: 1rem 0;
    margin-bottom: 1.25rem;
  }
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(2.75rem, 6vw, 3.5rem);
  height: clamp(2.75rem, 6vw, 3.5rem);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.02);

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: #fff;
    border-radius: 50%;
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);
    z-index: 0;
  }

  @media (hover: hover) {
    &:hover {
      border-color: #fff;
      color: #000;
      transform: translateY(-4px) scale(1.1);
      box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);

      &:before {
        width: 100%;
        height: 100%;
      }
    }
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    position: relative;
    z-index: 1;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    width: clamp(2.5rem, 8vw, 3rem);
    height: clamp(2.5rem, 8vw, 3rem);
    font-size: clamp(1rem, 3vw, 1.25rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.9375rem;
    border-width: 1.5px;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(1rem, 3vw, 1.5rem);
  padding-top: clamp(1.5rem, 3vw, 2.5rem);
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    gap: clamp(0.75rem, 2vw, 1rem);
    padding-top: clamp(1.25rem, 3vw, 2rem);
  }

  @media (max-width: 360px) {
    gap: 0.75rem;
    padding-top: 1rem;
  }
`;

const Copyright = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: clamp(0.75rem, 1.75vw, 0.875rem);
  line-height: 1.5;

  @media (max-width: 360px) {
    font-size: 0.6875rem;
    gap: 0.375rem;
  }
`;

const MadeWith = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: clamp(0.75rem, 1.75vw, 0.875rem);
  line-height: 1.5;

  svg {
    color: #e74c3c;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  @media (max-width: 360px) {
    font-size: 0.6875rem;
    gap: 0.375rem;
  }
`;

const ScrollToTop = styled(motion.button)`
  position: fixed;
  bottom: clamp(1.5rem, 4vw, 2.5rem);
  right: clamp(1.5rem, 4vw, 2.5rem);
  width: clamp(2.75rem, 6vw, 3.5rem);
  height: clamp(2.75rem, 6vw, 3.5rem);
  background: #fff;
  color: #000;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1rem, 2.5vw, 1.375rem);
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;

  @media (hover: hover) {
    &:hover {
      background: #f0f0f0;
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  /* Small mobile */
  @media (max-width: 640px) {
    bottom: clamp(1rem, 3vw, 1.5rem);
    right: clamp(1rem, 3vw, 1.5rem);
    width: clamp(2.5rem, 7vw, 3rem);
    height: clamp(2.5rem, 7vw, 3rem);
    font-size: clamp(0.875rem, 3vw, 1.125rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    bottom: 0.75rem;
    right: 0.75rem;
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.875rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  /* Landscape mobile */
  @media (max-height: 500px) and (orientation: landscape) {
    bottom: 0.75rem;
    right: 0.75rem;
    width: 2.25rem;
    height: 2.25rem;
  }
`;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    alert('Thanks for your interest! Newsletter functionality coming soon.');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#skills', label: 'Skills' },
    { href: '#blog', label: 'Blog' },
  ];

  const socialLinks = [
    {
      href: 'https://github.com/Samukelo-Mkhonza',
      icon: FaGithub,
      label: 'GitHub'
    },
    {
      href: 'https://www.linkedin.com/in/samukelo-mkhonza-a27340215/',
      icon: FaLinkedin,
      label: 'LinkedIn'
    },
    {
      href: 'mailto:samukelo.mkhonza@outlook.com',
      icon: FaEnvelope,
      label: 'Email'
    }
  ];

  return (
    <>
      <FooterContainer id="contact">
        <FooterContent>
          <FooterGrid>
            <ContactSection
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <SectionTitle>Get In Touch</SectionTitle>
              <ContactInfo>
                <ContactItem 
                  href="mailto:samukelo.mkhonza@outlook.com"
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ContactIcon><FaEnvelope /></ContactIcon>
                  samukelo.mkhonza@outlook.com
                </ContactItem>
                <ContactItem 
                  href="tel:+27638184436"
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ContactIcon><FaPhone /></ContactIcon>
                  +27 (63) 818-4436
                </ContactItem>
                <ContactItem
                  as={motion.div}
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ContactIcon><FaMapMarkerAlt /></ContactIcon>
                  Bellville, Western Cape, ZA
                </ContactItem>
              </ContactInfo>
            </ContactSection>

            <QuickLinks
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <SectionTitle>Quick Links</SectionTitle>
              <QuickLinksGrid>
                {quickLinks.map((link, index) => (
                  <QuickLink
                    key={link.href}
                    href={link.href}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {link.label}
                  </QuickLink>
                ))}
              </QuickLinksGrid>
            </QuickLinks>

            <NewsletterSection
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <SectionTitle>Stay Updated</SectionTitle>
              <NewsletterDescription>
                Get notified about new projects, blog posts, and tech insights.
              </NewsletterDescription>
              <NewsletterForm onSubmit={handleNewsletterSubmit}>
                <NewsletterInput
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                />
                <NewsletterButton
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                  <FaPaperPlane />
                </NewsletterButton>
              </NewsletterForm>
            </NewsletterSection>
          </FooterGrid>

          <SocialSection>
            {socialLinks.map((social, index) => (
              <SocialLink
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  type: "spring",
                  damping: 15
                }}
                viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon />
              </SocialLink>
            ))}
          </SocialSection>

          <FooterBottom>
            <Copyright>
              &copy; {new Date().getFullYear()} Samukelo Mkhonza. All rights reserved.
            </Copyright>
            <MadeWith>
              Made with <FaHeart /> and <FaCode /> in South Africa
            </MadeWith>
          </FooterBottom>
        </FooterContent>
      </FooterContainer>

      <AnimatePresence>
        {showScrollTop && (
          <ScrollToTop
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </ScrollToTop>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;