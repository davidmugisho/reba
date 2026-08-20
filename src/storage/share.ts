import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

/**
 * Handing a file to the health worker so they can pass it on.
 *
 * This is the only thing in Reba that can put patient data anywhere other than
 * the device, and it never happens on its own: it takes a deliberate tap, and
 * the health worker chooses the destination in the system share sheet. There
 * is no account, no server and no sync — see the README.
 *
 * The file goes to the cache directory on purpose. It is a copy, not the
 * record, and the OS clearing it is exactly what should happen to a spreadsheet
 * of patient data sitting around after it has been sent.
 */

export class ShareUnavailable extends Error {}

/**
 * Writes the text to a file and opens the share sheet.
 *
 * Throws if sharing is not available on the platform, so the caller can say so
 * rather than appearing to do nothing.
 */
export async function shareText(fileName: string, contents: string): Promise<void> {
  if (Platform.OS === 'web' || !(await Sharing.isAvailableAsync())) {
    throw new ShareUnavailable('sharing is not available on this platform');
  }

  const dir = new Directory(Paths.cache, 'exports');
  dir.create({ intermediates: true, idempotent: true });

  const file = new File(dir, fileName);
  if (file.exists) file.delete();
  file.create();
  file.write(contents);

  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/csv',
    UTI: 'public.comma-separated-values-text',
    dialogTitle: fileName,
  });
}
