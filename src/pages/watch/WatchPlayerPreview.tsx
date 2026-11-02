import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CircleAlert, Film, Play, ShieldCheck } from 'lucide-react'
import './watch.css'

const LICENSED_DEMO_SOURCE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
type PlayerStatus = 'empty' | 'ready' | 'loading' | 'playing' | 'paused' | 'error'

function isSecureVideoUrl(value: string): boolean {
  try { return new URL(value).protocol === 'https:' } catch { return false }
}

export function WatchPlayerPreview() {
  const [input, setInput] = useState('')
  const [source, setSource] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [status, setStatus] = useState<PlayerStatus>('empty')
  const [message, setMessage] = useState('')

  const loadSource = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isSecureVideoUrl(input.trim())) {
      setMessage('Enter a secure HTTPS video URL. Some valid URLs may still be unsupported by the browser.')
      return
    }
    if (!authorized) {
      setMessage('Confirm that you are allowed to access and share this video source before loading it.')
      return
    }
    setSource(input.trim())
    setStatus('loading')
    setMessage('')
  }

  const loadDemo = () => {
    setInput(LICENSED_DEMO_SOURCE)
    setAuthorized(true)
    setSource(LICENSED_DEMO_SOURCE)
    setStatus('loading')
    setMessage('')
  }

  return (
    <section className="watch-card watch-player-preview" aria-labelledby="watch-player-title">
      <div className="watch-card__heading">
        <span className="watch-icon-tile"><Film size={21} aria-hidden="true" /></span>
        <div><p className="watch-eyebrow">PLAYER PREVIEW</p><h2 id="watch-player-title">Test a permitted video source</h2></div>
      </div>
      <p className="watch-muted">This preview uses the browser’s native video controls. A valid URL is not proof of licensing; use only sources you are authorized to access.</p>
      <form className="watch-source-form" onSubmit={loadSource}>
        <label className="watch-field"><span>HTTPS video URL</span><input type="url" value={input} onChange={(event) => setInput(event.target.value)} placeholder="https://example.com/video.mp4" autoComplete="url" /></label>
        <label className="watch-checkbox"><input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} /><span>I’m authorized to access and play this source.</span></label>
        <div className="watch-actions">
          <button className="watch-button watch-button--primary" type="submit"><Play size={16} /> Load source</button>
          <button className="watch-button watch-button--secondary" type="button" onClick={loadDemo}>Load licensed demo</button>
        </div>
      </form>
      {message && <p className="watch-inline-error" role="alert"><CircleAlert size={16} />{message}</p>}
      {source ? (
        <div className="watch-video-frame">
          <video key={source} controls playsInline preload="metadata" aria-label="Authorized video preview"
            onLoadStart={() => setStatus('loading')}
            onCanPlay={() => setStatus('ready')}
            onPlaying={() => setStatus('playing')}
            onPause={() => setStatus('paused')}
            onError={() => { setStatus('error'); setMessage('This browser could not play the supplied source. It may be blocked, unsupported, or unavailable.') }}>
            <source src={source} />Your browser does not support HTML video.
          </video>
          <p className="watch-player-status" aria-live="polite">
            {status === 'loading' && 'Loading source…'}{status === 'ready' && 'Ready to play'}{status === 'playing' && 'Playing'}{status === 'paused' && 'Paused'}{status === 'error' && 'Playback unavailable'}
          </p>
        </div>
      ) : (
        <div className="watch-video-empty"><Film size={30} aria-hidden="true" /><p>Your video will appear here after you load an authorized source.</p></div>
      )}
      <p className="watch-attribution"><ShieldCheck size={15} /> Demo clip: <a href="https://peach.blender.org/about/" target="_blank" rel="noreferrer">Big Buck Bunny by Blender Foundation</a>, licensed CC BY 3.0. Attribution required.</p>
      <Link className="watch-text-link" to="/watch">Back to Watch</Link>
    </section>
  )
}
