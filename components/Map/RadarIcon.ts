import L from 'leaflet'
import { alpha } from '@mui/material/styles'

export const getRadarIcon = (color: string, isSelected: boolean) => {
  const mainColor = color === 'green' ? '#10b981' : color === 'red' ? '#ef4444' : '#38bdf8'
  const size = isSelected ? 36 : 24

  return L.divIcon({
    className: 'custom-radar-icon',
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
        ${isSelected ? `<div style="position: absolute; width: 100%; height: 100%; border: 2px solid ${mainColor}; border-radius: 50%; animation: radar-pulse 2s infinite ease-out; opacity: 0.5;"></div>` : ''}
        <svg width="${size * 0.8}" height="${size * 0.8}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="${mainColor}" stroke-width="2" fill="${isSelected ? alpha(mainColor, 0.2) : 'none'}" />
          <circle cx="12" cy="12" r="2" fill="${mainColor}" />
          <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="${mainColor}" stroke-width="2" />
        </svg>
      </div>
      <style>
        @keyframes radar-pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  })
}
