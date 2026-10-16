const MAX_EDGE = 2400 // px; plenty for zoomed product photos
const JPEG_QUALITY = 0.88
const MAX_INPUT_BYTES = 25 * 1024 * 1024

// Phone photos are often 5–12 MB. Shrinking them first makes uploads much faster on mobile data.
async function shrink(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file // e.g. HEIC: let Cloudinary handle it
  let bitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    return file
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size < 2 * 1024 * 1024) {
    bitmap.close()
    return file
  }
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
  return blob ?? file
}

function post(url, form, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total)
    xhr.onload = () => {
      let body = null
      try {
        body = JSON.parse(xhr.responseText)
      } catch {
        // handled below
      }
      if (xhr.status >= 200 && xhr.status < 300 && body?.secure_url) resolve(body)
      else reject(new Error(body?.error?.message ?? 'The photo could not be uploaded. Please try again.'))
    }
    xhr.onerror = () => reject(new Error('Upload failed. Please check your connection and try again.'))
    xhr.send(form)
  })
}

// Uploads one photo straight to Cloudinary using a signature from our server. Returns the photo URL.
export async function uploadImage(file, call, onProgress) {
  if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not a photo.`)
  if (file.size > MAX_INPUT_BYTES) throw new Error(`${file.name} is too large (over 25 MB).`)

  const [{ uploadUrl, fields }, data] = await Promise.all([
    call('/api/admin/uploads/signature', { method: 'POST' }),
    shrink(file),
  ])
  const form = new FormData()
  for (const [key, value] of Object.entries(fields)) form.append(key, value)
  form.append('file', data, file.name)
  const result = await post(uploadUrl, form, onProgress)
  return result.secure_url
}
