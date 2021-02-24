export const filterHtml = (html: string) => {
    html = html.match(/(<svg)(.*)(\/svg>)/gms)![0]
    html = html.replace(/^(<\?xml)(.*)/, "")
    html = html.replace(/^(<!--)(.*)(-->)/gsm, "")
    html = html.replace(/<metadata>(.*)<\/metadata>/gms, '')
    html = html.split('\n').filter(line => line !== '').join('\n')
    return html
}

export const convertAttributeToCamelCase = (str: string, boundary: string) => {
    return str.split(boundary).map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()).join("")
}

interface styleValues {
    [prop: string]: string
}

const getStyleObjectFromString = (str: string[]) => {
    const style: styleValues = {}

    const styleValue = str[3]
    styleValue.split(";").forEach(el => {
      const [property, value] = el.split(":")
      if (!property) return
  
      const formattedProperty = convertAttributeToCamelCase(property.trim(), '-')
      style[formattedProperty] = value.trim()
    })
    
    let outputStyle = 'style={{'
    for(const property in style){
        outputStyle += ` ${property}: "${style[property]}",`
    }
    
    outputStyle = outputStyle.slice(0, -1) //remove last comma in the string
    outputStyle += " }}"
  
    return outputStyle
  }

export const convertToJsx = (html: string) => {
    html = filterHtml(html)
    html = html.replace(/\s(\w+)-(\w)([\w-]*)=/gm, str => convertAttributeToCamelCase(str, '-'))
    html = html.replace(/\s(\w+):(\w)([\w-]*)=/gm, str => convertAttributeToCamelCase(str, ':'))

    let styleAttribute: string[] | null = /(style\s*=\s*)("|')([^"]*?)(\s*)("|')/gm.exec(html)
    if(styleAttribute){
        html = html.replace(styleAttribute[0], getStyleObjectFromString(styleAttribute))
    }

    html = html.replace(/("|'\s*)(\d+)(px)*(\s*"|')/gm, "{$2}")
    return html
}