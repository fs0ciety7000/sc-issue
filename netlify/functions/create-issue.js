const { Octokit } = require('@octokit/rest');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { title, description, type, email } = JSON.parse(event.body);

    if (!title || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Titre et description requis' })
      };
    }

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

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

    issueBody += `\n\n_Issue soumise via le formulaire public_`;

    const { data } = await octokit.issues.create({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      title: `${emojiMap[type]} ${title}`,
      body: issueBody,
      labels: [labelMap[type]]
    });

    return {
      statusCode: 200,
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
      body: JSON.stringify({
        error: 'Erreur lors de la création de l\'issue',
        details: error.message
      })
    };
  }
};
