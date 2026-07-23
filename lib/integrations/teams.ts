/**
 * Microsoft Teams Integration Adapter
 * 
 * Sends notifications to appropriate channels for:
 * - Critical business events
 * - Department-specific alerts
 * - Daily business reports
 */

import { TeamsConfig } from './config'

interface TeamsMessage {
  '@type': string
  '@context': string
  summary: string
  themeColor: string
  sections: Array<{
    activityTitle: string
    activitySubtitle: string
    facts: Array<{ name: string; value: string }>
    markdown?: boolean
  }>
}

export class TeamsAdapter {
  private config: TeamsConfig

  constructor(config: TeamsConfig) {
    this.config = config
  }

  private async sendToChannel(
    webhookUrl: string,
    message: TeamsMessage
  ): Promise<boolean> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      })

      return response.ok
    } catch (error) {
      console.error('[Teams] Send error:', error)
      return false
    }
  }

  /**
   * Send high-risk order alert to Fraud & Risk channel
   */
  async alertHighRiskOrder(data: {
    orderId: string
    customerId: string
    amount: number
    riskScore: number
    flags: string[]
  }): Promise<boolean> {
    const message: TeamsMessage = {
      '@type': 'MessageCard',
      '@context': 'https://schema.org/extensions',
      summary: `High-Risk Order Alert: ${data.orderId}`,
      themeColor: 'ef4444',
      sections: [
        {
          activityTitle: 'High-Risk Order Detected',
          activitySubtitle: `Order ${data.orderId}`,
          facts: [
            { name: 'Customer ID', value: data.customerId },
            { name: 'Amount', value: `$${(data.amount / 100).toFixed(2)}` },
            { name: 'Risk Score', value: `${data.riskScore}/100` },
            { name: 'Flags', value: data.flags.join(', ') },
          ],
        },
      ],
    }

    return this.sendToChannel(this.config.webhookUrl, message)
  }

  /**
   * Send daily business report
   */
  async sendDailyReport(data: {
    date: string
    totalOrders: number
    totalRevenue: number
    successfulPayments: number
    failedPayments: number
    refunds: number
    chargebacks: number
    highRiskOrders: number
    fraudOrders: number
    newCustomers: number
    topSellingParts: Array<{ name: string; qty: number }>
  }): Promise<boolean> {
    const message: TeamsMessage = {
      '@type': 'MessageCard',
      '@context': 'https://schema.org/extensions',
      summary: `Daily Business Report - ${data.date}`,
      themeColor: '10b981',
      sections: [
        {
          activityTitle: 'Daily Business Report',
          activitySubtitle: data.date,
          facts: [
            { name: 'Total Orders', value: String(data.totalOrders) },
            { name: 'Revenue', value: `$${(data.totalRevenue / 100).toFixed(2)}` },
            { name: 'Successful Payments', value: String(data.successfulPayments) },
            { name: 'Failed Payments', value: String(data.failedPayments) },
            { name: 'Refunds', value: String(data.refunds) },
            { name: 'Chargebacks', value: String(data.chargebacks) },
            { name: 'High-Risk Orders', value: String(data.highRiskOrders) },
            { name: 'Fraud Orders', value: String(data.fraudOrders) },
            { name: 'New Customers', value: String(data.newCustomers) },
          ],
          markdown: true,
        },
      ],
    }

    return this.sendToChannel(this.config.webhookUrl, message)
  }

  /**
   * Send support ticket notification
   */
  async notifyNewTicket(data: {
    ticketNumber: string
    customerName: string
    subject: string
    priority: 'low' | 'medium' | 'high'
    category: string
  }): Promise<boolean> {
    const colorMap = {
      low: '3b82f6',
      medium: 'f59e0b',
      high: 'ef4444',
    }

    const message: TeamsMessage = {
      '@type': 'MessageCard',
      '@context': 'https://schema.org/extensions',
      summary: `New Support Ticket: ${data.ticketNumber}`,
      themeColor: colorMap[data.priority],
      sections: [
        {
          activityTitle: 'New Support Ticket',
          activitySubtitle: `Ticket #${data.ticketNumber}`,
          facts: [
            { name: 'Customer', value: data.customerName },
            { name: 'Subject', value: data.subject },
            { name: 'Priority', value: data.priority.toUpperCase() },
            { name: 'Category', value: data.category },
          ],
        },
      ],
    }

    return this.sendToChannel(this.config.webhookUrl, message)
  }
}

export async function createTeamsAdapter(
  config: TeamsConfig
): Promise<TeamsAdapter> {
  return new TeamsAdapter(config)
}
