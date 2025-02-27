export interface AccidentReport {
  id: string;
  date: string;
  time: string;
  partiesInvolved: number;
  estimatedCost: number;
  location: string;
  weatherCondition: string;
  images: string[];
  createdAt: string;
  partyDetails: PartyDetail[];
}

export interface PartyDetail {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  driversLicense: string;
  remarks: string;
  insuranceNumber: string;
  insuranceProvider: string;
}