/**
 * Responsive image utilities with AVIF/WebP support and blur-up placeholders
 */

/**
 * Build responsive image attributes with srcset and sizes
 * @param {string} basePath - Base path to image (without extension)
 * @param {number[]} widths - Array of widths to generate
 * @param {string} sizes - Sizes attribute for responsive images
 * @returns {Object} Object with srcset, sizes, and placeholder data
 */
export function buildResponsiveImageAttrs(basePath, widths = [480, 768, 1024, 1440, 1920], sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw') {
  const srcset = {
    avif: widths.map(w => `/images${basePath}-w${w}.avif ${w}w`).join(', '),
    webp: widths.map(w => `/images${basePath}-w${w}.webp ${w}w`).join(', '),
    fallback: widths.map(w => `/images${basePath}-w${w}.jpg ${w}w`).join(', ')
  };

  return {
    srcset,
    sizes,
    placeholder: null, // Will be loaded from metadata if available
    src: `/images${basePath}-w${widths[0]}.jpg`, // Fallback smallest size
  };
}

/**
 * Generate picture element HTML with AVIF/WebP sources and blur-up placeholder
 * @param {Object} config - Image configuration
 * @param {string} config.alt - Alt text
 * @param {string} config.basePath - Base image path
 * @param {string} config.classes - CSS classes for img element
 * @param {number[]} config.widths - Widths for srcset
 * @param {string} config.sizes - Sizes attribute
 * @param {string} config.placeholder - Base64 placeholder (optional)
 * @param {boolean} config.lazy - Whether to lazy load (default: true)
 * @returns {string} HTML string
 */
export function generatePictureElement({ 
  alt, 
  basePath, 
  classes = '', 
  widths = [480, 768, 1024, 1440, 1920],
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  placeholder = null,
  lazy = true,
  width = null,
  height = null
}) {
  const attrs = buildResponsiveImageAttrs(basePath, widths, sizes);
  const loadingAttr = lazy ? 'loading="lazy"' : 'loading="eager"';
  const fetchPriorityAttr = lazy ? '' : 'fetchpriority="high"';
  const widthAttr = width ? `width="${width}"` : '';
  const heightAttr = height ? `height="${height}"` : '';
  
  const placeholderStyle = placeholder 
    ? `style="background-image: url('${placeholder}'); background-size: cover; background-position: center; filter: blur(20px); transform: scale(1.1);"` 
    : '';

  return `
    <picture>
      <source type="image/avif" srcset="${attrs.srcset.avif}" sizes="${sizes}">
      <source type="image/webp" srcset="${attrs.srcset.webp}" sizes="${sizes}">
      <img
        ${widthAttr}
        ${heightAttr}
        src="${attrs.src}"
        srcset="${attrs.srcset.fallback}"
        sizes="${sizes}"
        alt="${alt}"
        class="${classes}"
        ${loadingAttr}
        ${fetchPriorityAttr}
        decoding="async"
        ${placeholder ? `style="background-image: url('${placeholder}'); background-size: cover;"` : ''}
      >
    </picture>
  `;
}

/**
 * Create a responsive image with blur-up placeholder from metadata
 * @param {string} imagePath - Path to original image
 * @param {Object} options - Options object
 * @returns {Promise<Object>} Image metadata with responsive attributes
 */
export async function loadImageMetadata(imagePath) {
  try {
    // Extract base path from image path
    const basePath = imagePath.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
    const metadataPath = `/images${basePath}-metadata.json`;
    
    const response = await fetch(metadataPath);
    if (!response.ok) {
      throw new Error('Metadata not found');
    }
    
    const metadata = await response.json();
    const attrs = buildResponsiveImageAttrs(basePath, metadata.widths);
    
    return {
      ...attrs,
      placeholder: metadata.placeholder,
      aspectRatio: metadata.aspectRatio,
      original: metadata.original
    };
  } catch (error) {
    console.warn('Failed to load image metadata:', error);
    return buildResponsiveImageAttrs(imagePath);
  }
}

/**
 * Enhance existing img elements with responsive sources
 * Finds all images with data-responsive attribute and enhances them
 */
export function enhanceResponsiveImages() {
  const images = document.querySelectorAll('img[data-responsive]');
  
  images.forEach(async (img) => {
    const basePath = img.getAttribute('data-base-path');
    if (!basePath) return;

    try {
      const metadata = await loadImageMetadata(basePath);
      const picture = document.createElement('picture');
      
      // Create AVIF source
      const avifSource = document.createElement('source');
      avifSource.type = 'image/avif';
      avifSource.srcset = metadata.srcset.avif;
      avifSource.sizes = metadata.sizes;
      picture.appendChild(avifSource);
      
      // Create WebP source
      const webpSource = document.createElement('source');
      webpSource.type = 'image/webp';
      webpSource.srcset = metadata.srcset.webp;
      webpSource.sizes = metadata.sizes;
      picture.appendChild(webpSource);
      
      // Enhance img element
      img.srcset = metadata.srcset.fallback;
      img.sizes = metadata.sizes;
      if (metadata.placeholder) {
        img.style.backgroundImage = `url('${metadata.placeholder}')`;
        img.style.backgroundSize = 'cover';
        img.style.backgroundPosition = 'center';
        img.classList.add('image-blur-up');
      }
      
      // Wrap in picture if not already
      if (img.parentNode.tagName !== 'PICTURE') {
        img.parentNode.insertBefore(picture, img);
        picture.appendChild(img);
      }
    } catch (error) {
      console.warn('Failed to enhance responsive image:', error);
    }
  });
}

