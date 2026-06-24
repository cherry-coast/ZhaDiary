export interface CherryResponseEntity<T> {
  code: number
  msg: string
  data: T
  success: boolean
}

export async function request<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<CherryResponseEntity<T>> {
  const token = localStorage.getItem('token')
  const headers = new Headers(options.headers)

  // Default to application/json if not sending FormData
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  // Inject token if available
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      let errorMsg = `HTTP Error: ${response.status}`
      try {
        const errorData = await response.json()
        errorMsg = errorData.msg || errorMsg
      } catch {
        // Fallback if not json
      }
      throw new Error(errorMsg)
    }

    const result: CherryResponseEntity<T> = await response.json()
    if (!result.success) {
      throw new Error(result.msg || '操作失败')
    }

    return result
  } catch (error: any) {
    console.error('Request failed:', error)
    throw new Error(error.message || '网络请求错误，请稍后重试')
  }
}
