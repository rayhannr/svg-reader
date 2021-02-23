import React, { useCallback, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { anOldHope } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import './tailwind.css'

import ImageUpload from './components/ImageUpload'
import Spinner from './components/Spinner'

const App: React.FC = () => {
  const [htmlText, setHtmlText] = useState<any>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const readHtmlFromSvg = useCallback((file: File) => {
    setIsLoading(true)
    const fileReader = new FileReader()
    fileReader.onload = (event: Event) => {
      setHtmlText(fileReader.result)
    }
    fileReader.readAsText(file)

    fileReader.onloadend = (event: Event) => {
      setIsLoading(false)
    }
  }, [])

  const filterHtml = (html: string) => {
    html = html.replace(/^(<\?xml)(.*)/, "")
    html = html.replace(/^(<!--)(.*)(-->)/gsm, "")
    html = html.replace(/^\s+|\s+$/g, '')
    return html
  }

  return (
    <div className="font-inter p-8 pt-16 md:p-14 md:pt-20 lg:p-16 lg:pt-24">
      <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-center ${htmlText ? 'h-96' : 'h-32'}`}>
        <ImageUpload
          onUpload={readHtmlFromSvg}
          className="lg:w-1/2 xl:max-w-lg mb-4 lg:mb-0 h-full" />

        <div className={`rounded-md lg:w-1/2 xl:max-w-4xl lg:ml-4 xl:ml-10 min-h-full max-h-96 overflow-auto ${isLoading ? 'flex flex-row justify-center items-center' : ''}`}>
          {isLoading ?
            <Spinner /> :
            <SyntaxHighlighter
              language="htmlbars"
              style={anOldHope}
              wrapLongLines
            >
              {htmlText ? filterHtml(htmlText) : 'The output will be shown here.'}
            </SyntaxHighlighter>
          }
        </div>
      </div>
    </div>
  )
}

export default App
