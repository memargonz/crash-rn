import React from 'react';
import { format } from 'date-fns';
import { AccidentReport } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReportListProps {
  reports: AccidentReport[];
}

export function ReportList({ reports }: ReportListProps) {
  const [expandedReport, setExpandedReport] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div 
            className="p-6 cursor-pointer hover:bg-gray-50"
            onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Accident Report - {format(new Date(report.createdAt), 'PPP')}
                  </h3>
                  {expandedReport === report.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date & Time:</span>{' '}
                    {format(new Date(`${report.date}T${report.time}`), 'PPp')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {report.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Weather:</span> {report.weatherCondition}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Parties Involved:</span> {report.partiesInvolved}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Estimated Cost:</span>{' '}
                    ${report.estimatedCost.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {report.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Accident photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          {expandedReport === report.id && report.partyDetails && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Party Details</h4>
              <div className="space-y-6">
                {report.partyDetails.map((party, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-medium text-gray-900 mb-3">Party {index + 1}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span>{' '}
                        {party.firstName} {party.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {party.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Driver's License:</span>{' '}
                        {party.driversLicense}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Insurance:</span>{' '}
                        {party.insuranceProvider} - {party.insuranceNumber}
                      </p>
                      <p className="text-sm text-gray-600 md:col-span-2">
                        <span className="font-medium">Address:</span> {party.address}
                      </p>
                      {party.remarks && (
                        <p className="text-sm text-gray-600 md:col-span-2">
                          <span className="font-medium">Remarks:</span> {party.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}