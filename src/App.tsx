import React, { useCallback, useState, useRef, ChangeEvent } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { anOldHope } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import './tailwind.css'

import ImageUpload from './components/ImageUpload'
import Spinner from './components/Spinner'
import Copy from './components/SVG/Copy'
import Radio from './components/Radio'
import Heading from './components/Heading'

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

  const filterHtml = (html: string) => {
    html = html.match(/(<svg)(.*)(\/svg>)/gms)![0]
    html = html.replace(/^(<\?xml)(.*)/, "")
    html = html.replace(/^(<!--)(.*)(-->)/gsm, "")
    html = html.replace(/<metadata>(.*)<\/metadata>/gms, '')
    html = html.split('\n').filter(line => line !== '').join('\n')
    return html
  }

  const convertAttributeToCamelCase = (str: string, boundary: string) => {
    return str.split(boundary).map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()).join("")
  }

  const convertToJsx = (html: string) => {
    html = filterHtml(html)
    html = html.replace(/\s(\w+)-(\w)([\w-]*)=/gm, str => convertAttributeToCamelCase(str, '-'))
    html = html.replace(/\s(\w+):(\w)([\w-]*)=/gm, str => convertAttributeToCamelCase(str, ':'))
    html = html.replace(/("|')(\d+)("|')/gm, "{$2}")
    return html
  }

  const copyOutput = () => {
    if(outputType === 'preview') return
    let outputContent = outputRef.current?.textContent!.replace('PreviewHTMLJSX', '')!
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
      <a href="https://github.com/rayhannr/svg-reader" target="_blank" rel="noreferrer" className="absolute font-inter flex flex-row items-center" style={{ top: 20, right: 20 }}>
        <p className="text-gray-600 mr-3">Source code</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill='#4B5563' ><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
      </a>

      <div className="font-inter p-8 pt-16 md:p-14 md:pt-20 lg:p-16">
        <Heading />

        <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-center ${htmlText ? 'lg:h-96' : 'lg:h-32'}`}>
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
                  <Copy onClick={copyOutput} disabled={outputType === 'preview'} />
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
