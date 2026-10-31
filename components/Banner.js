// A 16:9 picture box. The picture is fitted inside, so it is never stretched or cropped.
// If there is no picture, a small text note is shown instead.
export default function Banner({ src, alt, empty = 'No photo yet' }) {
  return (
    <div className="banner">
      {src ? <img src={src} alt={alt || ''} loading="lazy" /> : <span className="banner-empty">{empty}</span>}
    </div>
  );
}
