/**
 * Utility functions for handling image uploads, resizing, and Word document conversion.
 */

// Official Tut Wuri Handayani vector icon as SVG Data URL
export const TUT_WURI_HANDAYANI_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="94" fill="%230b5394" stroke="%23f1c232" stroke-width="6"/><circle cx="100" cy="100" r="82" fill="%23ffffff"/><path d="M100 28 L112 60 L146 64 L120 86 L128 120 L100 102 L72 120 L80 86 L54 64 L88 60 Z" fill="%23f1c232" stroke="%23b45f06" stroke-width="2"/><circle cx="100" cy="100" r="28" fill="%230b5394"/><path d="M85 100 Q100 80 115 100 Q100 120 85 100 Z" fill="%23ffffff"/><circle cx="100" cy="100" r="8" fill="%23f1c232"/><path d="M60 148 C80 138 120 138 140 148 L136 156 C118 148 82 148 64 156 Z" fill="%230b5394"/><text x="100" y="172" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="%230b5394" text-anchor="middle">TUT WURI HANDAYANI</text></svg>`;

/**
 * Resizes and compresses an image file to a Base64 Data URL (JPEG or PNG).
 * This keeps the image size optimized for localStorage (~30KB-120KB) and fast rendering.
 */
export async function fileToOptimizedDataUrl(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's an SVG file, read directly as Data URL
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original reader result
          resolve(e.target?.result as string);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer PNG for images with transparency, otherwise JPEG for smaller size
        const isPng = file.type === 'image/png';
        const format = isPng ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(format, isPng ? undefined : quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a base64 Data URL to a Uint8Array and type for docx ImageRun.
 */
export function dataUrlToImageRunData(dataUrl: string): {
  data: Uint8Array;
  type: 'png' | 'jpg';
} | null {
  if (!dataUrl || typeof dataUrl !== 'string') return null;

  try {
    let type: 'png' | 'jpg' = 'png';
    if (
      dataUrl.startsWith('data:image/jpeg') ||
      dataUrl.startsWith('data:image/jpg')
    ) {
      type = 'jpg';
    } else {
      type = 'png';
    }

    const commaIndex = dataUrl.indexOf(',');
    const base64Str = commaIndex !== -1 ? dataUrl.slice(commaIndex + 1) : dataUrl;

    const binary = atob(base64Str);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return { data: bytes, type };
  } catch (err) {
    console.warn('Failed to convert dataUrl to image run data:', err);
    return null;
  }
}

/**
 * Loads an image from Data URL, checks its natural dimensions, and ensures PNG/JPEG for docx.
 */
export async function getSafeImageForDocx(dataUrl: string): Promise<{
  data: Uint8Array;
  type: 'png' | 'jpg';
  width: number;
  height: number;
} | null> {
  if (!dataUrl || typeof dataUrl !== 'string') return null;

  try {
    if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
        img.src = dataUrl;
      });

      const natWidth = img.naturalWidth || img.width || 550;
      const natHeight = img.naturalHeight || img.height || 110;

      let processedDataUrl = dataUrl;
      // If svg or webp, render to canvas to ensure docx-compatible PNG
      if (
        dataUrl.startsWith('data:image/svg') ||
        dataUrl.startsWith('data:image/webp')
      ) {
        const canvas = document.createElement('canvas');
        canvas.width = natWidth;
        canvas.height = natHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          processedDataUrl = canvas.toDataURL('image/png');
        }
      }

      const basicInfo = dataUrlToImageRunData(processedDataUrl);
      if (!basicInfo) return null;

      return {
        ...basicInfo,
        width: natWidth,
        height: natHeight,
      };
    } else {
      const basicInfo = dataUrlToImageRunData(dataUrl);
      if (!basicInfo) return null;
      return {
        ...basicInfo,
        width: 550,
        height: 110,
      };
    }
  } catch (err) {
    console.warn('Failed in getSafeImageForDocx, falling back to dataUrlToImageRunData:', err);
    const fallback = dataUrlToImageRunData(dataUrl);
    if (!fallback) return null;
    return {
      ...fallback,
      width: 550,
      height: 110,
    };
  }
}
