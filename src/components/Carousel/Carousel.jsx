import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Carousel.module.css';

/**
 * Modern image carousel with arrows and dot indicators.
 * @param {{ images: string[], alts?: string[] }} props
 */
export default function Carousel({ images, alts = [] }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div id="carousel" className={styles.carousel}>
      {/* Slide track */}
      <div
        className={styles.track}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className={styles.slide}>
            <img
              src={src}
              alt={alts[i] || `Imagen ${i + 1}`}
              className={styles.slideImg}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className={`${styles.arrowBtn} ${styles.arrowBtnPrev}`}
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className={`${styles.arrowBtn} ${styles.arrowBtnNext}`}
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className={styles.dotsRow}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
