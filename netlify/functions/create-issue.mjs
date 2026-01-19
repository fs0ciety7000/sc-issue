import { Octokit } from '@octokit/rest';

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const { title, description, type, email } = JSON.parse(event.body);

    // Validation
    if (!title || !description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Titre et description requis' })
      };
    }

    // Check environment variables
    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
      console.error('Missing environment variables:', {
        hasToken: !!process.env.GITHUB_TOKEN,
        hasOwner: !!process.env.GITHUB_OWNER,
        hasRepo: !!process.env.GITHUB_REPO
      });
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Configuration serveur incomplète' })
      };
    }

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

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
    const { data } = await octokit.issues.create({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
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
    console.error('Error creating issue:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erreur lors de la création de l\'issue',
        details: error.message
      })
    };
  }
};
