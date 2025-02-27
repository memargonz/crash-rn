import React, { useState } from 'react';
import { Camera, Upload, Plus, Users } from 'lucide-react';
import { PartyDetailsModal } from './PartyDetailsModal';
import { LocationPicker } from './LocationPicker';
import { PartyDetail } from '../types';

interface ReportFormProps {
  onSubmit: (report: Omit<AccidentReport, 'id' | 'createdAt'>) => void;
}

export function ReportForm({ onSubmit }: ReportFormProps) {
  const [images, setImages] = useState<string[]>([]);
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [partyDetails, setPartyDetails] = useState<PartyDetail[]>([]);
  const [partiesInvolved, setPartiesInvolved] = useState(2);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const report = {
      accidentId: 0,
      location,
      accidentDate: `${formData.get('date')}T${formData.get('time')}:00.000Z`,
      weather: formData.get('weatherCondition') as string,
      daylight: "day", // You might want to add a field for daylight condition
      estimatedCost: Number(formData.get('estimatedCost')),
      numberOfParties: Number(formData.get('partiesInvolved')),
      latitude: 0, // You might want to get the actual latitude
      longitude: 0, // You might want to get the actual longitude
      parties: partyDetails.map(detail => ({
        accidentId: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // This should be dynamically generated or fetched
        license: detail.driversLicense,
        lastName: detail.lastName,
        firstName: detail.firstName,
        address: detail.address,
        phone: detail.phone,
        remarks: detail.remarks,
        insuranceProvider: detail.insuranceProvider,
        insuranceNumber: detail.insuranceNumber
      })),
      eventData: "string", // You might want to add actual event data
      description
    };

    try {
      const response = await fetch('https://localhost:44324/api/accidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Report submitted successfully:', responseData);

      // Upload images
      const imageFormData = new FormData();
      imageFormData.append('AccidentId', responseData.accidentId);
      for (const [index, image] of images.entries()) {
              const response = await fetch(image);
              const blob = await response.blob();
              imageFormData.append('Images', blob, `image${index + 1}.jpg`);
            }

      const imageResponse = await fetch('https://localhost:44324/api/accidents/uploadimages', {
        method: 'POST',
        body: imageFormData
      });

      if (!imageResponse.ok) {
        throw new Error('Image upload failed');
      }

      console.log('Images uploaded successfully');
    } catch (error) {
      console.error('Error submitting report:', error);
    }

    onSubmit(report);
  };

  const handlePartyDetailsSave = (details: PartyDetail[]) => {
    setPartyDetails(details);
    setShowPartyModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Parties Involved</label>
            <div className="mt-1 flex space-x-2">
              <input
                type="number"
                name="partiesInvolved"
                min="1"
                value={partiesInvolved}
                onChange={(e) => setPartiesInvolved(Number(e.target.value))}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPartyModal(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Users className="h-4 w-4 mr-2" />
                Add Details
              </button>
            </div>
            {partyDetails.length > 0 && (
              <p className="mt-2 text-sm text-green-600">
                ✓ Details added for {partyDetails.length} {partyDetails.length === 1 ? 'party' : 'parties'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Cost ($)</label>
            <input
              type="number"
              name="estimatedCost"
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <LocationPicker value={location} onChange={setLocation} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Weather Condition</label>
            <select
              name="weatherCondition"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select condition</option>
              <option value="Clear">Clear</option>
              <option value="Rainy">Rainy</option>
              <option value="Snowy">Snowy</option>
              <option value="Foggy">Foggy</option>
              <option value="Windy">Windy</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Accident Description</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <div className="mt-1 flex items-center space-x-4">
              <label className="cursor-pointer flex items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-700">Upload</span>
                </div>
              </label>
              
              <label className="cursor-pointer flex items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="text-center">
                  <Camera className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-700">Take Photo</span>
                </div>
              </label>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Report
          </button>
        </div>
      </form>

      {showPartyModal && (
        <PartyDetailsModal
          numberOfParties={partiesInvolved}
          onSave={handlePartyDetailsSave}
          onClose={() => setShowPartyModal(false)}
        />
      )}
    </>
  );
}