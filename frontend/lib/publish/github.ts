/**
 * Minimal GitHub REST helpers to create a repo and commit a set of files in one
 * commit via the Git Data API. Uses a user-supplied token (never stored server-side).
 */

const GH_API = "https://api.github.com";

function ghHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "LuxeGen-Publisher",
    "Content-Type": "application/json",
  };
}

async function ghFetch(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const res = await fetch(`${GH_API}${path}`, {
    ...init,
    headers: { ...ghHeaders(token), ...(init?.headers ?? {}) },
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    const message =
      (json && typeof json === "object" && "message" in json
        ? String((json as { message: unknown }).message)
        : text) || `GitHub API error ${res.status}`;
    throw new Error(`GitHub: ${message}`);
  }
  return json;
}

export type GithubPublishResult = {
  repoUrl: string;
  owner: string;
  repo: string;
  branch: string;
};

export async function publishToGithub(params: {
  token: string;
  repoName: string;
  files: Record<string, string>;
  commitMessage?: string;
}): Promise<GithubPublishResult> {
  const { token, repoName, files } = params;

  // 1) Who am I
  const user = (await ghFetch(token, "/user")) as { login: string };
  const owner = user.login;

  // 2) Create the repo (auto_init gives us a base commit/branch to build on)
  let repo: { name: string; default_branch: string; html_url: string };
  try {
    repo = (await ghFetch(token, "/user/repos", {
      method: "POST",
      body: JSON.stringify({
        name: repoName,
        description: "Generated with LuxeGen",
        private: false,
        auto_init: true,
      }),
    })) as typeof repo;
  } catch (err) {
    // If the repo already exists, fall back to it.
    const existing = (await ghFetch(token, `/repos/${owner}/${repoName}`)) as {
      name: string;
      default_branch: string;
      html_url: string;
    };
    if (!existing?.name) {
      throw err;
    }
    repo = existing;
  }

  const branch = repo.default_branch || "main";

  // 3) Base ref + base commit + base tree
  const ref = (await ghFetch(
    token,
    `/repos/${owner}/${repo.name}/git/ref/heads/${branch}`,
  )) as { object: { sha: string } };
  const baseCommitSha = ref.object.sha;
  const baseCommit = (await ghFetch(
    token,
    `/repos/${owner}/${repo.name}/git/commits/${baseCommitSha}`,
  )) as { tree: { sha: string } };
  const baseTreeSha = baseCommit.tree.sha;

  // 4) Blobs for each file
  const treeEntries = await Promise.all(
    Object.entries(files).map(async ([path, content]) => {
      const blob = (await ghFetch(token, `/repos/${owner}/${repo.name}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content, encoding: "utf-8" }),
      })) as { sha: string };
      return {
        path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: blob.sha,
      };
    }),
  );

  // 5) Tree on top of base
  const tree = (await ghFetch(token, `/repos/${owner}/${repo.name}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
  })) as { sha: string };

  // 6) Commit
  const commit = (await ghFetch(token, `/repos/${owner}/${repo.name}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: params.commitMessage || "Publish site generated with LuxeGen",
      tree: tree.sha,
      parents: [baseCommitSha],
    }),
  })) as { sha: string };

  // 7) Move branch to the new commit
  await ghFetch(token, `/repos/${owner}/${repo.name}/git/refs/heads/${branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: true }),
  });

  return { repoUrl: repo.html_url, owner, repo: repo.name, branch };
}
