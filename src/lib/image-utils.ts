export function getDriveImageUrl(url: string): string {
  if (!url) return url;
  
  // Already a direct image URL (not Google Drive)
  if (!url.includes("drive.google.com")) return url;
  
  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
  let match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    return `/api/drive-image?id=${match[1]}`;
  }
  
  // Format: https://drive.google.com/uc?export=view&id=FILE_ID
  match = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (match) {
    return `/api/drive-image?id=${match[1]}`;
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  match = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
  if (match) {
    return `/api/drive-image?id=${match[1]}`;
  }
  
  return url;
<<<<<<< HEAD
}

// Tiny 1x1 transparent PNG as base64 for blur placeholder fallback
const TRANSPARENT_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

// Gera um placeholder blur simples (cor sólida baseada na URL para consistência)
export function getBlurDataUrl(url: string): string {
  if (!url) return TRANSPARENT_PIXEL;
  
  // Hash simples da URL para cor consistente
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }
  
  // Gera cor pastel baseada no hash
  const hue = Math.abs(hash) % 360;
  const sat = 15 + (Math.abs(hash) % 20); // 15-35%
  const light = 85 + (Math.abs(hash) % 10); // 85-95%
  
  // SVG 1x1 com cor de fundo
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="hsl(${hue}, ${sat}%, ${light}%)"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
=======
>>>>>>> 9593cfdd50e1e72be38c233fbcfa01d69a5c4267
}