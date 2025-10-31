const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Create your custom server
const server = http.createServer((req, res) => {
  // Add COEP and COOP headers to all responses
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  // Proxy the request to Metro/Expo dev server
  proxy.web(req, res, {
    target: 'http://localhost:8081',
    changeOrigin: true,
  });
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Proxy error');
});

const PORT = 8082;
server.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log('This adds COEP/COOP headers to all responses including index.html');
  console.log('\nMake sure Expo is running on port 8081, then visit:');
  console.log(`  http://localhost:${PORT}`);
});
