// Netlify Function: POST /api/conversations/save
// Saves conversation data to Netlify Blobs storage via REST API

let blobStore = null;

// Initialize blob store using Netlify Blobs REST API
async function getBlobStore() {
  if (blobStore) return blobStore;
  
  const siteId = process.env['f466a53e-2467-45a7-9134-8fbed19f628d'];
  const token = process.env['nfp_ism88rqHZwzBXcXKFhH4L52BmbdcdKodc7fa'];
  
  // Use Netlify Blobs REST API
  if (siteId && token) {
    blobStore = {
      async get(key) {
        try {
          const response = await fetch(
            `https://api.netlify.com/api/v1/sites/${siteId}/blobs/${encodeURIComponent(key)}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.status === 404) return null;
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return await response.text();
        } catch (error) {
          console.warn('Blob get failed:', error);
          return null;
        }
      },
      async set(key, value, options) {
        try {
          const response = await fetch(
            `https://api.netlify.com/api/v1/sites/${siteId}/blobs/${encodeURIComponent(key)}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: value
            }
          );
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
        } catch (error) {
          console.warn('Blob set failed:', error);
          throw error;
        }
      }
    };
  } else {
    // Fallback: In-memory storage (not persistent, but works for development)
    console.warn('Netlify Blobs not configured. Set NETLIFY_SITE_ID and NETLIFY_BLOB_READ_WRITE_TOKEN for persistence.');
    blobStore = new Map();
  }
  
  return blobStore;
}

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Rate limiting
  const ip = (event.headers['x-forwarded-for'] || '').toString().split(',')[0].trim() || 'unknown';
  globalThis.__rateLimiter = globalThis.__rateLimiter || new Map();
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReq = 20;
  const bucket = globalThis.__rateLimiter.get(ip) || [];
  const recent = bucket.filter((t) => now - t < windowMs);
  recent.push(now);
  globalThis.__rateLimiter.set(ip, recent);

  if (recent.length > maxReq) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: 'Too many requests' })
    };
  }

  try {
    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    
    const { 
      sessionId, 
      message, 
      response, 
      context, 
      metadata 
    } = body;

    // Validate required fields
    if (!sessionId || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: sessionId and message' })
      };
    }

    // Sanitize and validate
    const sanitized = {
      sessionId: String(sessionId).substring(0, 100),
      message: String(message).substring(0, 5000),
      response: response ? String(response).substring(0, 10000) : null,
      context: context && typeof context === 'object' ? context : {},
      metadata: {
        timestamp: Date.now(),
        ip: ip.substring(0, 50),
        userAgent: (event.headers['user-agent'] || '').substring(0, 200),
        ...(metadata && typeof metadata === 'object' ? metadata : {})
      }
    };

    // Get Netlify Blobs store
    const store = await getBlobStore();
    
    // Generate conversation ID
    const conversationId = `conv:${sanitized.sessionId}:${Date.now()}`;
    
    // Save conversation entry
    await store.set(conversationId, JSON.stringify(sanitized));

    // Update session index
    const sessionKey = `session:${sanitized.sessionId}`;
    const existingSession = await store.get(sessionKey);
    const sessionData = existingSession ? JSON.parse(existingSession) : { conversations: [], updatedAt: Date.now() };
    sessionData.conversations.push(conversationId);
    sessionData.updatedAt = Date.now();
    sessionData.messageCount = sessionData.conversations.length;
    
    await store.set(sessionKey, JSON.stringify(sessionData));

    // Update global analytics (anonymized)
    const analyticsKey = 'analytics:global';
    const analytics = await store.get(analyticsKey);
    const analyticsData = analytics ? JSON.parse(analytics) : {
      totalConversations: 0,
      totalMessages: 0,
      topics: {},
      intents: {},
      sentiments: {},
      lastUpdated: Date.now()
    };

    analyticsData.totalConversations++;
    analyticsData.totalMessages++;
    analyticsData.lastUpdated = Date.now();

    // Update topic analytics
    if (sanitized.context.mentionedTopics) {
      sanitized.context.mentionedTopics.forEach(topic => {
        analyticsData.topics[topic] = (analyticsData.topics[topic] || 0) + 1;
      });
    }

    // Update intent analytics
    if (sanitized.context.lastIntent) {
      analyticsData.intents[sanitized.context.lastIntent] = (analyticsData.intents[sanitized.context.lastIntent] || 0) + 1;
    }

    // Update sentiment analytics
    if (sanitized.context.userMood) {
      analyticsData.sentiments[sanitized.context.userMood] = (analyticsData.sentiments[sanitized.context.userMood] || 0) + 1;
    }

    await store.set(analyticsKey, JSON.stringify(analyticsData));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        conversationId,
        saved: true 
      })
    };

  } catch (error) {
    console.error('Error saving conversation:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to save conversation'
      })
    };
  }
};
