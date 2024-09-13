export type ErrorType<name extends string = 'Error'> = Error & { name: name }
export const getUrl = (url: string) => url
