import { Octokit } from '@octokit/rest';

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse body
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (e) {
      console.error('JSON parse error:', e);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON' })
      };
    }

    const { title, description, type, email } = parsedBody;

    // Validation
    if (!title || !description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Titre et description requis' })
      };
    }

    // Check environment variables
    const hasToken = !!process.env.GITHUB_TOKEN;
    const hasOwner = !!process.env.GITHUB_OWNER;
    const hasRepo = !!process.env.GITHUB_REPO;

    console.log('Environment check:', { hasToken, hasOwner, hasRepo });

    if (!hasToken || !hasOwner || !hasRepo) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Configuration serveur incomplète',
          details: 'Variables d\'environnement manquantes. Vérifiez GITHUB_TOKEN, GITHUB_OWNER et GITHUB_REPO dans Netlify.'
        })
      };
    }

    // Initialize Octokit
    let octokit;
    try {
      octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
      });
    } catch (e) {
      console.error('Octokit initialization error:', e);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Erreur d\'initialisation',
          details: e.message
        })
      };
    }

    // Label mapping
    const labelMap = {
      bug: 'bug',
      feature: 'enhancement',
      improvement: 'enhancement'
    };

    // Emoji mapping
    const emojiMap = {
      bug: '🐛',
      feature: '✨',
      improvement: '🚀'
    };

    // Build issue body
    let issueBody = description;
    
    if (email) {
      issueBody += `\n\n---\n📧 Contact: ${email}`;
    }

    issueBody += `\n\n_Issue soumise via le formulaire public_`;

    // Create issue
    console.log('Creating issue for:', process.env.GITHUB_OWNER, '/', process.env.GITHUB_REPO);
    
    let data;
    try {
      const response = await octokit.issues.create({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        title: `${emojiMap[type]} ${title}`,
        body: issueBody,
        labels: [labelMap[type]]
      });
      data = response.data;
    } catch (e) {
      console.error('GitHub API error:', e);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Erreur GitHub API',
          details: e.message,
          status: e.status
        })
      };
    }

    console.log('Issue created successfully:', data.number);

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
    console.error('Unexpected error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erreur serveur',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
