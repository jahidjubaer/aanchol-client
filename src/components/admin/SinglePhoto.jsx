import { ImagePlus, RefreshCw, X } from 'lucide-react'
import { useId, useState } from 'react'
import { useAdminAuth } from '../../context/adminAuth.js'
import { imageSrc } from '../../utils/image.js'
import { uploadImage } from '../../utils/uploadImage.js'

// One photo (hero slide, campaign, category banner). aspect sets the preview shape, e.g. "aspect-[16/9]".
export default function SinglePhoto({ value, onChange, uploadsEnabled, aspect = 'aspect-[16/9]', hint, error, optional = false }) {
  const { call } = useAdminAuth()
  const inputId = useId()
  const [progress, setProgress] = useState(null)
  const [uploadError, setUploadError] = useState(null)

  const onFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setUploadError(null)
    setProgress(0)
    try {
      onChange(await uploadImage(file, call, setProgress))
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setProgress(null)
    }
  }

  return (
    <div>
      <div className={`relative overflow-hidden bg-base-200 ${aspect}`}>
        {value ? (
          <img src={imageSrc(value, 800)} alt="" className="size-full object-cover" />
        ) : (
          <label
            htmlFor={uploadsEnabled ? inputId : undefined}
            className={`grid size-full place-items-center border border-dashed border-base-content/30 text-center ${
              uploadsEnabled ? 'cursor-pointer transition hover:border-primary hover:text-primary' : 'opacity-60'
            }`}
          >
            <span>
              <ImagePlus size={24} strokeWidth={1.3} className="mx-auto" />
              <span className="mt-2 block text-[10px] uppercase tracking-[0.15em]">
                {uploadsEnabled ? 'Add photo' : 'Uploads not set up'}
              </span>
            </span>
          </label>
        )}

        {progress !== null && (
          <div className="absolute inset-0 grid place-items-center bg-base-100/80 p-6">
            <div className="w-full max-w-40 text-center">
              <span className="loading loading-spinner loading-sm" />
              <progress className="progress progress-primary mt-2 h-1 w-full" value={progress} max="1" />
            </div>
          </div>
        )}

        {value && progress === null && (
          <div className="absolute right-2 top-2 flex gap-2">
            {uploadsEnabled && (
              <label htmlFor={inputId} aria-label="Replace photo" className="grid size-9 cursor-pointer place-items-center rounded-full bg-base-100/90">
                <RefreshCw size={14} />
              </label>
            )}
            {optional && (
              <button type="button" onClick={() => onChange('')} aria-label="Remove photo" className="grid size-9 place-items-center rounded-full bg-base-100/90">
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>
      <input id={inputId} type="file" accept="image/*" onChange={onFile} className="sr-only" />
      {(uploadError || error) && (
        <p role="alert" className="mt-2 text-xs text-error">
          {uploadError || error}
        </p>
      )}
      {hint && <p className="mt-2 text-xs opacity-60">{hint}</p>}
    </div>
  )
}
