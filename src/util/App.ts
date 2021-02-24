export const filterHtml = (html: string) => {
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

interface styleValues {
    [prop: string]: string
}

const STYLE_REGEX: RegExp = /(style\s*=\s*)("|')([^"]*?)(\s*)("|')/gm

const getStyleObjectFromString = (str: string) => {
    const style: styleValues = {}
    const executedStr = STYLE_REGEX.exec(str)!
    STYLE_REGEX.lastIndex = 0

    const styleValue = executedStr[3]
    styleValue.split(";").forEach(el => {
        const [property, value] = el.split(":")
        if (!property) return

        const formattedProperty = convertAttributeToCamelCase(property.trim(), '-')
        style[formattedProperty] = value.trim()
    })

    let outputStyle = 'style={{'
    for (const property in style) {
        outputStyle += ` ${property}: "${style[property]}",`
    }

    outputStyle = outputStyle.slice(0, -1) //remove last comma in the string
    outputStyle += " }}" //and replace it with this instead

    return outputStyle
}

export const convertToJsx = (html: string) => {
    html = filterHtml(html)
    html = html.replace(/\s(\w+)-(\w)([\w-]*)=/gm, str => convertAttributeToCamelCase(str, '-'))
    html = html.replace(/\s(\w+):(\w)([\w-]*)=/gm, str => convertAttributeToCamelCase(str, ':'))
    html = html.replace(STYLE_REGEX, str => getStyleObjectFromString(str))

    html = html.replace(/("|'\s*)(\d+)(px)*(\s*"|')/gm, "{$2}")
    return html
}