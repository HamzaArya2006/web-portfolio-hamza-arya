// Netlify Function: GET /api/conversations/load
// Loads conversation data from Netlify Blobs storage

let blobStore = null;

async function getBlobStore() {
  if (blobStore) return blobStore;
  
  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_BLOB_READ_WRITE_TOKEN;
  
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
      }
    };
  } else {
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const store = await getBlobStore();
    const sessionId = event.queryStringParameters?.sessionId;

    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing sessionId parameter' })
      };
    }

    // Load session data
    const sessionKey = `session:${sessionId}`;
    const sessionData = await store.get(sessionKey);
    
    if (!sessionData) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          conversations: [],
          sessionId,
          messageCount: 0
        })
      };
    }

    const session = JSON.parse(sessionData);
    const conversationIds = session.conversations || [];
    
    // Load recent conversations (last 50)
    const recentIds = conversationIds.slice(-50);
    const conversations = [];

    for (const id of recentIds) {
      const conversation = await store.get(id);
      if (conversation) {
        conversations.push(JSON.parse(conversation));
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        conversations: conversations.reverse(), // Most recent first
        sessionId,
        messageCount: conversations.length,
        totalCount: conversationIds.length
      })
    };

  } catch (error) {
    console.error('Error loading conversations:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to load conversations'
      })
    };
  }
};

