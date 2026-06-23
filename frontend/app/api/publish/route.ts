import { NextResponse } from "next/server";
import { buildProjectFiles, slugifyProjectName } from "@/lib/publish/build-project-files";
import { publishToGithub } from "@/lib/publish/github";
import { deployToVercel } from "@/lib/publish/vercel";

export const runtime = "nodejs";
export const maxDuration = 60;

type PublishBody = {
  code?: string;
  projectName?: string;
  githubToken?: string;
  vercelToken?: string;
  vercelTeamId?: string;
};

/**
 * One-click publish: packages the generated component into a deployable Next.js
 * project, optionally creates a GitHub repo, and optionally deploys to Vercel.
 * Tokens are supplied per-request by the user and never persisted server-side.
 */
export async function POST(req: Request): Promise<Response> {
  let body: PublishBody;
  try {
    body = (await req.json()) as PublishBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const code = (body.code ?? "").trim();
  if (!code) {
    return NextResponse.json(
      { error: "Nothing to publish — generate a component first." },
      { status: 400 },
    );
  }

  const githubToken = body.githubToken?.trim();
  const vercelToken = body.vercelToken?.trim();
  if (!githubToken && !vercelToken) {
    return NextResponse.json(
      { error: "Provide a GitHub token, a Vercel token, or both." },
      { status: 400 },
    );
  }

  const projectName = slugifyProjectName(body.projectName ?? "luxegen-site");
  const files = buildProjectFiles(code, projectName);

  const result: {
    projectName: string;
    repoUrl?: string;
    deploymentUrl?: string;
    inspectorUrl?: string;
    warnings: string[];
  } = { projectName, warnings: [] };

  // GitHub (optional)
  if (githubToken) {
    try {
      const gh = await publishToGithub({ token: githubToken, repoName: projectName, files });
      result.repoUrl = gh.repoUrl;
    } catch (err) {
      result.warnings.push(err instanceof Error ? err.message : String(err));
    }
  }

  // Vercel (optional)
  if (vercelToken) {
    try {
      const vc = await deployToVercel({
        token: vercelToken,
        projectName,
        files,
        teamId: body.vercelTeamId?.trim() || undefined,
      });
      result.deploymentUrl = vc.deploymentUrl;
      result.inspectorUrl = vc.inspectorUrl;
    } catch (err) {
      result.warnings.push(err instanceof Error ? err.message : String(err));
    }
  }

  const anySuccess = Boolean(result.repoUrl || result.deploymentUrl);
  if (!anySuccess) {
    return NextResponse.json(
      { error: result.warnings.join(" • ") || "Publish failed.", ...result },
      { status: 502 },
    );
  }

  return NextResponse.json(result);
}
