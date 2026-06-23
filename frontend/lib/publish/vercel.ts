/**
 * Minimal Vercel deploy helper. Uploads each file by SHA, then creates a v13
 * deployment referencing those files. Uses a user-supplied token (never stored
 * server-side). Returns the deployment URL (the site builds on Vercel).
 */

import { createHash } from "node:crypto";

const VERCEL_API = "https://api.vercel.com";

function teamQuery(teamId?: string): string {
  return teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";
}

export type VercelDeployResult = {
  deploymentUrl: string;
  inspectorUrl?: string;
};

async function uploadFile(
  token: string,
  content: string,
  teamId?: string,
): Promise<{ sha: string; size: number }> {
  const buf = Buffer.from(content, "utf-8");
  const sha = createHash("sha1").update(buf).digest("hex");
  const res = await fetch(`${VERCEL_API}/v2/files${teamQuery(teamId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/octet-stream",
      "x-vercel-digest": sha,
    },
    body: buf,
  });
  if (!res.ok && res.status !== 409) {
    // 409 = already uploaded (content-addressed); that's fine.
    const text = await res.text();
    throw new Error(`Vercel file upload failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return { sha, size: buf.byteLength };
}

export async function deployToVercel(params: {
  token: string;
  projectName: string;
  files: Record<string, string>;
  teamId?: string;
}): Promise<VercelDeployResult> {
  const { token, projectName, files, teamId } = params;

  const fileEntries = await Promise.all(
    Object.entries(files).map(async ([path, content]) => {
      const { sha, size } = await uploadFile(token, content, teamId);
      return { file: path, sha, size };
    }),
  );

  const res = await fetch(`${VERCEL_API}/v13/deployments${teamQuery(teamId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: projectName,
      files: fileEntries,
      target: "production",
      projectSettings: {
        framework: "nextjs",
      },
    }),
  });

  const text = await res.text();
  let json: Record<string, unknown> = {};
  try {
    json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    json = {};
  }

  if (!res.ok) {
    const errObj = json.error as { message?: string } | undefined;
    const message = errObj?.message || text.slice(0, 300) || `Vercel API error ${res.status}`;
    throw new Error(`Vercel: ${message}`);
  }

  const url = typeof json.url === "string" ? json.url : "";
  const id = typeof json.id === "string" ? json.id : "";
  if (!url) {
    throw new Error("Vercel: deployment created but no URL was returned.");
  }

  return {
    deploymentUrl: `https://${url}`,
    inspectorUrl: id ? `https://vercel.com/${id}` : undefined,
  };
}
