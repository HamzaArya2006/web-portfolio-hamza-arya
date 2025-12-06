# Nova AI Assistant - Netlify Cloud Integration Setup

## Overview

Nova now has cloud integration with Netlify Blobs for persistent conversation storage and global learning. This allows Nova to:
- Save all conversations to the cloud
- Learn from all user interactions
- Provide better responses based on global analytics
- Maintain conversation history across sessions

## Setup Instructions

### 1. Install Dependencies

The `@netlify/blobs` package is already added to `package.json`. Install it:

```bash
npm install
```

### 2. Configure Netlify Blobs

Set these environment variables in **Netlify Dashboard** → **Site settings** → **Environment variables**:

- `NETLIFY_SITE_ID` - Your Netlify site ID (found in Site settings → General → Site details)
- `NETLIFY_BLOB_READ_WRITE_TOKEN` - Generate in Netlify Dashboard → User settings → Applications → Personal access tokens

**To get your Site ID:**
1. Go to Netlify Dashboard → Your Site
2. Site settings → General
3. Copy the "Site ID" (looks like: `abc123-def456-ghi789`)

**To generate a Blob token:**
1. Go to Netlify Dashboard → User settings → Applications
2. Click "New access token"
3. Name it "Nova Blobs" and select "Blobs: Read & Write" scope
4. Copy the token (you'll only see it once!)

**Note:** If these are not set, Nova will still work but conversations won't persist (uses in-memory storage).

### 3. Environment Variables

No additional environment variables are required if using Netlify Blobs directly. The functions will automatically use the Blobs store.

### 4. Deploy

Just push to your repository. Netlify will:
- Build your site
- Deploy the new functions automatically
- Make APIs available at:
  - `POST /.netlify/functions/api/conversations/save`
  - `GET /.netlify/functions/api/conversations/load`
  - `GET /.netlify/functions/api/conversations/analytics`

## API Endpoints

### Save Conversation
```
POST /.netlify/functions/api/conversations/save
Content-Type: application/json

{
  "sessionId": "nova-1234567890-abc123",
  "message": "What services do you offer?",
  "response": "Hamza offers comprehensive...",
  "context": {
    "lastTopic": "services",
    "mentionedTopics": ["services"],
    "userMood": "neutral",
    "lastIntent": "question"
  }
}
```

### Load Conversations
```
GET /.netlify/functions/api/conversations/load?sessionId=nova-1234567890-abc123
```

Returns:
```json
{
  "conversations": [...],
  "sessionId": "nova-1234567890-abc123",
  "messageCount": 10,
  "totalCount": 10
}
```

### Get Analytics
```
GET /.netlify/functions/api/conversations/analytics
```

Returns:
```json
{
  "totalConversations": 150,
  "totalMessages": 450,
  "topTopics": [
    { "topic": "services", "count": 45 },
    { "topic": "projects", "count": 32 }
  ],
  "topIntents": [...],
  "topSentiments": [...]
}
```

## Features

### 1. Persistent Storage
- All conversations are saved to Netlify Blobs
- Survives function restarts
- Accessible across all user sessions

### 2. Global Learning
- Nova learns from all user interactions
- Popular topics get better responses
- Analytics-driven response improvements

### 3. Session Management
- Each user gets a unique session ID
- Stored in localStorage
- Conversations linked to sessions

### 4. Analytics
- Track popular topics
- Monitor user intents
- Analyze sentiment trends
- All data is anonymized

## Privacy & Security

- **Anonymized Data**: IP addresses are truncated, no personal data stored
- **Rate Limiting**: 20 requests per minute per IP
- **CORS Enabled**: Secure cross-origin requests
- **Input Validation**: All inputs are sanitized and validated
- **Error Handling**: Graceful fallbacks if cloud sync fails

## Troubleshooting

### Conversations Not Saving

1. Check Netlify Blobs is enabled for your site
2. Verify function logs in Netlify Dashboard
3. Check browser console for errors
4. Ensure `@netlify/blobs` is installed

### Analytics Not Loading

1. Analytics are generated after first conversation is saved
2. Check function logs for errors
3. Verify Blobs store exists

### Fallback Mode

If Netlify Blobs is not configured, Nova will:
- Continue working normally
- Use local storage only
- Log warnings (non-blocking)
- Still provide intelligent responses

## Performance

- **Async Operations**: All cloud operations are non-blocking
- **Error Resilience**: Failures don't interrupt user experience
- **Caching**: Session data cached locally
- **Optimized**: Only saves essential data

## Next Steps

1. Deploy to Netlify
2. Enable Blobs in dashboard
3. Test conversation saving
4. Monitor analytics
5. Enjoy smarter Nova! 🤖✨

