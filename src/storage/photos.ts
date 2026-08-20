import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';
import type { Eye } from '../types/screening';

/**
 * Eye photos on disk. They never go into AsyncStorage.
 *
 * AsyncStorage is a key-value store with tight per-value limits on Android; a
 * couple of photos per screening would blow it apart after a handful of
 * patients, and the failure would land as the record loss the storage module
 * works to prevent. So the image goes to the filesystem and only its path
 * goes into the record.
 *
 * The move out of the cache is the point of this file. takePictureAsync()
 * writes to the cache directory, which the OS is free to empty whenever the
 * phone runs low on space. A record pointing at a cache path is a record that
 * silently loses its photos.
 */

/** One folder per screening, under the document directory, named by record id. */
const ROOT = 'screenings';

/**
 * The filesystem module is a stub on web — there are no file URLs in a
 * browser, and takePictureAsync returns a data: URI there instead, which is
 * passed through untouched.
 *
 * That means the web build does put image bytes into AsyncStorage, which is
 * the thing this file exists to avoid. It is tolerated because web is for
 * clicking through the flow, never for holding patient photos: a couple of
 * real shots would fill the browser's storage quota and the demo would start
 * failing to save. If web ever needs to keep photos, they belong in IndexedDB
 * with only the key in the record.
 */
const onDevice = Platform.OS !== 'web';

function screeningDir(screeningId: string): Directory {
  return new Directory(Paths.document, ROOT, screeningId);
}

/**
 * Moves a freshly taken photo out of the cache and into permanent storage.
 * Returns the URI to put in the record.
 *
 * Throws if the move fails. The caller must tell the health worker rather
 * than store a path to a file that is not there.
 */
export function persistCapture(tempUri: string, screeningId: string, eye: Eye): string {
  if (!onDevice) return tempUri;

  const dir = screeningDir(screeningId);
  dir.create({ intermediates: true, idempotent: true });

  const destination = new File(dir, `${eye}.jpg`);
  // Retaking an eye overwrites the previous shot rather than piling up files.
  if (destination.exists) destination.delete();

  new File(tempUri).move(destination);
  return destination.uri;
}

/** Removes every photo for one screening. */
export function deleteScreeningPhotos(screeningId: string): void {
  if (!onDevice) return;
  const dir = screeningDir(screeningId);
  if (dir.exists) dir.delete();
}

/**
 * Deletes photo folders that no saved record refers to.
 *
 * A screening can be abandoned halfway — the consent script promises the
 * patient they can stop at any point — and photos of a stranger's eyes should
 * not outlive the visit. Rather than trying to catch every way out of the
 * flow, this reconciles the disk against the records that actually exist, so
 * anything orphaned is cleaned up on the next visit to the home screen.
 *
 * Returns how many folders were removed. Never throws: a failed sweep must
 * not stop the app from opening.
 */
export function sweepOrphanPhotos(keepIds: string[]): number {
  if (!onDevice) return 0;

  try {
    const root = new Directory(Paths.document, ROOT);
    if (!root.exists) return 0;

    const keep = new Set(keepIds);
    let removed = 0;

    for (const entry of root.list()) {
      if (entry instanceof Directory && !keep.has(entry.name)) {
        entry.delete();
        removed += 1;
      }
    }
    return removed;
  } catch (cause) {
    console.warn('[reba] could not sweep orphaned photos', cause);
    return 0;
  }
}
