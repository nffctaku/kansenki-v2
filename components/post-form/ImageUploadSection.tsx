'use client';
import React from 'react';
import { SectionProps } from '@/types/post';
import CollapsibleSection from './CollapsibleSection';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';

// Define a type for combined images
type ImageItem = {
  id: string;
  type: 'existing' | 'new';
  value: string | File;
};

// New component for each sortable image
const SortableImage: React.FC<{ image: ImageItem; onRemove: () => void; }> = ({ image, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group touch-none w-full h-32">
      <div {...attributes} {...listeners} className="w-full h-full">
        <Image
          src={image.type === 'existing' ? (image.value as string) : URL.createObjectURL(image.value as File)}
          alt={`プレビュー画像`}
          fill
          className="object-cover rounded-lg"
          sizes="10rem"
        />
      </div>
      <button
        type="button"
        onClick={e => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
        className="absolute top-1.5 right-1.5 bg-red-600/75 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold transition-all z-10"
      >
        ✕
      </button>
    </div>
  );
};

const ImageUploadSection: React.FC<SectionProps> = ({ formData, setFormData }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData({ ...formData, imageFiles: [...formData.imageFiles, ...newFiles] });
    }
  };

  const handleRemoveNewImage = (fileToRemove: File) => {
    const updatedFiles = formData.imageFiles.filter(file => file !== fileToRemove);
    setFormData({ ...formData, imageFiles: updatedFiles });
  };

  const handleRemoveExistingImage = (url: string) => {
    const updatedUrls = (formData.existingImageUrls || []).filter(imageUrl => imageUrl !== url);
    setFormData({ ...formData, existingImageUrls: updatedUrls });
  };

  const combinedImages: ImageItem[] = [
    ...(formData.existingImageUrls || []).map(url => ({ id: url, type: 'existing' as const, value: url })),
    ...formData.imageFiles.map((file, i) => ({ id: `new-${i}-${file.name}`, type: 'new' as const, value: file }))
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = combinedImages.findIndex((item) => item.id === active.id);
      const newIndex = combinedImages.findIndex((item) => item.id === over.id);

      const reorderedImages = arrayMove(combinedImages, oldIndex, newIndex);

      const newExistingUrls = reorderedImages
        .filter(item => item.type === 'existing')
        .map(item => item.value as string);
        
      const newImageFiles = reorderedImages
        .filter(item => item.type === 'new')
        .map(item => item.value as File);

      setFormData({
        ...formData,
        existingImageUrls: newExistingUrls,
        imageFiles: newImageFiles,
      });
    }
  };

  return (
    <CollapsibleSection title="画像アップロード">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={combinedImages.map(item => item.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {combinedImages.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onRemove={() => image.type === 'existing'
                  ? handleRemoveExistingImage(image.value as string)
                  : handleRemoveNewImage(image.value as File)
                }
              />
            ))}
            
            {/* Upload button */}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-center text-gray-500 dark:text-gray-400"><span className="font-semibold">画像を追加</span></p>
              </div>
              <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
          </div>
        </SortableContext>
      </DndContext>
    </CollapsibleSection>
  );
};

export default ImageUploadSection;
