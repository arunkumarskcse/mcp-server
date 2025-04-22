"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hubspotClient = exports.HubSpotClient = void 0;
import { Client } from '@hubspot/api-client';

export class HubSpotClient {
    constructor() {
        const hubspotApiKey = process.env.HUBSPOT_API_KEY;
        if (!hubspotApiKey) {
            throw new Error('HUBSPOT_API_KEY environment variable is required');
        }
        this.client = new Client({ accessToken: hubspotApiKey });
    }

    async getContacts() {
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

    async addContact(contact) {
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

    async updateContact(contactId, contact) {
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

    async deleteContact(contactId) {
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

// Create a singleton instance
exports.hubspotClient = new HubSpotClient();
