import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaRocket, FaArrowRight } from 'react-icons/fa';

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem);
  background: var(--bg-primary, #ffffff);
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  position: relative;

  /* Small mobile */
  @media (max-width: 480px) {
    padding: clamp(2rem, 6vw, 3rem) clamp(0.75rem, 3vw, 1.5rem);
    min-height: auto;
  }

  /* Landscape mobile */
  @media (max-height: 600px) and (orientation: landscape) {
    min-height: auto;
    padding: 2rem 2rem;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(0.5rem, 2vw, 1rem);
`;

const Heading = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 4rem);
  color: var(--text-primary, #000);
  position: relative;
  
  /* Add underline decoration */
  &:after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(60px, 10vw, 100px);
    height: 3px;
    background: var(--text-primary, #000);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(1.5rem, 6vw, 2rem);
    letter-spacing: 0.05em;
    margin-bottom: clamp(2rem, 5vw, 3rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 1.375rem;
    
    &:after {
      width: 50px;
      height: 2px;
      bottom: -0.75rem;
    }
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
  
  /* Tablets */
  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: clamp(1.25rem, 3vw, 2rem);
  }
 
  /* Small mobile */
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: clamp(1rem, 3vw, 1.5rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    gap: 1rem;
  }
`;

const BlogCard = styled(motion.article)`
  background: var(--skill-card-bg, #f8f9fa);
  border: 2px solid var(--border-card, #e9ecef);
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  /* Add subtle gradient overlay */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #000 0%, #333 100%);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }
 
  @media (hover: hover) {
    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      border-color: var(--accent, #000);
      background: var(--bg-card, #fff);
      
      &:before {
        transform: translateY(0);
      }
    }
  }

  /* Touch feedback */
  &:active {
    transform: scale(0.98);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: clamp(1.25rem, 4vw, 1.75rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    padding: 1rem;
    border-radius: 6px;
  }
`;

const BlogDate = styled.time`
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6c757d;
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;

  @media (max-width: 360px) {
    font-size: 0.6875rem;
    letter-spacing: 0.05em;
  }
`;

const ComingSoonBadge = styled.span`
  font-size: clamp(0.6875rem, 1.5vw, 0.8125rem);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--accent-inverse, #fff);
  background: var(--accent, #000);
  padding: clamp(0.375rem, 1vw, 0.5rem) clamp(0.75rem, 1.5vw, 1rem);
  border-radius: 4px;
  display: inline-block;
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
  font-weight: 600;
  position: relative;
  overflow: hidden;
  
  /* Add shimmer effect */
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    to {
      left: 100%;
    }
  }

  @media (max-width: 360px) {
    font-size: 0.625rem;
    padding: 0.25rem 0.625rem;
    letter-spacing: 0.1em;
  }
`;

const BlogTitle = styled.h3`
  font-size: clamp(1.125rem, 2.5vw, 1.75rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: clamp(0.75rem, 2vw, 1.25rem);
  line-height: 1.2;
  color: var(--text-primary, #000);
  transition: color 0.3s ease;

  ${BlogCard}:hover & {
    color: #333;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(1rem, 4vw, 1.375rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 0.9375rem;
    letter-spacing: 0.02em;
    margin-bottom: 0.625rem;
  }
`;

const BlogExcerpt = styled.p`
  font-size: clamp(0.875rem, 2vw, 1.0625rem);
  line-height: 1.7;
  color: #495057;
  margin-bottom: clamp(1rem, 2.5vw, 1.5rem);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(0.8125rem, 2.5vw, 0.9375rem);
    line-height: 1.6;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 0.8125rem;
    -webkit-line-clamp: 4;
    margin-bottom: 0.875rem;
  }
`;

const ReadMore = styled.span`
  font-size: clamp(0.75rem, 1.75vw, 0.9375rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  color: var(--text-primary, #000);
  
  svg {
    font-size: clamp(0.75rem, 1.5vw, 0.875rem);
    transition: transform 0.3s ease;
  }
 
  ${BlogCard}:hover & {
    gap: 0.75rem;
    
    svg {
      transform: translateX(4px);
    }
  }

  @media (max-width: 360px) {
    font-size: 0.6875rem;
    letter-spacing: 0.05em;
    gap: 0.375rem;
  }
`;

// Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: clamp(1rem, 3vw, 2rem);
  overflow-y: auto;
`;

const ModalContent = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border-radius: 16px;
  padding: clamp(2rem, 4vw, 3rem);
  max-width: min(90vw, 450px);
  width: 100%;
  text-align: center;
  position: relative;
  margin: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  
  /* Small mobile */
  @media (max-width: 480px) {
    padding: clamp(1.5rem, 4vw, 2rem);
    border-radius: 12px;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    padding: 1.5rem 1rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: clamp(1rem, 2vw, 1.25rem);
  right: clamp(1rem, 2vw, 1.25rem);
  background: transparent;
  border: 2px solid #e9ecef;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  color: #6c757d;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  
  @media (hover: hover) {
    &:hover {
      border-color: #000;
      color: #000;
      transform: scale(1.1);
    }
  }
  
  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 360px) {
    top: 0.75rem;
    right: 0.75rem;
    width: 28px;
    height: 28px;
    font-size: 0.875rem;
  }
`;

const ModalIcon = styled(motion.div)`
  width: 60px;
  height: 60px;
  margin: 0 auto clamp(1.25rem, 2.5vw, 1.75rem);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
  
  svg {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 360px) {
    width: 52px;
    height: 52px;
    margin-bottom: 1.25rem;
    
    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

const ModalTitle = styled.h3`
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
  color: var(--text-primary, #000);
  line-height: 1.2;

  @media (max-width: 360px) {
    font-size: 1.125rem;
    letter-spacing: 0.02em;
  }
`;

const ModalText = styled.p`
  font-size: clamp(0.875rem, 2vw, 1rem);
  line-height: 1.6;
  color: var(--text-secondary, #495057);
  margin-bottom: clamp(1.5rem, 3vw, 2rem);

  @media (max-width: 360px) {
    font-size: 0.8125rem;
    margin-bottom: 1.25rem;
  }
`;

const ModalBlogTitle = styled.h4`
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 500;
  color: #6c757d;
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
  font-style: italic;

  @media (max-width: 360px) {
    font-size: 0.8125rem;
    margin-bottom: 0.875rem;
  }
`;

const CTAButton = styled.button`
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  border: none;
  padding: clamp(0.625rem, 1.5vw, 0.75rem) clamp(1.5rem, 3vw, 2rem);
  border-radius: 6px;
  font-size: clamp(0.8125rem, 1.75vw, 0.875rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (hover: hover) {
    &:hover {
      background: #333;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 360px) {
    font-size: 0.75rem;
    padding: 0.5rem 1.25rem;
    letter-spacing: 0.05em;
  }
`;

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: 'Building Scalable Microservices with AWS',
    excerpt: 'Exploring best practices for designing and deploying microservices architecture on AWS, including service mesh implementation and container orchestration strategies.',
    date: 'Coming Soon',
    link: '#'
  },
  {
    id: 2,
    title: 'Optimizing React Performance',
    excerpt: 'Deep dive into React performance optimization techniques, from memo and useMemo to code splitting and lazy loading strategies for modern web applications.',
    date: 'Coming Soon',
    link: '#'
  },
  {
    id: 3,
    title: 'Infrastructure as Code with Terraform',
    excerpt: 'How to manage cloud infrastructure efficiently using Terraform, including modules, state management, and CI/CD integration for automated deployments.',
    date: 'Coming Soon',
    link: '#'
  }
];

const Blog = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedPost(null), 300);
  };

  return (
    <Section id="blog">
      <Container>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Blog
        </Heading>
        
        <BlogGrid>
          {blogPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              onClick={() => handleCardClick(post)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ComingSoonBadge>Coming Soon</ComingSoonBadge>
              <BlogTitle>{post.title}</BlogTitle>
              <BlogExcerpt>{post.excerpt}</BlogExcerpt>
              <ReadMore>
                Read More <FaArrowRight />
              </ReadMore>
            </BlogCard>
          ))}
        </BlogGrid>
      </Container>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ 
                type: "spring",
                damping: 30,
                stiffness: 300
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={closeModal} aria-label="Close modal">
                <FaTimes />
              </CloseButton>
              
              <ModalIcon
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.1,
                  type: "spring",
                  damping: 25
                }}
              >
                <FaRocket />
              </ModalIcon>
              
              <ModalTitle>Coming Soon</ModalTitle>
              
              {selectedPost && (
                <ModalBlogTitle>{selectedPost.title}</ModalBlogTitle>
              )}
              
              <ModalText>
                This article is currently being written. Join my newsletter to be the first to know when it's published.
              </ModalText>
              
              <CTAButton onClick={closeModal}>
                Got it
              </CTAButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default Blog;