import React, { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { FaRocket, FaArrowRight } from 'react-icons/fa';
import { blogPosts } from '../content/blogPosts';
import Modal, { ModalTitle } from './ui/Modal';

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem);
  background: var(--bg-primary-glass, rgba(255, 255, 255, 0.86));
  position: relative;

  @media (max-width: 480px) {
    padding: clamp(2rem, 6vw, 3rem) clamp(0.75rem, 3vw, 1.5rem);
  }

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

  @media (max-width: 480px) {
    font-size: clamp(1.5rem, 6vw, 2rem);
    letter-spacing: 0.05em;
    margin-bottom: clamp(2rem, 5vw, 3rem);
  }

  @media (max-width: 360px) {
    font-size: 1.375rem;

    &:after {
      width: 50px;
      height: 2px;
      bottom: -0.75rem;
    }
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

/* Featured-first layout: the first post anchors the left column at double
   height, the rest stack beside it. The nth-last-child guard only lets the
   first card span when there are at least three posts, so the grid degrades
   to a plain column if blogPosts shrinks. */
const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: clamp(1.25rem, 2.5vw, 2rem);

  & > article:first-child:nth-last-child(n + 3) {
    grid-row: span 2;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;

    & > article:first-child:nth-last-child(n + 3) {
      grid-row: auto;
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: clamp(1rem, 3vw, 1.25rem);

    & > article:first-child:nth-last-child(n + 3) {
      grid-column: auto;
    }
  }
`;

/* motion.div, not motion.article: it carries role="button" for its
   click/keyboard handler, and ARIA forbids role="button" on <article>. */
const BlogCard = styled(motion.div)`
  background: var(--skill-card-bg, #f8f9fa);
  border: var(--border-w, 2px) solid var(--border-card, #111);
  border-radius: var(--radius-card, 14px);
  box-shadow: ${p => (p.$featured
    ? 'var(--shadow-hard-lg, 6px 6px 0 #111)'
    : 'var(--shadow-hard, 4px 4px 0 #111)')};
  padding: ${p => (p.$featured
    ? 'clamp(1.5rem, 3.5vw, 2.75rem)'
    : 'clamp(1.25rem, 3vw, 2rem)')};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.5vw, 1rem);

  @media (hover: hover) {
    &:hover {
      background: var(--bg-card-hover, #fff);
      box-shadow: 8px 8px 0 var(--shadow-color, #111);
    }
  }

  &:focus-visible {
    outline: 3px solid var(--accent-orange, #ee5a24);
    outline-offset: 3px;
  }

  @media (max-width: 640px) {
    gap: 0.625rem;
    ${p => !p.$featured && css`
      padding: 1rem 1.125rem;
    `}
  }
`;

/* Oversized issue number in the top-right corner; the header stamp is
   layered above it (z-index) so the two overlap like a zine masthead. */
const GhostNumber = styled.span`
  position: absolute;
  top: 0.25rem;
  right: 0.75rem;
  z-index: 0;
  font-size: ${p => (p.$featured
    ? 'clamp(4rem, 7vw, 6rem)'
    : 'clamp(3rem, 5vw, 4rem)')};
  font-weight: 800;
  line-height: 1;
  color: var(--text-primary, #000);
  opacity: 0.06;
  pointer-events: none;
  user-select: none;
`;

const CardHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

const IconPlate = styled.div`
  width: ${p => (p.$featured ? '56px' : '44px')};
  height: ${p => (p.$featured ? '56px' : '44px')};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => (p.$featured ? 'var(--accent-orange, #ee5a24)' : 'var(--tag-bg, #f0f0f0)')};
  color: ${p => (p.$featured ? 'var(--on-orange, #fff)' : 'var(--text-primary, #000)')};
  border: var(--border-w, 2px) solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: ${p => (p.$featured ? '1.5rem' : '1.125rem')};
  flex-shrink: 0;

  ${BlogCard}:hover & {
    ${p => !p.$featured && css`
      background: var(--accent-orange, #ee5a24);
      color: var(--on-orange, #fff);
    `}
  }

  @media (max-width: 360px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const SoonStamp = styled.span`
  font-size: clamp(0.625rem, 1.5vw, 0.75rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-primary, #000);
  background: var(--bg-card, #fff);
  border: 2px dashed var(--accent-orange, #ee5a24);
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  transform: rotate(2.5deg);
  white-space: nowrap;

  @media (max-width: 360px) {
    font-size: 0.5625rem;
    letter-spacing: 0.1em;
    padding: 0.25rem 0.5rem;
  }
`;

const BlogTitle = styled.h3`
  font-size: ${p => (p.$featured
    ? 'clamp(1.375rem, 3vw, 2rem)'
    : 'clamp(1.0625rem, 2vw, 1.375rem)')};
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.25;
  color: var(--text-primary, #000);
  margin: 0;

  @media (max-width: 360px) {
    font-size: ${p => (p.$featured ? '1.125rem' : '0.9375rem')};
  }
`;

const BlogExcerpt = styled.p`
  font-size: ${p => (p.$featured
    ? 'clamp(0.9375rem, 2vw, 1.0625rem)'
    : 'clamp(0.875rem, 2vw, 0.9375rem)')};
  line-height: 1.7;
  color: var(--text-secondary, #495057);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: ${p => (p.$featured ? 4 : 3)};
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 640px) {
    -webkit-line-clamp: ${p => (p.$featured ? 3 : 2)};
    line-height: 1.6;
  }
`;

const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: clamp(0.75rem, 2vw, 1rem);
  border-top: 2px dashed var(--border-color, rgba(17, 17, 17, 0.15));
`;

const BlogTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const BlogTag = styled.span`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-primary, #444);
  border: 1px solid var(--border-card, #111);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: clamp(0.625rem, 1.25vw, 0.6875rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const DetailsHint = styled.span`
  font-size: clamp(0.6875rem, 1.5vw, 0.8125rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary, #000);
  white-space: nowrap;

  svg {
    font-size: 0.75em;
    transition: transform 0.25s ease;
  }

  ${BlogCard}:hover & svg {
    transform: translateX(4px);
  }
`;

/* Modal content (frame and behaviour come from the shared Modal component;
   spacing between blocks comes from the shared panel's column gap) */
const ModalIcon = styled(motion.div)`
  width: 64px;
  height: 64px;
  color: var(--on-orange, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-orange, #ee5a24);
  border: var(--border-w, 2px) solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  flex-shrink: 0;

  svg {
    width: 30px;
    height: 30px;
  }

  @media (max-width: 360px) {
    width: 52px;
    height: 52px;

    svg {
      width: 26px;
      height: 26px;
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
          {blogPosts.map((post, index) => {
            const featured = index === 0;
            return (
              <BlogCard
                key={post.id}
                $featured={featured}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.4, 0, 0.2, 1]
                }}
                viewport={{ once: true, margin: "-50px" }}
                onClick={() => handleCardClick(post)}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(post); } }}
                whileHover={{ x: -3, y: -3 }}
                whileTap={{ x: 1, y: 1 }}
              >
                <GhostNumber $featured={featured} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </GhostNumber>
                <CardHeader>
                  <IconPlate $featured={featured}>
                    <post.icon />
                  </IconPlate>
                  <SoonStamp>Coming soon</SoonStamp>
                </CardHeader>
                <BlogTitle $featured={featured}>{post.title}</BlogTitle>
                <BlogExcerpt $featured={featured}>{post.excerpt}</BlogExcerpt>
                <CardFooter>
                  <BlogTags>
                    {post.tags.map((tag) => (
                      <BlogTag key={tag}>{tag}</BlogTag>
                    ))}
                  </BlogTags>
                  <DetailsHint>
                    Details <FaArrowRight aria-hidden="true" />
                  </DetailsHint>
                </CardFooter>
              </BlogCard>
            );
          })}
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
              animate={{ scale: 1, opacity: 1, rotate: -4 }}
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
