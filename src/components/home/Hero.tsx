export function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '320px',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: '#064e3b',
      }}
      aria-label="Oyo State hero banner"
    >
      <img
        src="/images/oyo-hero.jpg"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'right center',
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(2,44,34,.97) 0%, rgba(6,78,59,.88) 38%, rgba(6,78,59,.3) 65%, rgba(6,78,59,0) 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  )
}