import React, { useState, useEffect, ChangeEvent } from 'react'

import UploadImage from './SVG/UploadImage'

interface Props{
    onUpload: (htmlCode: File) => void
}

const ImageUpload: React.FC<Props> = props => {
    const [file, setFile] = useState<File>()
    const {onUpload} = props

    useEffect(() => {
        if (!file) {
            return
        }
        onUpload(file)
    }, [file, onUpload])

    const imagePicked = (event: ChangeEvent) => {
        let pickedFile
        const input = event.target as HTMLInputElement
        if (input.files && input.files.length === 1 && input.files[0].size <= 5120000) {
            pickedFile = input.files[0]
            setFile(pickedFile)
        }
        //props.onInput(props.id, pickedFile, fileIsValid)
    }

    const fileInput = (
        <>
            <UploadImage className="mx-auto h-12 w-12 text-pink-500" />
            <div className="text-sm text-center">
                <label className="relative cursor-pointer bg-transparent rounded-md font-medium focus-within:outline-none">
                    <span className="text-pink-500 hover:text-pink-400">Upload SVG</span>
                    <input
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".svg"
                        onChange={imagePicked} />
                </label>
            </div>
            <p className="text-xs text-pink-400">
                The file should no more than 5 MB
            </p>
        </>
    )

    return (
        <div>
            <div className="mt-2 flex justify-center border-2 border-gray-300 border-dashed rounded-md px-6 pt-5 pb-6">
                <div className="text-center relative">
                    {fileInput}
                </div>
            </div>
        </div>
    )
}

export default ImageUpload