export const getChannelResponse = (channel: string): string => {
  return `${channel}_response_${new Date().getTime()}`
}

export const getErrorChannelResponse = (channel: string): string => {
  return `${channel}_error_response_${new Date().getTime()}`
}

