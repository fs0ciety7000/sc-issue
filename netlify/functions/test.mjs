export const handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Function works!',
      env: {
        hasToken: !!process.env.GITHUB_TOKEN,
        hasOwner: !!process.env.GITHUB_OWNER,
        hasRepo: !!process.env.GITHUB_REPO,
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO
      },
      node: process.version
    })
  };
};
