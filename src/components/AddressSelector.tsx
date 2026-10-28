// Backward compatibility wrapper for VietnamAddressSelector
import React from 'react';
import { VietnamAddressSelector } from './VietnamAddressSelector';
import { VietnamAddress, GeocodedAddressResult } from '../types/address';
import { StructuredAddress, GeocodedLocation } from '../services/locationService';

export interface AddressSelectorProps {
  initialAddress?: Partial<StructuredAddress>;
  onGeocoded: (location: GeocodedLocation, address: StructuredAddress) => void;
  onConfirmAddress?: (location: GeocodedLocation, address: StructuredAddress) => void;
  className?: string;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  initialAddress,
  onGeocoded,
  onConfirmAddress,
  className = '',
}) => {
  const handleViewOnMap = (geocoded: GeocodedAddressResult, vAddr: VietnamAddress) => {
    const legacyLocation: GeocodedLocation = {
      latitude: geocoded.latitude,
      longitude: geocoded.longitude,
      confidence: geocoded.confidence,
      confidenceLabel: geocoded.confidenceLabel,
      precisionInfo: geocoded.source,
      formattedAddress: vAddr.formattedAddress || '',
    };
    const legacyAddress: StructuredAddress = {
      country: 'Việt Nam',
      province: vAddr.provinceName || '',
      district: vAddr.districtName || '',
      ward: vAddr.wardName || '',
      street: vAddr.street || '',
      houseNumber: vAddr.houseNumber || '',
    };
    onGeocoded(legacyLocation, legacyAddress);
  };

  const handleConfirm = (vAddr: VietnamAddress, geocoded?: GeocodedAddressResult) => {
    const legacyLocation: GeocodedLocation = {
      latitude: geocoded?.latitude || vAddr.latitude || 10.7769,
      longitude: geocoded?.longitude || vAddr.longitude || 106.7009,
      confidence: geocoded?.confidence || 'approximate',
      confidenceLabel: geocoded?.confidenceLabel || 'VỊ TRÍ TÌM ĐƯỢC',
      precisionInfo: geocoded?.source || 'administrative_center',
      formattedAddress: vAddr.formattedAddress || '',
    };
    const legacyAddress: StructuredAddress = {
      country: 'Việt Nam',
      province: vAddr.provinceName || '',
      district: vAddr.districtName || '',
      ward: vAddr.wardName || '',
      street: vAddr.street || '',
      houseNumber: vAddr.houseNumber || '',
    };
    onConfirmAddress?.(legacyLocation, legacyAddress);
  };

  return (
    <VietnamAddressSelector
      onViewOnMap={handleViewOnMap}
      onConfirmAddress={handleConfirm}
      className={className}
    />
  );
};
