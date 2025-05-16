# echord

A modern, type-safe Discord API wrapper written in TypeScript.

## Features

- 🔒 **Type-safe**: Written in TypeScript with full type definitions
- 🚀 **Modern**: Uses the latest Discord API (v10)
- 🌊 **Event-based**: Simple event-driven architecture
- 🛠️ **Extensible**: Easy to extend and customize
- 📦 **Zero dependencies**: Only essential dependencies for WebSocket and compression

## Installation

```bash
npm install echord
# or
pnpm add echord
# or
yarn add echord
```

## Quick Start

```typescript
import { Client, GatewayIntents } from 'echord';

// Create a new client
const client = new Client('YOUR_BOT_TOKEN', {
  intents: Client.createIntents(
    GatewayIntents.Guilds,
    GatewayIntents.GuildMessages,
    GatewayIntents.MessageContent
  ),
});

// Listen for the ready event
client.on('ready', () => {
  console.log('Bot is ready!');
});

// Listen for messages
client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    message.channel.send('Pong!');
  }
});

// Handle errors
client.on('error', (error) => {
  console.error('An error occurred:', error);
});

// Login to Discord
client.login().catch(console.error);
```

## Gateway Intents

Discord requires you to specify which events your bot wants to receive through Gateway Intents. Here are the available intents:

```typescript
GatewayIntents.Guilds                      // Server events
GatewayIntents.GuildMembers               // Member events (privileged)
GatewayIntents.GuildModeration            // Moderation events
GatewayIntents.GuildEmojisAndStickers     // Emoji and sticker events
GatewayIntents.GuildIntegrations          // Integration events
GatewayIntents.GuildWebhooks              // Webhook events
GatewayIntents.GuildInvites               // Invite events
GatewayIntents.GuildVoiceStates           // Voice state events
GatewayIntents.GuildPresences             // Presence events (privileged)
GatewayIntents.GuildMessages              // Message events
GatewayIntents.GuildMessageReactions      // Message reaction events
GatewayIntents.GuildMessageTyping         // Typing events
GatewayIntents.DirectMessages             // DM events
GatewayIntents.MessageContent             // Message content (privileged)
```

## Events

The client emits various events that you can listen to:

```typescript
// Basic events
client.on('ready', () => {});
client.on('error', (error) => {});

// Message events
client.on('messageCreate', (message) => {});
client.on('messageUpdate', (oldMessage, newMessage) => {});
client.on('messageDelete', (message) => {});

// Guild events
client.on('guildCreate', (guild) => {});
client.on('guildMemberAdd', (member) => {});
client.on('guildMemberRemove', (member) => {});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Apache 2.0
