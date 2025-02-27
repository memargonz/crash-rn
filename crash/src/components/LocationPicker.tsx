import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin } from 'lucide-react';
 
interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      const loader = new Loader({
        apiKey: '', // Replace with your API key
        version: 'weekly',
        libraries: ['places']
      });

    loader.load().then(() => {

      if (mapRef.current) {
        // Initialize map
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 53.540235028, lng: -113.49818175 },
          zoom: 10,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Initialize marker
        const markerInstance = new google.maps.Marker({
          map: mapInstance,
          draggable: true,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        // Initialize search box
        if (searchInputRef.current) {
          const searchBoxInstance = new google.maps.places.SearchBox(searchInputRef.current);
          
          searchBoxInstance.addListener('places_changed', () => {
            const places = searchBoxInstance.getPlaces();
            if (places && places.length > 0) {
              const place = places[0];
              if (place.geometry && place.geometry.location) {
                mapInstance.setCenter(place.geometry.location);
                mapInstance.setZoom(18);
                markerInstance.setPosition(place.geometry.location);
                updateLocation(place);
              }
            }
          });

          setSearchBox(searchBoxInstance);
        }

        // Add click listener to map
        mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            markerInstance.setPosition(e.latLng);
            updateLocationFromLatLng(e.latLng);
          }
        });

        // Add dragend listener to marker
        markerInstance.addListener('dragend', () => {
          const position = markerInstance.getPosition();
          if (position) {
            updateLocationFromLatLng(position);
          }
        });

        setMap(mapInstance);
        setMarker(markerInstance);

        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              mapInstance.setCenter(pos);
              mapInstance.setZoom(15);
              markerInstance.setPosition(pos);
              updateLocationFromLatLng(pos);
            },
            () => {
              // Handle geolocation error
            }
          );
        }
      }
    });
  }, []);

  const updateLocation = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      onChange(place.formatted_address);
    }
  };

  const updateLocationFromLatLng = async (latLng: google.maps.LatLng | google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ location: latLng });
      if (response.results[0]) {
        onChange(response.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for a location"
          className="pl-10 pr-4 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      <div 
        ref={mapRef}
        className="w-full h-[300px] rounded-lg overflow-hidden shadow-inner border border-gray-200"
      />
      <p className="text-sm text-gray-500">
        Click on the map or search for a location to set the accident site
      </p>
    </div>
  );
}