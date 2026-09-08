export const copyToClipboard = (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Try modern Clipboard API if available and in secure context
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard
        .writeText(text)
        .then(() => resolve(true))
        .catch(() => {
          resolve(fallbackCopy(text));
        });
    } else {
      resolve(fallbackCopy(text));
    }
  });
};

function fallbackCopy(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
