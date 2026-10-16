// Cloudinary photos are resized on the fly: the shop asks for the width it needs, in the best
// format the browser supports (WebP/AVIF). Other images (the temporary placeholders) pass through.
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[\w-]+\/image\/upload\/)(.*)$/

export function imageSrc(url, width) {
  const match = url?.match(CLOUDINARY_UPLOAD)
  if (!match) return url
  return `${match[1]}f_auto,q_auto,c_limit,w_${width}/${match[2]}`
}

// srcSet for sharp photos on high-density phone screens.
export function imageSrcSet(url, width) {
  if (!CLOUDINARY_UPLOAD.test(url ?? '')) return undefined
  return `${imageSrc(url, width)} 1x, ${imageSrc(url, width * 2)} 2x`
}
