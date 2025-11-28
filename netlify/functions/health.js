// Netlify Function: GET /health
export const handler = async (event) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      status: 'ok', 
      timestamp: Date.now(),
      environment: process.env.NODE_ENV || 'development'
    })
  };
};

