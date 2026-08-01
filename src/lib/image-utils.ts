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
}