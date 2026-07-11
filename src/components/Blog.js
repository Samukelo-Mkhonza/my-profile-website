import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaArrowRight } from 'react-icons/fa';
import { blogPosts } from '../content/blogPosts';
import Modal, { ModalTitle } from './ui/Modal';

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem);
  background: var(--bg-primary-glass, rgba(255, 255, 255, 0.86));
  position: relative;

  /* Small mobile */
  @media (max-width: 480px) {
    padding: clamp(2rem, 6vw, 3rem) clamp(0.75rem, 3vw, 1.5rem);
  }

  /* Landscape mobile */
  @media (max-height: 600px) and (orientation: landscape) {
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
  font-weight: 800;
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
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  /* Accent strip revealed on hover */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--accent-orange, #ee5a24);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
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
`;

const ComingSoonBadge = styled.span`
  font-size: clamp(0.6875rem, 1.5vw, 0.8125rem);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--accent-inverse, #fff);
  background: var(--accent, #000);
  padding: clamp(0.375rem, 1vw, 0.5rem) clamp(0.75rem, 1.5vw, 1rem);
  border-radius: var(--radius-pill, 999px);
  display: inline-block;
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
  font-weight: 700;
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
  color: var(--text-secondary, #495057);
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

// Modal content (frame and behaviour come from the shared Modal component;
// spacing between blocks comes from the shared panel's column gap)
const ModalIcon = styled(motion.div)`
  width: 60px;
  height: 60px;
  color: var(--text-primary, #000);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tag-bg, #f8f9fa);
  border: 2px solid var(--border-card, #111);
  border-radius: 50%;
  flex-shrink: 0;

  svg {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 360px) {
    width: 52px;
    height: 52px;

    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

const ModalText = styled.p`
  font-size: clamp(0.875rem, 2vw, 1rem);
  line-height: 1.6;
  color: var(--text-secondary, #495057);
  margin: 0;

  @media (max-width: 360px) {
    font-size: 0.8125rem;
  }
`;

const ModalBlogTitle = styled.h4`
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 500;
  color: var(--text-muted, #6c757d);
  margin: 0;
  font-style: italic;

  @media (max-width: 360px) {
    font-size: 0.8125rem;
  }
`;

const CTAButton = styled.button`
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  border: 2px solid var(--border-card, #111);
  padding: clamp(0.625rem, 1.5vw, 0.75rem) clamp(1.5rem, 3vw, 2rem);
  border-radius: var(--radius-pill, 999px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: clamp(0.8125rem, 1.75vw, 0.875rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-hard, 4px 4px 0 #111);
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

const BlogSubtitle = styled(motion.p)`
  text-align: center;
  color: var(--text-secondary, #666);
  font-size: clamp(0.875rem, 2vw, 1.0625rem);
  line-height: 1.6;
  max-width: 600px;
  margin: -1rem auto clamp(2.5rem, 5vw, 3.5rem);

  @media (max-width: 480px) {
    font-size: clamp(0.8125rem, 2.5vw, 0.9375rem);
    margin-top: -0.5rem;
  }
`;

const BlogCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
`;

const BlogIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tag-bg, #f0f0f0);
  border-radius: 8px;
  color: var(--text-primary, #000);
  font-size: 1.125rem;
  transition: all 0.3s ease;

  ${BlogCard}:hover & {
    background: var(--accent, #000);
    color: var(--accent-inverse, #fff);
  }
`;

const BlogTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
`;

const BlogTag = styled.span`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-secondary, #666);
  padding: 0.1875rem 0.5rem;
  border-radius: 4px;
  font-size: clamp(0.625rem, 1.25vw, 0.75rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const BlogFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: clamp(0.75rem, 2vw, 1rem);
  border-top: 1px solid var(--border-card, #e0e0e0);
`;

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const handleCardClick = (post) => {
    setSelectedPost(post);
  };

  const closeModal = useCallback(() => setSelectedPost(null), []);

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

        <BlogSubtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Thoughts on cloud architecture, frontend development, and engineering best practices. Articles coming soon.
        </BlogSubtitle>

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
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(post); } }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BlogCardHeader>
                <BlogIconWrapper>
                  <post.icon />
                </BlogIconWrapper>
                <ComingSoonBadge>Coming Soon</ComingSoonBadge>
              </BlogCardHeader>
              <BlogTitle>{post.title}</BlogTitle>
              <BlogExcerpt>{post.excerpt}</BlogExcerpt>
              <BlogTags>
                {post.tags.map((tag, idx) => (
                  <BlogTag key={idx}>{tag}</BlogTag>
                ))}
              </BlogTags>
              <BlogFooter>
                <ReadMore>
                  Read More <FaArrowRight />
                </ReadMore>
              </BlogFooter>
            </BlogCard>
          ))}
        </BlogGrid>
      </Container>

      {/* ── Modal ── */}
      <Modal
        isOpen={!!selectedPost}
        onClose={closeModal}
        labelledBy="blog-modal-title"
        maxWidth="450px"
        center
      >
        {selectedPost && (
          <>
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

            <ModalTitle id="blog-modal-title">Coming Soon</ModalTitle>

            <ModalBlogTitle>{selectedPost.title}</ModalBlogTitle>

            <ModalText>
              This article is currently being written. Check back soon — or reach out via the contact form if you'd like to talk about the topic in the meantime.
            </ModalText>

            <CTAButton onClick={closeModal}>
              Got it
            </CTAButton>
          </>
        )}
      </Modal>
    </Section>
  );
};

export default Blog;