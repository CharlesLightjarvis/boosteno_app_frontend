import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface FileUploaderProps {
  accept: string
  onFileSelect: (file: File, fileName: string) => void
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  onFileSelect,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        onFileSelect(file, file.name) // Passe le fichier et son nom
      }
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-md border-2 p-4 text-center transition-all duration-300 ${
        isDragActive ? 'border-primary' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className='mx-auto h-12 w-12 text-gray-400' />
      <p className='mt-2 text-sm text-gray-600'>
        {isDragActive
          ? 'Déposez le fichier ici'
          : 'Glissez et déposez un fichier ici, ou cliquez pour sélectionner un fichier'}
      </p>
      <Button type='button' variant='outline' className='mt-2'>
        Sélectionner un fichier
      </Button>
    </div>
  )
}
