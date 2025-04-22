import { HubSpotCommand, HubSpotContact } from './types/hubspot';
import { hubspotClient } from './lib/hubspot-client';
import * as dotenv from 'dotenv';
import { createInterface } from 'readline';

// Load environment variables
dotenv.config();

// Set up stdin/stdout interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Handle cleanup on process exit
process.on('SIGINT', async () => {
  console.log('[HubSpot MCP] Shutting down...');
  rl.close();
  process.exit(0);
});

console.log('[HubSpot MCP] Server started');

// Validate contact data
function validateContactData(contact: HubSpotContact) {
  if (!contact.properties.firstname || typeof contact.properties.firstname !== 'string') {
    throw new Error('First name is required and must be a string');
  }
  if (!contact.properties.lastname || typeof contact.properties.lastname !== 'string') {
    throw new Error('Last name is required and must be a string');
  }
  if (!contact.properties.email || typeof contact.properties.email !== 'string') {
    throw new Error('Email is required and must be a string');
  }
  
  if (!contact.properties.phone || typeof contact.properties.phone !== 'string') {
    throw new Error('Phone is required and must be a string');
  }
  return true;
}

// Validate contact ID
function validateContactId(contactId: string) {
  if (!contactId || typeof contactId !== 'string') {
    throw new Error('Valid contact ID is required');
  }
  return true;
}

rl.on('line', async (line: string) => {
  try {
    const input: HubSpotCommand = JSON.parse(line);
    let result;

    switch (input.command) {
      case 'GET_CONTACTS':
        result = await hubspotClient.getContacts();
        break;

      case 'SEARCH_CONTACTS':
        if (!input.payload?.searchQuery) {
          throw new Error('Search query is required');
        }
        result = await hubspotClient.searchContacts(input.payload.searchQuery);
        break;

      case 'ADD_CONTACT':
        if (!input.payload?.contact) {
          throw new Error('Contact data is required');
        }
        validateContactData(input.payload.contact);
        result = await hubspotClient.addContact(input.payload.contact);
        break;

      case 'UPDATE_CONTACT':
        if (!input.payload?.contactId || !input.payload?.contact) {
          throw new Error('Contact ID and contact data are required');
        }
        validateContactId(input.payload.contactId);
        validateContactData(input.payload.contact);
        result = await hubspotClient.updateContact(input.payload.contactId, input.payload.contact);
        break;

      case 'DELETE_CONTACT':
        if (!input.payload?.contactId) {
          throw new Error('Contact ID is required');
        }
        validateContactId(input.payload.contactId);
        result = await hubspotClient.deleteContact(input.payload.contactId);
        break;

      default:
        result = { error: 'Unknown command' };
    }

    process.stdout.write(JSON.stringify(result) + '\n');
  } catch (error) {
    const err = error as Error;
    process.stdout.write(JSON.stringify({ 
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }) + '\n');
  }
}); 