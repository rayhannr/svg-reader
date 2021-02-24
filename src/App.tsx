import React, { useCallback, useState, useRef, ChangeEvent } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { anOldHope } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import './tailwind.css'

import ImageUpload from './components/ImageUpload'
import Spinner from './components/Spinner'
import Copy from './components/SVG/Copy'
import Radio from './components/Radio'

const App: React.FC = () => {
  const [htmlText, setHtmlText] = useState<any>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [outputType, setOutputType] = useState<string>("html")
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

  const kebabToCamelCase = (str: string) => {
    return str.split('-').map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()).join("")
  }

  const convertToJsx = (html: string) => {
    html = filterHtml(html)
    html = html.replace(/\s(\w+)-(\w)([\w-]*)=/gm, str => kebabToCamelCase(str))
    html = html.replace(/("|')(\d+)("|')/gm, "{$2}")
    return html
  }

  const copyHtml = () => {
    let outputContent = outputRef.current?.textContent!.replace('HTMLJSX', '')!
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
    <div className="font-inter p-8 pt-16 md:p-14 md:pt-20 lg:p-16 lg:pt-24">
      <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-center ${htmlText ? 'h-96' : 'h-32'}`}>
        <ImageUpload
          onUpload={readHtmlFromSvg}
          className="lg:w-2/5 xl:max-w-lg mb-4 lg:mb-0 h-full" />

        <div
          ref={outputRef}
          className={`relative rounded-md lg:w-3/5 xl:max-w-4xl lg:ml-4 xl:ml-10 max-h-96 bg-gray-850 overflow-auto ${isLoading ? 'flex flex-row justify-center items-center min-h-full' : ''}`}
        >
          {isLoading ?
            <Spinner /> :
            <>
              {htmlText && <div className="sticky top-0 pt-2 bg-gray-850 flex flex-row justify-end items-center pr-1">
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
                <Copy onClick={copyHtml} />
              </div>
              }
              <SyntaxHighlighter
                language="htmlbars"
                style={anOldHope}
                wrapLongLines
              >
                {htmlText ? (outputType === 'html' ? filterHtml(htmlText) : convertToJsx(htmlText)) : 'The output will be shown here.'}
              </SyntaxHighlighter>
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default App
