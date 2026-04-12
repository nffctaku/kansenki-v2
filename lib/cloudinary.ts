export const uploadToCloudinary = async (file: File): Promise<string> => {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!uploadPreset) {
    throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
  }
  if (!cloudName) {
    throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let details = '';
    try {
      details = await response.text();
    } catch {
      details = '';
    }
    throw new Error(`Image upload failed (${response.status}): ${details || response.statusText}`);
  }

  const data: any = await response.json();
  const url = data?.secure_url;
  if (!url || typeof url !== 'string') {
    throw new Error('Image upload succeeded but secure_url is missing');
  }
  return url;
};
