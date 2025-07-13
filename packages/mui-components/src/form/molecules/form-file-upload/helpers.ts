/**
 * Converts a file to a base64 string.
 * @param file
 * @returns a promise that resolves to a base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });

/**
 * Converts an array of base64 strings to an array of files.
 * @param base64Strings an array of base64 strings to be converted to files.
 * @returns an array of files.
 */
export const base64StringsToFiles = (base64Strings: string[]): File[] => {
  if (!base64Strings) return [];

  const files: File[] = [];

  // loops through each element in the array and converts it to a file
  base64Strings.forEach((base64String, index) => {
    // splits the base64 string into the file type and the base64 data
    const [fileType, base64Data] = base64String.split(',');
    const byteCharacters = window.atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const file = new File([byteArray], `file-${index + 1}`, { type: fileType });
    files.push(file);
  });

  return files;
};

export const ACCEPTED_MIME_TYPES = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.tiff': 'image/tiff',
} as Record<string, string>;

// Converts an array of file extension strings to an array of MIME type strings.
// e.g ['.pdf', '.jpg', '.jpeg', '.png'] ==> ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png']
export const convertToMimeTypes = (fileExtensions: string[]) =>
  fileExtensions.map((fileExtension) => ACCEPTED_MIME_TYPES[fileExtension]);
