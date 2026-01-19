export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Dynamic import to avoid initialization issues
    const { Octokit } = await import('@octokit/rest');
    
    const { title, description, type, email } = JSON.parse(event.body || '{}');

    if (!title || !description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Titre et description requis' })
      };
    }

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!token || !owner || !repo) {
      console.error('Missing env vars:', { token: !!token, owner: !!owner, repo: !!repo });
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Configuration manquante',
          debug: { hasToken: !!token, hasOwner: !!owner, hasRepo: !!repo }
        })
      };
    }

    const octokit = new Octokit({ auth: token });

    const labelMap = { bug: 'bug', feature: 'enhancement', improvement: 'enhancement' };
    const emojiMap = { bug: '🐛', feature: '✨', improvement: '🚀' };

    let issueBody = description;
    if (email) issueBody += `\n\n---\n📧 Contact: ${email}`;
    issueBody += `\n\n_Soumis via formulaire public_`;

    const { data } = await octokit.issues.create({
      owner,
      repo,
      title: `${emojiMap[type]} ${title}`,
      body: issueBody,
      labels: [labelMap[type]]
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        number: data.number,
        url: data.html_url
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Erreur inconnue',
        type: error.constructor.name
      })
    };
  }
};
