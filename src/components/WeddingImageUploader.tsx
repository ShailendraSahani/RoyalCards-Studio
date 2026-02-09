import { useState } from "react";

interface WeddingImageUploaderProps {
  onUpload: (url: string) => void;
}

export default function WeddingImageUploader({ onUpload }: WeddingImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onUpload(result);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border-2 border-dashed border-pink-300 p-4 rounded-lg text-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        <div className="text-pink-600 font-semibold">
          {uploading ? "Uploading..." : "Click to Upload Wedding Card Image"}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Supports JPG, PNG, GIF (Max 5MB)
        </div>
      </label>
    </div>
  );
}
