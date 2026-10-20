import { getSignedInUserId, supabase } from './supabase';

export const IMAGE_BUCKET = 'journey-map-images';
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const extensionsByMimeType: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/**
 * Uploads an image to public hosting and returns a URL that anyone can load, including
 * visitors of the published link. Files are stored under the uploader's user id.
 */
export async function uploadMapImage(file: Blob, fileName?: string): Promise<string> {
  if (!supabase) {
    throw new Error('Image hosting is not configured. Add the Supabase environment variables.');
  }

  const extension = extensionsByMimeType[file.type];
  if (!extension) {
    throw new Error('Unsupported image type. Use PNG, JPG, WebP, or GIF.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('That image is larger than 10 MB. Try a smaller file.');
  }

  const userId = await getSignedInUserId();
  if (!userId) {
    throw new Error('Sign in to upload images.');
  }

  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}${fileName ? ` (${fileName})` : ''}`);
  }

  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

export function isInlineImage(value: string | undefined): value is string {
  return Boolean(value && value.startsWith('data:image/'));
}

export async function uploadDataUrlImage(dataUrl: string): Promise<string> {
  const blob = await (await fetch(dataUrl)).blob();
  return uploadMapImage(blob);
}
