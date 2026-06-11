/**
 * Step 1 of the Decap CMS GitHub OAuth flow: redirect the editor to
 * GitHub's authorization screen.
 *
 * Required environment variables:
 *   OAUTH_GITHUB_CLIENT_ID — from the GitHub OAuth App
 */
export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(500).send('OAuth is not configured');
  }
  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'repo,user',
  });
  res.redirect(302, `https://github.com/login/oauth/authorize?${params}`);
}
