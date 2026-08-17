const GIST_FILENAME = 'timetrack-tasks.json'
const API_BASE = 'https://api.github.com'

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }
}

async function parseErrorMessage(response) {
  try {
    const body = await response.json()
    return body.message || `GitHub API error (${response.status})`
  } catch {
    return `GitHub API error (${response.status})`
  }
}

export async function createGist(token, tasks) {
  const response = await fetch(`${API_BASE}/gists`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      description: 'TimeTrack backup (personal timesheet app)',
      public: false,
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(tasks, null, 2) },
      },
    }),
  })
  if (!response.ok) throw new Error(await parseErrorMessage(response))
  const gist = await response.json()
  return gist.id
}

export async function updateGist(token, gistId, tasks) {
  const response = await fetch(`${API_BASE}/gists/${gistId}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(tasks, null, 2) },
      },
    }),
  })
  if (!response.ok) throw new Error(await parseErrorMessage(response))
}

export async function fetchGistTasks(token, gistId) {
  const response = await fetch(`${API_BASE}/gists/${gistId}`, {
    headers: authHeaders(token),
  })
  if (!response.ok) throw new Error(await parseErrorMessage(response))
  const gist = await response.json()
  const file = gist.files?.[GIST_FILENAME]
  if (!file) throw new Error(`Gist has no "${GIST_FILENAME}" file.`)
  const content = file.truncated ? await (await fetch(file.raw_url)).text() : file.content
  const parsed = JSON.parse(content)
  if (!Array.isArray(parsed)) throw new Error('Gist content is not a valid task list.')
  return parsed
}
