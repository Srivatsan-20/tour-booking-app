import React, { useState, useEffect } from 'react';

const Logo = ({ 
  size = 'medium', 
  showText = true, 
  variant = 'default',
  className = '',
  onClick = null 
}) => {
  const [logoSrc, setLogoSrc] = useState(null);
  const [logoError, setLogoError] = useState(false);

  // Size configurations
  const sizeConfig = {
    small: { width: 40, height: 40, fontSize: '14px', textSize: 'small' },
    medium: { width: 60, height: 60, fontSize: '18px', textSize: 'medium' },
    large: { width: 80, height: 80, fontSize: '24px', textSize: 'large' },
    xlarge: { width: 120, height: 120, fontSize: '32px', textSize: 'xlarge' }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Color variants
  const variants = {
    default: {
      bg: '#F5F5DC', // Cream
      border: '#8B4513', // Maroon
      text: '#8B4513', // Maroon
      accent: '#FFD700' // Gold
    },
    dark: {
      bg: '#2C1810', // Dark brown
      border: '#FFD700', // Gold
      text: '#FFD700', // Gold
      accent: '#F5F5DC' // Cream
    },
    light: {
      bg: '#FFFFFF', // White
      border: '#8B4513', // Maroon
      text: '#8B4513', // Maroon
      accent: '#FFD700' // Gold
    },
    minimal: {
      bg: 'transparent',
      border: 'transparent',
      text: '#8B4513', // Maroon
      accent: '#FFD700' // Gold
    }
  };

  const colors = variants[variant] || variants.default;

  useEffect(() => {
    // Try to load the actual logo
    const loadLogo = async () => {
      try {
        const response = await fetch('/logo.png');
        if (response.ok) {
          setLogoSrc('/logo.png');
        } else {
          setLogoError(true);
        }
      } catch (error) {
        console.log('Logo file not found, using styled fallback');
        setLogoError(true);
      }
    };

    loadLogo();
  }, []);

  const StyledLogo = () => (
    <div 
      style={{
        width: config.width,
        height: config.height,
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Temple structure */}
      <div style={{
        width: '60%',
        height: '30%',
        backgroundColor: colors.text,
        position: 'relative',
        marginBottom: '2px'
      }}>
        {/* Temple tiers */}
        <div style={{
          position: 'absolute',
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '4px',
          backgroundColor: colors.text
        }} />
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '4px',
          backgroundColor: colors.text
        }} />
        {/* Temple top */}
        <div style={{
          position: 'absolute',
          top: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '4px',
          height: '4px',
          backgroundColor: colors.accent,
          borderRadius: '50%'
        }} />
      </div>

      {/* Bus */}
      <div style={{
        width: '70%',
        height: '20%',
        backgroundColor: colors.accent,
        borderRadius: '3px',
        position: 'relative'
      }}>
        <div style={{
          width: '80%',
          height: '60%',
          backgroundColor: colors.text,
          position: 'absolute',
          top: '20%',
          left: '10%',
          borderRadius: '1px'
        }} />
        {/* Wheels */}
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          left: '15%',
          width: '4px',
          height: '4px',
          backgroundColor: colors.text,
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          right: '15%',
          width: '4px',
          height: '4px',
          backgroundColor: colors.text,
          borderRadius: '50%'
        }} />
      </div>

      {/* Religious symbols */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '5%',
        fontSize: size === 'small' ? '8px' : '10px',
        color: colors.text
      }}>
        🔱
      </div>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '5%',
        fontSize: size === 'small' ? '8px' : '10px',
        color: colors.text
      }}>
        ॐ
      </div>

      {/* Tamil text */}
      {size !== 'small' && (
        <div style={{
          position: 'absolute',
          bottom: '2px',
          fontSize: size === 'medium' ? '6px' : '8px',
          color: colors.text,
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: '1'
        }}>
          ஸ்ரீ சாயி
        </div>
      )}
    </div>
  );

  const logoStyle = {
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s ease',
    display: 'inline-block'
  };

  const hoverStyle = onClick ? {
    ':hover': {
      transform: 'scale(1.05)'
    }
  } : {};

  return (
    <div 
      className={`sri-sai-logo ${className}`}
      style={logoStyle}
      onClick={onClick}
      onMouseEnter={(e) => onClick && (e.target.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => onClick && (e.target.style.transform = 'scale(1)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Logo Image or Styled Fallback */}
        {logoSrc && !logoError ? (
          <img 
            src={logoSrc}
            alt="Sri Sai Senthil Tours"
            style={{
              width: config.width,
              height: config.height,
              objectFit: 'contain',
              borderRadius: '8px'
            }}
            onError={() => setLogoError(true)}
          />
        ) : (
          <StyledLogo />
        )}

        {/* Company Text */}
        {showText && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontSize: config.fontSize,
              fontWeight: 'bold',
              color: colors.text,
              lineHeight: '1.2',
              fontFamily: 'Arial, sans-serif'
            }}>
              SRI SAI SENTHIL
            </div>
            <div style={{
              fontSize: size === 'small' ? '10px' : size === 'medium' ? '12px' : '16px',
              color: colors.accent,
              fontWeight: '600',
              lineHeight: '1',
              marginTop: '2px'
            }}>
              TOURS & TRAVELS
            </div>
            {size === 'large' || size === 'xlarge' ? (
              <div style={{
                fontSize: '10px',
                color: colors.text,
                opacity: 0.8,
                marginTop: '2px'
              }}>
                ஸ்ரீ சாயி செந்தில்
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
