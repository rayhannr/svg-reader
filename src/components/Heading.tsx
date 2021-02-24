import React from 'react'

const Heading: React.FC = () => (
    <>
        <h1 className="text-center bg-clip-text text-transparent bg-gradient-to-tl from-pink-500 to-rose-500 font-extrabold text-3xl md:text-4xl lg:text-6xl">
            SVG Reader
            </h1>
        <h2 className="font-medium text-lg text-center text-gray-500 mt-2 w-4/5 sm:w-auto mx-auto">Read and preview your SVG file here!</h2>
        <h3 className="text-center text-gray-400 mt-1 mb-5">
            A simple SVG reader that easily read, preview, and convert your SVG file to JSX.
        </h3>
    </>
)

export default Heading