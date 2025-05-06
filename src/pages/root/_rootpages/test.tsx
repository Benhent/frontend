import React, { useState } from 'react';
import { uploadToCloudinary } from '../../../config/cloudinary';

const TestPage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
      console.log('Uploaded image URL:', url);
      alert('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Image Upload</h1>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />
        {loading && <p>Uploading...</p>}
      </div>
      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default TestPage;