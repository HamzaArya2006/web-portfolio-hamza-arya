// Netlify Function: GET /api/conversations/analytics
// Returns aggregated analytics from all conversations (anonymized)

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
    const analyticsKey = 'analytics:global';
    const analytics = await store.get(analyticsKey);

    if (!analytics) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          totalConversations: 0,
          totalMessages: 0,
          topics: {},
          intents: {},
          sentiments: {},
          lastUpdated: null
        })
      };
    }

    const analyticsData = JSON.parse(analytics);

    // Get top topics, intents, sentiments
    const topTopics = Object.entries(analyticsData.topics || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));

    const topIntents = Object.entries(analyticsData.intents || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([intent, count]) => ({ intent, count }));

    const topSentiments = Object.entries(analyticsData.sentiments || {})
      .sort((a, b) => b[1] - a[1])
      .map(([sentiment, count]) => ({ sentiment, count }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        totalConversations: analyticsData.totalConversations || 0,
        totalMessages: analyticsData.totalMessages || 0,
        topTopics,
        topIntents,
        topSentiments,
        topics: analyticsData.topics || {},
        intents: analyticsData.intents || {},
        sentiments: analyticsData.sentiments || {},
        lastUpdated: analyticsData.lastUpdated
      })
    };

  } catch (error) {
    console.error('Error loading analytics:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to load analytics'
      })
    };
  }
};

