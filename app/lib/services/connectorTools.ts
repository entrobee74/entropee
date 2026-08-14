import { entropeeStore, type ConnectorRecord } from './entropeeStore';

export interface ConnectorToolDefinition {
  name: string;
  provider: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

export function getActiveConnectorTools(userId?: string): ConnectorToolDefinition[] {
  const activeConnectors = entropeeStore.getConnectors(userId).filter((c) => c.status === 'connected');

  const tools: ConnectorToolDefinition[] = [];

  activeConnectors.forEach((connector) => {
    switch (connector.provider) {
      case 'github':
        tools.push({
          name: 'github_search_repos',
          provider: 'github',
          description: 'Search connected GitHub repositories and pull issue or code context.',
          parameters: { query: { type: 'string', description: 'Search term' } },
          execute: async ({ query }) => ({
            provider: 'github',
            status: 'success',
            results: [`Simulated GitHub repo search result for "${query}"`],
          }),
        });
        tools.push({
          name: 'github_create_issue',
          provider: 'github',
          description: 'Create a new issue on a connected GitHub repository.',
          parameters: { title: { type: 'string' }, body: { type: 'string' } },
          execute: async ({ title }) => ({
            provider: 'github',
            status: 'success',
            issueUrl: `https://github.com/entrobee74/entropee/issues/1`,
          }),
        });
        break;

      case 'slack':
        tools.push({
          name: 'slack_send_message',
          provider: 'slack',
          description: 'Post a notification message to a connected Slack channel.',
          parameters: { channel: { type: 'string' }, message: { type: 'string' } },
          execute: async ({ channel, message }) => ({
            provider: 'slack',
            status: 'success',
            channel,
            messageSent: message,
          }),
        });
        break;

      case 'notion':
        tools.push({
          name: 'notion_append_page',
          provider: 'notion',
          description: 'Add documentation notes or task records to a connected Notion page.',
          parameters: { title: { type: 'string' }, content: { type: 'string' } },
          execute: async ({ title }) => ({
            provider: 'notion',
            status: 'success',
            pageId: `notion_page_${Date.now()}`,
            title,
          }),
        });
        break;

      case 'google_drive':
        tools.push({
          name: 'gdrive_read_doc',
          provider: 'google_drive',
          description: 'Read specifications or documentation files from connected Google Drive.',
          parameters: { fileId: { type: 'string' } },
          execute: async ({ fileId }) => ({
            provider: 'google_drive',
            status: 'success',
            fileId,
            content: 'Simulated Google Drive document specification content.',
          }),
        });
        break;
    }
  });

  return tools;
}
