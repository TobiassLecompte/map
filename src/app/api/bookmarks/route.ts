export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // 强制使用边缘运行时


export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function GET(request: Request) {
  const gistId = process.env.GIST_ID;
  const token = process.env.GITHUB_TOKEN;

  if (!gistId || !token) {
    return Response.json({ error: 'Missing GitHub configuration' }, { status: 500, headers: corsHeaders() });
  }

  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      // Cache-busting is handled via `export const dynamic = 'force-dynamic'`
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const data = await response.json();
    const toolsJsonString = data.files['tools.json']?.content;

    if (!toolsJsonString) {
      return Response.json({ error: 'tools.json not found in Gist' }, { status: 404, headers: corsHeaders() });
    }

    const toolsData = JSON.parse(toolsJsonString);
    return Response.json(toolsData, { headers: corsHeaders() });
  } catch (error) {
    console.error('Error fetching gist:', error);
    return Response.json({ error: 'Failed to fetch data' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const apiSecret = process.env.API_SECRET;

  if (!apiSecret || authHeader !== `Bearer ${apiSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders() });
  }

  const gistId = process.env.GIST_ID;
  const token = process.env.GITHUB_TOKEN;

  if (!gistId || !token) {
    return Response.json({ error: 'Missing GitHub configuration' }, { status: 500, headers: corsHeaders() });
  }

  try {
    const body = await request.json();
    const { action, payload } = body;

    // Fetch existing data first
    const getResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store'
    });

    if (!getResponse.ok) {
      throw new Error(`GitHub API returned ${getResponse.status}`);
    }

    const currentGist = await getResponse.json();
    const currentToolsJsonString = currentGist.files['tools.json']?.content;

    if (!currentToolsJsonString) {
      return Response.json({ error: 'tools.json not found in Gist' }, { status: 404, headers: corsHeaders() });
    }

    const toolsData = JSON.parse(currentToolsJsonString);

    if (action === 'add') {
      const { title, url, description, icon } = payload;

      // Extract domain for Google Favicon fallback
      let faviconUrl = '';
      try {
        const domain = new URL(url).hostname;
        faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      } catch { /* invalid URL, leave empty */ }

      const newTool = {
        id: Date.now().toString(),
        name: title || 'Untitled',
        description: description || '',
        categoryId: "productivity", // Default fallback
        url: url,
        icon: icon || faviconUrl || 'logos:javascript', // front-end icon → Google Favicon → Iconify default
        isFavorite: false
      };
      
      // Prevent exact duplicates
      if (!toolsData.tools.some((t: any) => t.url === url)) {
         toolsData.tools.push(newTool);
      }
    } else if (action === 'update_all') {
      // payload should be the full array of tools
      if (!Array.isArray(payload)) {
        return Response.json({ error: 'Invalid payload for update_all' }, { status: 400, headers: corsHeaders() });
      }
      toolsData.tools = payload;
    } else {
      return Response.json({ error: 'Unknown action' }, { status: 400, headers: corsHeaders() });
    }

    // PATCH back to GitHub
    const updateResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          'tools.json': {
            content: JSON.stringify(toolsData, null, 2)
          }
        }
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`GitHub API returned ${updateResponse.status} on update`);
    }

    return Response.json({ success: true }, { headers: corsHeaders() });

  } catch (error) {
    console.error('Error updating gist:', error);
    return Response.json({ error: 'Failed to update data' }, { status: 500, headers: corsHeaders() });
  }
}
