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

export const convertToJsx = (html: string) => {
    html = filterHtml(html)
    html = html.replace(/\s(\w+)-(\w)([\w-]*)=/gm, str => convertAttributeToCamelCase(str, '-'))
    html = html.replace(/\s(\w+):(\w)([\w-]*)=/gm, str => convertAttributeToCamelCase(str, ':'))
    html = html.replace(/("|')(\d+)("|')/gm, "{$2}")
    return html
}