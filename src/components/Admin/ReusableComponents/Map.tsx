import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
// import mapPositions from '@constants/map';
import map from '@app/constants/map';
import L, { Control, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import { IField } from '@forms/generate/types/IField';
import { FC, useEffect } from 'react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
// import 'node_modules/leaflet-geosearch/dist/geosearch.css';
// import { useRecoilValue } from 'recoil';
// import LabelsAtom from '@atoms/Labels';
// import styled from '@emotion/styled';
import styled from 'styled-components';

const Map: FC<any> = ({ field, value, handleChange }) => {
  const { search } = 'أدخل العنوان أو اسم المنطقة أو الإحداثيات';
  const { name = '' } = field;

  const customIcon = L.icon({
    iconUrl: '/logo.png',
    iconSize: [32, 32],
  });

  const SearchControl = () => {
    const map = useMap();
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      handleChange(name, [lat, lng]);
      map.setView([lat, lng]);
    };
    map.on('click', handleMapClick);

    useEffect(() => {
      const searchControl: Control = GeoSearchControl({
        provider: new OpenStreetMapProvider(),
        style: 'bar',
        autoCompleteDelay: 250,
        searchLabel: search,
        position: 'topright',
        showPopup: true,
        showMarker: false,
        autoClose: true,
        animateZoom: true,
        keepResult: true,
        marker: { icon: customIcon },
      });
      map.addControl(searchControl);

      return () => {
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  };

  return (
    <StyledMapContainer
      center={(value as LatLngExpression) ?? map.damascusPosition}
      zoom={13}
      scrollWheelZoom
      style={{ height: '400px', zIndex: 0 }}
      attributionControl={false}
    >
      <TileLayer attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <SearchControl />
      <Marker position={(value as LatLngExpression) ?? map.damascusPosition} icon={customIcon} />
    </StyledMapContainer>
  );
};

const StyledMapContainer = styled(MapContainer)`
  .leaflet-geosearch-bar {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    grid-template-columns: 1fr 30px;

    form {
      .reset {
        position: relative;
      }
    }
  }
`;

export default Map;
