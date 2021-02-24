import React, { useCallback, useState, useRef } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { anOldHope } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import './tailwind.css'

import ImageUpload from './components/ImageUpload'
import Spinner from './components/Spinner'
import Copy from './components/SVG/Copy'

const App: React.FC = () => {
  const [htmlText, setHtmlText] = useState<any>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const outputRef = useRef<HTMLDivElement>(null)

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
    html = html.match(/(<svg)(.*)(\/svg>)/gms)![0]
    html = html.replace(/^(<\?xml)(.*)/, "")
    html = html.replace(/^(<!--)(.*)(-->)/gsm, "")
    html = html.replace(/<metadata>(.*)<\/metadata>/gms, '')
    html = html.split('\n').filter(line => line !== '').join('\n')
    return html
  }

  const copyHtml = () => {
    navigator.clipboard.writeText(outputRef.current?.textContent!)
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <div className="font-inter p-8 pt-16 md:p-14 md:pt-20 lg:p-16 lg:pt-24">
      <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-center ${htmlText ? 'h-96' : 'h-32'}`}>
        <ImageUpload
          onUpload={readHtmlFromSvg}
          className="lg:w-2/5 xl:max-w-lg mb-4 lg:mb-0 h-full" />

        <div
          ref={outputRef}
          className={`relative rounded-md lg:w-3/5 xl:max-w-4xl lg:ml-4 xl:ml-10 max-h-96 overflow-auto ${isLoading ? 'flex flex-row justify-center items-center min-h-full' : ''}`}
          style={{ backgroundColor: '#1c1d21' }}
        >
          {isLoading ?
            <Spinner /> :
            <>
              {htmlText && <div className="sticky top-2 flex flex-row justify-end pr-1">
                <Copy onClick={copyHtml} />
              </div>
              }
              <SyntaxHighlighter
                language="htmlbars"
                style={anOldHope}
                wrapLongLines
              >
                {htmlText ? filterHtml(htmlText) : 'The output will be shown here.'}
              </SyntaxHighlighter>
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default App
