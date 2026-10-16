import { ArrowLeft, ArrowRight, ImagePlus, Star, X } from 'lucide-react'
import { useId, useState } from 'react'
import { useAdminAuth } from '../../context/adminAuth.js'
import { imageSrc } from '../../utils/image.js'
import { uploadImage } from '../../utils/uploadImage.js'

const MAX_PHOTOS = 8

// Upload, reorder and remove product photos. The first photo is the main one in the shop.
// onChange receives either the new list or an updater function (like a React state setter).
export default function PhotoManager({ images, onChange, uploadsEnabled }) {
  const { call } = useAdminAuth()
  const inputId = useId()
  const [uploads, setUploads] = useState([]) // { id, name, progress }
  const [error, setError] = useState(null)

  const move = (from, to) => {
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  const onFiles = async (e) => {
    const files = [...e.target.files].slice(0, MAX_PHOTOS - images.length - uploads.length)
    e.target.value = ''
    setError(null)
    // One at a time keeps the order the photos were picked in, and is gentler on mobile data.
    for (const file of files) {
      const id = `${file.name}-${file.size}-${Math.random()}`
      setUploads((u) => [...u, { id, name: file.name, progress: 0 }])
      try {
        const url = await uploadImage(file, call, (progress) =>
          setUploads((u) => u.map((x) => (x.id === id ? { ...x, progress } : x))),
        )
        onChange((current) => [...current, url]) // adds to the latest list, even if photos changed meanwhile
      } catch (err) {
        setError(err.message)
      } finally {
        setUploads((u) => u.filter((x) => x.id !== id))
      }
    }
  }

  const full = images.length + uploads.length >= MAX_PHOTOS

  return (
    <div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((src, i) => (
          <li key={src} className="group relative aspect-[3/4] overflow-hidden bg-base-200">
            <img src={imageSrc(src, 300)} alt="" className="size-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1 top-1 flex items-center gap-1 bg-base-100/90 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.15em]">
                <Star size={10} className="fill-secondary text-secondary" /> Main
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              aria-label={`Remove photo ${i + 1}`}
              className="absolute right-1 top-1 grid size-8 place-items-center rounded-full bg-base-100/90"
            >
              <X size={14} />
            </button>
            <div className="absolute inset-x-1 bottom-1 flex justify-between">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => move(i, i - 1)}
                aria-label={`Move photo ${i + 1} earlier`}
                className="grid size-8 place-items-center rounded-full bg-base-100/90 disabled:invisible"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                type="button"
                disabled={i === images.length - 1}
                onClick={() => move(i, i + 1)}
                aria-label={`Move photo ${i + 1} later`}
                className="grid size-8 place-items-center rounded-full bg-base-100/90 disabled:invisible"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </li>
        ))}

        {uploads.map((u) => (
          <li key={u.id} className="relative grid aspect-[3/4] place-items-center bg-base-200 p-3 text-center">
            <div className="w-full">
              <span className="loading loading-spinner loading-sm" />
              <p className="mt-2 truncate text-[10px] opacity-60">{u.name}</p>
              <progress className="progress progress-primary mt-2 h-1 w-full" value={u.progress} max="1" />
            </div>
          </li>
        ))}

        {uploadsEnabled && !full && (
          <li>
            <label
              htmlFor={inputId}
              className="grid aspect-[3/4] cursor-pointer place-items-center border border-dashed border-base-content/30 bg-base-100 text-center transition hover:border-primary hover:text-primary"
            >
              <span>
                <ImagePlus size={22} strokeWidth={1.3} className="mx-auto" />
                <span className="mt-2 block text-[10px] uppercase tracking-[0.15em]">Add photos</span>
              </span>
            </label>
            <input id={inputId} type="file" accept="image/*" multiple onChange={onFiles} className="sr-only" />
          </li>
        )}
      </ul>

      {error && (
        <p role="alert" className="mt-3 text-sm text-error">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs opacity-60">
        {uploadsEnabled
          ? `Up to ${MAX_PHOTOS} photos. The first is the main photo; use the arrows to change the order. Portrait (3:4) photos look best.`
          : 'Photo uploads switch on once the Cloudinary keys are added to the server. Until then, the woven pattern below is shown.'}
      </p>
    </div>
  )
}
