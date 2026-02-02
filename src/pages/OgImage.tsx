/**
 * OG Image Page Component
 * Renders a 1200x630 preview image for social media sharing
 *
 * Design follows the project's visual aesthetic:
 * - Gradient background matching weather theme
 * - Coat emoji branding
 * - Clean, centered typography
 */

export function OgImage() {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 50%, #f59e0b 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative weather elements */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '80px',
          fontSize: '64px',
          opacity: 0.3,
        }}
      >
        ☀️
      </div>
      <div
        style={{
          position: 'absolute',
          top: '120px',
          right: '120px',
          fontSize: '48px',
          opacity: 0.25,
        }}
      >
        🌤️
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '160px',
          fontSize: '56px',
          opacity: 0.2,
        }}
      >
        🌧️
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '200px',
          fontSize: '44px',
          opacity: 0.25,
        }}
      >
        ❄️
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          zIndex: 10,
        }}
      >
        {/* App icon - coat emoji */}
        <div
          style={{
            fontSize: '140px',
            lineHeight: 1,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
          }}
        >
          🧥
        </div>

        {/* App name */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#78350f',
            margin: 0,
            letterSpacing: '-2px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          OutFitWeather
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: '32px',
            color: '#92400e',
            margin: 0,
            fontWeight: 500,
            maxWidth: '800px',
            textAlign: 'center',
          }}
        >
          What should I wear today?
        </p>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              padding: '12px 24px',
              borderRadius: '50px',
              fontSize: '20px',
              color: '#78350f',
              fontWeight: 500,
            }}
          >
            🌡️ Real-time Weather
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              padding: '12px 24px',
              borderRadius: '50px',
              fontSize: '20px',
              color: '#78350f',
              fontWeight: 500,
            }}
          >
            👔 Smart Outfits
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px)',
              padding: '12px 24px',
              borderRadius: '50px',
              fontSize: '20px',
              color: '#78350f',
              fontWeight: 500,
            }}
          >
            📅 7-Day Forecast
          </div>
        </div>
      </div>

      {/* Bottom attribution */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          fontSize: '18px',
          color: '#92400e',
          opacity: 0.7,
        }}
      >
        Outfit recommendations based on your local weather
      </div>
    </div>
  )
}

export default OgImage
