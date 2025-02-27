import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PartyDetail } from '../types';

interface PartyDetailsModalProps {
  numberOfParties: number;
  onSave: (details: PartyDetail[]) => void;
  onClose: () => void;
}

export function PartyDetailsModal({ numberOfParties, onSave, onClose }: PartyDetailsModalProps) {
  const [partyDetails, setPartyDetails] = useState<PartyDetail[]>(
    Array(numberOfParties).fill({
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      driversLicense: '',
      remarks: '',
      insuranceNumber: '',
      insuranceProvider: ''
    })
  );

  const handleInputChange = (partyIndex: number, field: keyof PartyDetail, value: string) => {
    setPartyDetails(prev => {
      const newDetails = [...prev];
      newDetails[partyIndex] = { ...newDetails[partyIndex], [field]: value };
      return newDetails;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(partyDetails);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Party Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-auto p-6" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-8">
            {Array.from({ length: numberOfParties }).map((_, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Party {index + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={partyDetails[index].firstName}
                      onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={partyDetails[index].lastName}
                      onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      value={partyDetails[index].address}
                      onChange={(e) => handleInputChange(index, 'address', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={partyDetails[index].phone}
                      onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Driver's License</label>
                    <input
                      type="text"
                      value={partyDetails[index].driversLicense}
                      onChange={(e) => handleInputChange(index, 'driversLicense', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Insurance Number</label>
                    <input
                      type="text"
                      value={partyDetails[index].insuranceNumber}
                      onChange={(e) => handleInputChange(index, 'insuranceNumber', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Insurance Provider</label>
                    <input
                      type="text"
                      value={partyDetails[index].insuranceProvider}
                      onChange={(e) => handleInputChange(index, 'insuranceProvider', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Remarks</label>
                    <textarea
                      value={partyDetails[index].remarks}
                      onChange={(e) => handleInputChange(index, 'remarks', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}