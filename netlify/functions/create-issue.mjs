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

  let Octokit;
  try {
    // Import Octokit dynamically
    const octokitModule = await import('@octokit/rest');
    Octokit = octokitModule.Octokit;
  } catch (importError) {
    console.error('Failed to import Octokit:', importError);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Module import error',
        details: importError.message 
      })
    };
  }

  try {
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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Configuration manquante' })
      };
    }

    const octokit = new Octokit({ auth: token });

    const labelMap = { 
      bug: 'bug', 
      feature: 'enhancement', 
      improvement: 'enhancement' 
    };
    
    const emojiMap = { 
      bug: '🐛', 
      feature: '✨', 
      improvement: '🚀' 
    };

    let issueBody = description;
    if (email) {
      issueBody += `\n\n---\n📧 Contact: ${email}`;
    }
    issueBody += `\n\n_Soumis via formulaire public_`;

    const response = await octokit.issues.create({
      owner,
      repo,
      title: `${emojiMap[type] || ''} ${title}`,
      body: issueBody,
      labels: [labelMap[type] || 'enhancement']
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        number: response.data.number,
        url: response.data.html_url
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    
    // GitHub API specific errors
    if (error.status) {
      return {
        statusCode: error.status,
        headers,
        body: JSON.stringify({
          error: 'GitHub API error',
          message: error.message,
          status: error.status
        })
      };
    }

    // General errors
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Server error',
        message: error.message
      })
    };
  }
};
