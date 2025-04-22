import { Client } from '@hubspot/api-client';
import { HubSpotContact, HubSpotResponse } from '../types/hubspot';
import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class HubSpotClient {
  private client: Client;

  constructor() {
    const hubspotApiKey = process.env.HUBSPOT_API_KEY;
    if (!hubspotApiKey) {
      throw new Error('HUBSPOT_API_KEY environment variable is required');
    }
    this.client = new Client({ accessToken: hubspotApiKey });
  }

  async getContacts(): Promise<HubSpotResponse> {
    try {
      const response = await this.client.crm.contacts.basicApi.getPage();
      return {
        success: true,
        data: response.results
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch contacts'
      };
    }
  }

  async searchContacts(query: string): Promise<HubSpotResponse> {
    try {
      // Get all contacts first
      const allContacts = await this.getContacts();
      if (!allContacts.success || !allContacts.data) {
        return allContacts;
      }

      // Filter contacts locally
      const searchQuery = query.toLowerCase();
      const contacts = Array.isArray(allContacts.data) ? allContacts.data : [];
      const filteredContacts = contacts.filter((contact: SimplePublicObject) => {
        const email = contact.properties.email?.toLowerCase() || '';
        const firstName = contact.properties.firstname?.toLowerCase() || '';
        const lastName = contact.properties.lastname?.toLowerCase() || '';
        
        return email.includes(searchQuery) || 
               firstName.includes(searchQuery) || 
               lastName.includes(searchQuery);
      });

      return {
        success: true,
        data: filteredContacts
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search contacts'
      };
    }
  }

  async addContact(contact: HubSpotContact): Promise<HubSpotResponse> {
    try {
      const response = await this.client.crm.contacts.basicApi.create({
        properties: contact.properties
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create contact'
      };
    }
  }

  async updateContact(contactId: string, contact: HubSpotContact): Promise<HubSpotResponse> {
    try {
      const response = await this.client.crm.contacts.basicApi.update(contactId, {
        properties: contact.properties
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update contact'
      };
    }
  }

  async deleteContact(contactId: string): Promise<HubSpotResponse> {
    try {
      await this.client.crm.contacts.basicApi.archive(contactId);
      return {
        success: true,
        data: { message: 'Contact deleted successfully' }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete contact'
      };
    }
  }
}

// Create and export a singleton instance
const hubspotClient = new HubSpotClient();
export { hubspotClient, HubSpotClient }; 