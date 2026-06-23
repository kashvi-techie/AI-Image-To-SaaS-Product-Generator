/**
 * Packages a single generated component into a complete, deployable Next.js
 * (App Router + Tailwind) project. Returns a path→content map used by both the
 * GitHub push and the Vercel deployment.
 */

export function slugifyProjectName(input: string): string {
  const slug = (input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return slug || "luxegen-site";
}

/** Ensure the component file is a client component (framer-motion / hooks need it). */
function ensureUseClient(code: string): string {
  const trimmed = code.trimStart();
  if (/^["']use client["']/.test(trimmed)) {
    return code;
  }
  return `"use client";\n\n${code.trim()}\n`;
}

export function buildProjectFiles(
  componentCode: string,
  projectName: string,
): Record<string, string> {
  const name = slugifyProjectName(projectName);
  const component = ensureUseClient(componentCode);

  const packageJson = JSON.stringify(
    {
      name,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
      },
      dependencies: {
        next: "15.5.15",
        react: "19.1.0",
        "react-dom": "19.1.0",
        "lucide-react": "^0.456.0",
        "framer-motion": "^12.0.0",
      },
      devDependencies: {
        typescript: "^5",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        tailwindcss: "^3.4.0",
        postcss: "^8",
        autoprefixer: "^10",
      },
    },
    null,
    2,
  );

  const tsconfig = JSON.stringify(
    {
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: false,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2,
  );

  return {
    "package.json": packageJson,
    "tsconfig.json": tsconfig,
    "next.config.mjs": `/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nexport default nextConfig;\n`,
    "postcss.config.mjs": `export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n`,
    "tailwind.config.ts": `import type { Config } from "tailwindcss";\n\nconst config: Config = {\n  content: ["./app/**/*.{ts,tsx}"],\n  theme: { extend: {} },\n  plugins: [],\n};\n\nexport default config;\n`,
    "app/globals.css": `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`,
    "app/layout.tsx": `import type { Metadata } from "next";\nimport "./globals.css";\n\nexport const metadata: Metadata = {\n  title: "${name}",\n  description: "Generated with LuxeGen",\n};\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}\n`,
    "app/generated-component.tsx": component,
    "app/page.tsx": `import GeneratedComponent from "./generated-component";\n\nexport default function Page() {\n  return <GeneratedComponent />;\n}\n`,
    ".gitignore": `node_modules\n.next\nout\n.env*.local\n.DS_Store\n`,
    "README.md": `# ${name}\n\nGenerated with [LuxeGen](https://github.com/kashvi-techie/AI-Image-To-SaaS-Product-Generator).\n\n## Run locally\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`,
  };
}
