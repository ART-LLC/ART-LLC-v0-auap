/**
 * API-First Integrations Configuration
 * 
 * This module defines all external integrations as swappable interfaces.
 * Each integration can be replaced without affecting the core application logic.
 */

// QuickBooks Integration
export interface QuickBooksConfig {
  clientId: string
  clientSecret: string
  realmId: string
  accessToken: string
  refreshToken: string
  baseUrl: string
}

// Power BI Integration
export interface PowerBIConfig {
  tenantId: string
  clientId: string
  clientSecret: string
  workspaceId: string
  datasetId: string
}

// Notion Integration
export interface NotionConfig {
  apiKey: string
  databaseIds: {
    sops: string
    handbooks: string
    procedures: string
    policies: string
  }
}

// Microsoft Teams Integration
export interface TeamsConfig {
  webhookUrl: string
  botToken: string
  channelIds: {
    management: string
    finance: string
    sales: string
    support: string
    warehouse: string
    fraud: string
    it: string
    marketing: string
  }
}

// Trustpilot Integration
export interface TrustpilotConfig {
  apiKey: string
  businessUnitId: string
  businessKey: string
}

// Google Reviews Integration
export interface GoogleReviewsConfig {
  apiKey: string
  placeId: string
}

// Main Integrations Config
export interface IntegrationsConfig {
  quickBooks?: QuickBooksConfig
  powerBI?: PowerBIConfig
  notion?: NotionConfig
  teams?: TeamsConfig
  trustpilot?: TrustpilotConfig
  googleReviews?: GoogleReviewsConfig
}

// Load integrations from environment variables
export function getIntegrationsConfig(): IntegrationsConfig {
  return {
    quickBooks: process.env.QUICKBOOKS_CLIENT_ID
      ? {
          clientId: process.env.QUICKBOOKS_CLIENT_ID,
          clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET || '',
          realmId: process.env.QUICKBOOKS_REALM_ID || '',
          accessToken: process.env.QUICKBOOKS_ACCESS_TOKEN || '',
          refreshToken: process.env.QUICKBOOKS_REFRESH_TOKEN || '',
          baseUrl: process.env.QUICKBOOKS_SANDBOX === 'true' 
            ? 'https://quickbooks.api.ics.intuit.com'
            : 'https://quickbooks.api.intuit.com',
        }
      : undefined,
    powerBI: process.env.POWERBI_TENANT_ID
      ? {
          tenantId: process.env.POWERBI_TENANT_ID,
          clientId: process.env.POWERBI_CLIENT_ID || '',
          clientSecret: process.env.POWERBI_CLIENT_SECRET || '',
          workspaceId: process.env.POWERBI_WORKSPACE_ID || '',
          datasetId: process.env.POWERBI_DATASET_ID || '',
        }
      : undefined,
    notion: process.env.NOTION_API_KEY
      ? {
          apiKey: process.env.NOTION_API_KEY,
          databaseIds: {
            sops: process.env.NOTION_SOPS_DB || '',
            handbooks: process.env.NOTION_HANDBOOKS_DB || '',
            procedures: process.env.NOTION_PROCEDURES_DB || '',
            policies: process.env.NOTION_POLICIES_DB || '',
          },
        }
      : undefined,
    teams: process.env.TEAMS_WEBHOOK_URL
      ? {
          webhookUrl: process.env.TEAMS_WEBHOOK_URL,
          botToken: process.env.TEAMS_BOT_TOKEN || '',
          channelIds: {
            management: process.env.TEAMS_CH_MANAGEMENT || '',
            finance: process.env.TEAMS_CH_FINANCE || '',
            sales: process.env.TEAMS_CH_SALES || '',
            support: process.env.TEAMS_CH_SUPPORT || '',
            warehouse: process.env.TEAMS_CH_WAREHOUSE || '',
            fraud: process.env.TEAMS_CH_FRAUD || '',
            it: process.env.TEAMS_CH_IT || '',
            marketing: process.env.TEAMS_CH_MARKETING || '',
          },
        }
      : undefined,
    trustpilot: process.env.TRUSTPILOT_API_KEY
      ? {
          apiKey: process.env.TRUSTPILOT_API_KEY,
          businessUnitId: process.env.TRUSTPILOT_BU_ID || '',
          businessKey: process.env.TRUSTPILOT_KEY || '',
        }
      : undefined,
    googleReviews: process.env.GOOGLE_REVIEWS_API_KEY
      ? {
          apiKey: process.env.GOOGLE_REVIEWS_API_KEY,
          placeId: process.env.GOOGLE_PLACE_ID || '',
        }
      : undefined,
  }
}
