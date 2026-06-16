import { TRIPS } from "../data/portfolio";

interface TripsSectionProps {
  isMobile?: boolean;
}

export function TripsSection({ isMobile = false }: TripsSectionProps) {
  return (
    <div style={{ width: "100%" }}>
      {TRIPS.map((trip, i) => (
        <div key={trip.location}>
          {/* Location */}
          <div
            style={{
              fontFamily: "monospace",
              fontSize: isMobile ? 15 : 18,
              fontWeight: 700,
              color: "#f0ece2",
              letterSpacing: "0.01em",
              marginBottom: trip.tagline ? 5 : 12,
            }}
          >
            {trip.location}
          </div>

          {/* Tagline */}
          {trip.tagline && (
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                color: "#4a6050",
                letterSpacing: "0.06em",
                marginBottom: 12,
              }}
            >
              {trip.tagline}
            </div>
          )}

          {/* Description */}
          <div
            style={{
              fontFamily: "monospace",
              fontSize: isMobile ? 13 : 14,
              color: "#c8c4b8",
              lineHeight: 1.7,
            }}
          >
            {trip.description}
          </div>

          {i < TRIPS.length - 1 && (
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.06)",
                margin: "24px 0",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
