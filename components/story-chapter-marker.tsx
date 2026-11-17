"use client";

import { motion } from "motion/react";

export function StoryChapterMarker({
  chapter,
  title,
  quote
}: {
  chapter: string;
  title: string;
  quote?: string;
}) {
  return (
    <motion.div
      className="story-chapter-marker"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="story-chapter-header">
        <span className="story-chapter-line-left" />
        <span className="story-chapter-tag">{chapter}</span>
        <span className="story-chapter-line-right" />
      </div>
      <h3 className="story-chapter-title">{title}</h3>
      {quote && <p className="story-chapter-quote">&ldquo;{quote}&rdquo;</p>}
    </motion.div>
  );
}
