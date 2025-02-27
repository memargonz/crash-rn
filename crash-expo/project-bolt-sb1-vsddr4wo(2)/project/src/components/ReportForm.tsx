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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSubmit({
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      partiesInvolved: Number(formData.get('partiesInvolved')),
      estimatedCost: Number(formData.get('estimatedCost')),
      location,
      weatherCondition: formData.get('weatherCondition') as string,
      images,
      partyDetails
    });
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