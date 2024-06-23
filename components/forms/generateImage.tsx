import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Loader } from 'lucide-react';
import { UploadImage } from '@/lib/actions/uploadImageGcp';

const GenerateThumbnail = ({ setImage, image }: any) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setIsImageLoading(true);
    setImage('');

    try {
      const formData = new FormData();
      formData.append('profile_photo', file);

      const imgRes = await UploadImage(formData);
      if (imgRes && imgRes.fileUrl) {
        setImage(imgRes.fileUrl);
        setIsImageLoading(false);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      setIsImageLoading(false);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files || files.length === 0) {
        alert('Please select a file to upload');
        return;
      }

      const file = files[0];
      handleImageUpload(file);
    } catch (error) {
      console.error('Error handling image upload:', error);
      alert('Error uploading image');
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  return (
    <>
    {image && (
        <div className="flex justify-center items-center w-full">
            <Image src={image} width={500} height={500} className="mb-5" alt="thumbnail" />
        </div>
    )}
      <div
        className={`image_div ${isDragOver ? 'drag-over' : ''}`}
        onClick={() => imageRef?.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Input
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={(e) => uploadImage(e)}
          accept="image/*"
        />

        {!isImageLoading ? (
          <Image src="/assets/upload-image.svg" width={40} height={40} alt="upload" />
        ) : (
          <div className="text-16 flex justify-center items-center font-medium text-white-1">
            Uploading
            <Loader size={20} className="animate-spin ml-2" />
          </div>
        )}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-12 font-bold text-orange-1">Click or Drag & Drop to upload</h2>
          <p className="text-12 font-normal text-gray-1">SVG, PNG, JPG, or GIF (max. 1080x1080px)</p>
        </div>
      </div>
    </>
  );
};

export default GenerateThumbnail;
