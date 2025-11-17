import { supabase } from './supabase';

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @param file - The file to upload (File, Blob, or FormData)
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob | any
): Promise<string> {
  try {
    // Verify we have an authenticated session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Not authenticated for file upload:', userError);
      throw new Error('You must be signed in to upload files. Please sign in and try again.');
    }

    console.log('Uploading file to bucket:', bucket, 'path:', path, 'user:', user.id);

    // Convert file to Blob if needed
    let fileBlob: Blob;
    
    if (file instanceof File || file instanceof Blob) {
      fileBlob = file;
    } else if (file.uri) {
      // React Native file object
      const response = await fetch(file.uri);
      fileBlob = await response.blob();
    } else if (file.data) {
      // Base64 data
      const base64Response = await fetch(`data:${file.type || 'application/octet-stream'};base64,${file.data}`);
      fileBlob = await base64Response.blob();
    } else {
      throw new Error('Invalid file format');
    }

    // Ensure path includes user ID folder structure for organization
    // Path should be like: students/{userId}/filename or professors/{userId}/filename
    const pathParts = path.split('/');
    const userId = user.id;
    
    // If path doesn't already include user ID, organize it by folder
    let finalPath = path;
    const hasUserId = pathParts.some(part => part === userId || part.includes(userId));
    const hasFolder = pathParts[0].match(/^(students|professors|transcripts|resumes)/);
    
    if (!hasUserId && !hasFolder) {
      // Determine folder based on bucket and path
      let folder = '';
      if (bucket === 'images') {
        folder = path.includes('students') || path.includes('student') ? 'students' : 'professors';
      } else {
        folder = path.includes('transcript') ? 'transcripts' : 'resumes';
      }
      const fileName = pathParts[pathParts.length - 1] || `file_${Date.now()}`;
      finalPath = `${folder}/${userId}/${fileName}`;
    } else if (!hasUserId && hasFolder) {
      // Path has folder but not user ID, insert user ID
      const fileName = pathParts[pathParts.length - 1];
      finalPath = `${pathParts[0]}/${userId}/${fileName}`;
    }

    console.log('Final upload path:', finalPath);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(finalPath, fileBlob, {
        cacheControl: '3600',
        upsert: true, // Allow overwriting existing files
      });

    if (error) {
      console.error('Storage upload error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // If it's an RLS error, provide more helpful message
      if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
        throw new Error('Permission denied. Please make sure storage bucket policies are configured correctly. Contact support if this persists.');
      }
      
      throw error;
    }

    console.log('File uploaded successfully:', data.path);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Upload multiple files to Supabase Storage
 */
export async function uploadFiles(
  bucket: string,
  files: Array<{ path: string; file: File | Blob | any }>
): Promise<string[]> {
  const uploadPromises = files.map(({ path, file }) =>
    uploadFile(bucket, path, file)
  );
  return Promise.all(uploadPromises);
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

/**
 * Get a public URL for a file in Supabase Storage
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

