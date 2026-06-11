/**
 * Step 2 of the Decap CMS GitHub OAuth flow: exchange the code for an
 * access token and hand it back to the CMS window via postMessage.
 *
 * Required environment variables:
 *   OAUTH_GITHUB_CLIENT_ID
 *   OAUTH_GITHUB_CLIENT_SECRET
 */
export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Missing code');
  }

  const resp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
      client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await resp.json();

  const status = data.error ? 'error' : 'success';
  const content = data.error
    ? JSON.stringify(data)
    : JSON.stringify({ token: data.access_token, provider: 'github' });

  // Decap expects a postMessage handshake: it sends "authorizing:github",
  // then receives "authorization:github:<status>:<payload>".
  const html = `<!DOCTYPE html>
<html>
<body>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(
      'authorization:github:${status}:${content.replace(/'/g, "\\'").replace(/</g, '\\u003c')}',
      e.origin
    );
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
