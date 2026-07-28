const schemePattern = /^[a-z][a-z\d+.-]*:\/\//i

const ensureTrailingSlash = (value: string): string => {
  return value.endsWith('/') ? value : `${value}/`
}

export const joinPath = (parent: string, name: string): string => {
  if (schemePattern.test(parent)) {
    return new URL(encodeURIComponent(name), ensureTrailingSlash(parent)).href
  }
  const separator = parent.includes('\\') && !parent.includes('/') ? '\\' : '/'
  return parent.endsWith(separator)
    ? `${parent}${name}`
    : `${parent}${separator}${name}`
}

export const joinRelativePath = (parent: string, name: string): string => {
  return parent ? `${parent}/${name}` : name
}
