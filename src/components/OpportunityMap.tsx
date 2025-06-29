import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import type { Database } from '../lib/database.types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type OpportunityWithOrganizer = Database['public']['Tables']['opportunities']['Row'] & { 
  organizer?: { full_name?: string, badges?: string[] } 
};

interface OpportunityMapProps {
  opportunities: OpportunityWithOrganizer[];
  onOpportunityClick?: (opportunity: OpportunityWithOrganizer) => void;
  loading?: boolean;
}

// Sample coordinates for common locations (you can expand this)
const locationCoordinates: { [key: string]: [number, number] } = {
  'Los Angeles, CA': [34.0522, -118.2437],
  'New York, NY': [40.7128, -74.0060],
  'Chicago, IL': [41.8781, -87.6298],
  'Miami, FL': [25.7617, -80.1918],
  'San Francisco, CA': [37.7749, -122.4194],
  'Seattle, WA': [47.6062, -122.3321],
  'Austin, TX': [30.2672, -97.7431],
  'Denver, CO': [39.7392, -104.9903],
  'Boston, MA': [42.3601, -71.0589],
  'Portland, OR': [45.5152, -122.6784],
  'Nashville, TN': [36.1627, -86.7816],
  'Phoenix, AZ': [33.4484, -112.0740],
  'Las Vegas, NV': [36.1699, -115.1398],
  'Orlando, FL': [28.5383, -81.3792],
  'San Diego, CA': [32.7157, -117.1611],
};

export const OpportunityMap: React.FC<OpportunityMapProps> = ({ 
  opportunities, 
  onOpportunityClick,
  loading = false 
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]); // Center of USA
  const [mapZoom, setMapZoom] = useState(4);

  // Get coordinates for a location
  const getCoordinates = (location: string): [number, number] | null => {
    // Try exact match first
    if (locationCoordinates[location]) {
      return locationCoordinates[location];
    }
    
    // Try partial matches
    for (const [key, coords] of Object.entries(locationCoordinates)) {
      if (location.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(location.toLowerCase())) {
        return coords;
      }
    }
    
    return null;
  };

  // Get marker color based on difficulty
  const getMarkerColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10B981'; // green
      case 'intermediate': return '#F59E0B'; // yellow
      case 'advanced': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  // Create custom marker icon
  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            background-color: white;
            width: 8px;
            height: 8px;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  // Filter opportunities that have valid coordinates
  const mappedOpportunities = opportunities
    .map(opp => {
      const coords = getCoordinates(opp.location);
      return coords ? { ...opp, coordinates: coords } : null;
    })
    .filter(Boolean) as (OpportunityWithOrganizer & { coordinates: [number, number] })[];

  // Update map center when opportunities change
  useEffect(() => {
    if (mappedOpportunities.length > 0) {
      // Calculate center of all markers
      const lats = mappedOpportunities.map(opp => opp.coordinates[0]);
      const lngs = mappedOpportunities.map(opp => opp.coordinates[1]);
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      
      setMapCenter([centerLat, centerLng]);
      setMapZoom(mappedOpportunities.length === 1 ? 10 : 6);
    }
  }, [mappedOpportunities]);

  if (loading) {
    return (
      <Card className="bg-neutral-800 border-neutral-700 h-fit sticky top-24">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            Shoot Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-neutral-700 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="w-8 h-8 mx-auto mb-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-medium">Loading map...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-800 border-neutral-700 h-fit sticky top-24">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          Shoot Locations
          {mappedOpportunities.length > 0 && (
            <Badge className="ml-2 bg-orange-500/20 text-orange-400">
              {mappedOpportunities.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-neutral-700 rounded-lg h-96 overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {mappedOpportunities.map((opportunity) => {
              const markerColor = getMarkerColor(opportunity.difficulty);
              const customIcon = createCustomIcon(markerColor);
              
              return (
                <Marker
                  key={opportunity.id}
                  position={opportunity.coordinates}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => onOpportunityClick?.(opportunity),
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-gray-900 mb-2">{opportunity.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {opportunity.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {opportunity.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {opportunity.time}
                        </div>
                      </div>
                      <Badge className={`mt-2 ${
                        opportunity.difficulty === 'beginner' ? 'bg-green-500/20 text-green-600' :
                        opportunity.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-600' :
                        'bg-red-500/20 text-red-600'
                      }`}>
                        {opportunity.difficulty?.charAt(0).toUpperCase() + opportunity.difficulty?.slice(1)}
                      </Badge>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Beginner</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Intermediate</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Advanced</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 