import { SimplePublicObject, SimplePublicObjectWithAssociations } from '@hubspot/api-client/lib/codegen/crm/contacts';

export interface HubSpotContact {
  id?: string;
  properties: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    createdate?: string;
  };
}

export interface HubSpotCommand {
  command: 'GET_CONTACTS' | 'ADD_CONTACT' | 'UPDATE_CONTACT' | 'DELETE_CONTACT' | 'SEARCH_CONTACTS';
  payload?: {
    contactId?: string;
    contact?: HubSpotContact;
    searchQuery?: string;  // For searching contacts
  };
}

export interface HubSpotResponse {
  success: boolean;
  data?: SimplePublicObject | SimplePublicObject[] | { message: string };
  error?: string;
} 