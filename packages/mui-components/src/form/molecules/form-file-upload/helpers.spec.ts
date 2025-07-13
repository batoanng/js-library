import { base64StringsToFiles, fileToBase64 } from './helpers';

describe('Helpers', () => {
  describe('fileToBase64', () => {
    it('should convert a file to a base64 string', async () => {
      const file = new File(['123'], 'filename');
      const result = await fileToBase64(file);
      expect(result).toBe('data:application/octet-stream;base64,MTIz');
    });
  });
  describe('base64StringsToFiles', () => {
    it('should convert an array of base64 strings to an array of files', () => {
      const base64Strings = ['data:application/octet-stream;base64,', 'data:application/octet-stream;base64,'];
      const result = base64StringsToFiles(base64Strings);
      expect(result).toEqual([new File([''], 'file-1'), new File([''], 'file-2')]);
    });

    it('should handle an empty array', () => {
      const base64Strings = [] as string[];
      const result = base64StringsToFiles(base64Strings);
      expect(result).toEqual([]);
    });
  });
});
