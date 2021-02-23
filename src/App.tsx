import React, { useCallback, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { anOldHope } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import './tailwind.css'

import ImageUpload from './components/ImageUpload'

const App: React.FC = () => {
  const [htmlText, setHtmlText] = useState<any>('')

  const readHtmlFromSvg = useCallback((file: File) => {
    const fileReader = new FileReader()
    fileReader.onload = (event: Event) => {
      setHtmlText(fileReader.result)
    }
    fileReader.readAsText(file)
  }, [])

  return (
    <div className="font-inter p-8 pt-16 md:p-14 md:pt-20 lg:p-16 lg:pt-24">
      <div className="flex flex-col lg:flex-row lg:items-center">
        <ImageUpload onUpload={readHtmlFromSvg} />
        {htmlText &&
          <div className="rounded-md">
            <SyntaxHighlighter
              language="htmlbars"
              style={anOldHope}
              wrapLongLines
            >
              {htmlText}
            </SyntaxHighlighter>
          </div>
        }
      </div>
    </div>
  )
}

export default App
