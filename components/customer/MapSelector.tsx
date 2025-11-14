import {useEffect, useRef, useState} from "react";
import {GoogleMap, Marker, useLoadScript} from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "300px" };
const center = { lat: 17.385, lng: 78.4867 }; // Default: Hyderabad


export function MapSelector ({ lat, lng,  onChange, isEditable = true }: { lat?:number, lng?:number, onChange: (lat: number, lng: number) => void, isEditable?: boolean }) {
    const google_api_key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""
    const [marker, setMarker] = useState((lat && lng) ? {lat, lng} : center);
    const { isLoaded } = useLoadScript({ googleMapsApiKey: google_api_key });

    //useEffect for setting the maps marker even after it rendered.
    useEffect(() => {
        if (lat && lng) {
            setMarker({ lat, lng });
        }
    }, [lat, lng]);

    if (!isLoaded) return <div>Loading map...</div>;

    const handleMapClick = (e: google.maps.MapMouseEvent)=> {
        const lat = e.latLng?.lat() ?? marker.lat;
        const lng = e.latLng?.lng() ?? marker.lng;
        setMarker({ lat, lng });
        onChange(lat, lng);
    };

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={marker}
            zoom={13}
            onClick={isEditable ? handleMapClick : undefined}
            options={{
                draggable: isEditable,
                zoomControl: isEditable,
                scrollwheel: isEditable,
                disableDoubleClickZoom: !isEditable,
            }}
        >
            <Marker position={marker} draggable={isEditable} />
        </GoogleMap>
    );
};
