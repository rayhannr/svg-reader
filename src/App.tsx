import React, { useCallback, useState, useRef, ChangeEvent } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { anOldHope } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { filterHtml, convertToJsx } from './util/App'
import './tailwind.css'

import ImageUpload from './components/ImageUpload'
import Spinner from './components/Spinner'
import Copy from './components/SVG/Copy'
import Radio from './components/Radio'
import Heading from './components/Heading'
import LinkToRepo from './components/LinkToRepo'

const App: React.FC = () => {
  const [htmlText, setHtmlText] = useState<any>('')
  const [svgUrl, setSvgUrl] = useState<any>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [outputType, setOutputType] = useState<string>("html")
  const outputRef = useRef<HTMLDivElement>(null)

  const readHtmlFromSvg = useCallback((file: File) => {
    setIsLoading(true)
    const fileReader = new FileReader()
    const fileReader2 = new FileReader()

    fileReader.onload = (event: Event) => {
      setHtmlText(fileReader.result)
    }
    fileReader.readAsText(file)

    fileReader.onloadend = (event: Event) => {
      setIsLoading(false)
    }

    fileReader2.onload = (event: Event) => {
      setSvgUrl(fileReader2.result)
    }
    fileReader2.readAsDataURL(file)

    fileReader2.onloadend = (event: Event) => {
      setIsLoading(false)
    }
  }, [])

  const copyOutput = () => {
    if (outputType === 'preview') return
    let outputContent = outputRef.current?.textContent!.match(/(<svg)(.*)(\/svg>)/gms)![0] as string
    navigator.clipboard.writeText(outputContent)
      .catch(err => {
        console.log(err)
      })
  }

  const radioChangeHandler = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement
    setOutputType(target.value)
  }

  return (
    <>
      <LinkToRepo />
      <div className="font-inter p-8 pt-16 md:p-14 md:pt-20 lg:p-16">
        <Heading />

        <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-center ${htmlText ? 'lg:h-96' : 'lg:h-32'}`}>
          <ImageUpload
            onUpload={readHtmlFromSvg}
            className="lg:w-5/12 xl:max-w-lg mb-4 lg:mb-0 h-full bg-white" />

          <div
            ref={outputRef}
            className={`relative rounded-md lg:w-7/12 xl:max-w-4xl lg:ml-4 xl:ml-10 max-h-96 bg-gray-850 overflow-auto ${isLoading ? 'flex flex-row justify-center items-center min-h-full' : ''}`}
          >
            {isLoading ?
              <Spinner /> :
              <>
                {htmlText && <div className="sticky top-0 pt-2 bg-gray-850 flex flex-row justify-end items-center pr-1">
                  <Radio
                    onChange={radioChangeHandler}
                    id="preview"
                    isSelected={outputType === 'preview'}
                    label="Preview"
                    value="preview" />

                  <Radio
                    onChange={radioChangeHandler}
                    id="html"
                    isSelected={outputType === 'html'}
                    label="HTML"
                    value="html" />

                  <Radio
                    onChange={radioChangeHandler}
                    id="jsx"
                    isSelected={outputType === 'jsx'}
                    label="JSX"
                    value="jsx" />
                  {navigator.clipboard && <Copy onClick={copyOutput} disabled={outputType === 'preview'} />}
                </div>
                }
                {outputType === 'preview' ?
                  <img src={svgUrl} className="w-48 h-auto md:w-72 lg:w-auto lg:h-88 mx-auto" alt="preview" /> :
                  <SyntaxHighlighter
                    language="htmlbars"
                    style={anOldHope}
                    wrapLongLines
                  >
                    {htmlText ? (outputType === 'html' ? filterHtml(htmlText) : convertToJsx(htmlText)) : 'The output will be shown here.'}
                  </SyntaxHighlighter>
                }
              </>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default App
