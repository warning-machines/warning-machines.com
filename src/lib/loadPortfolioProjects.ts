import fs from 'fs';
import path from 'path';

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string | null;
};

export type PortfolioProjectDetail = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  client?: string;
  year?: string;
};

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

export function loadPortfolioProjects(service: string): PortfolioProject[] {
  const dir = path.join(process.cwd(), 'public', 'portfolio', service);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => {
      const projectDir = path.join(dir, entry.name);
      const metaPath = path.join(projectDir, 'meta.json');
      if (!fs.existsSync(metaPath)) return null;

      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as {
        title: string;
        description: string;
        tags: string[];
      };

      const imageFile = fs
        .readdirSync(projectDir)
        .find((f) => IMAGE_EXTS.includes(path.extname(f).toLowerCase()));

      return {
        id: entry.name,
        title: meta.title,
        description: meta.description,
        tags: (meta.tags ?? []).map((t) => t.trim()).filter(Boolean),
        image: imageFile ? `/portfolio/${service}/${entry.name}/${imageFile}` : null,
      };
    })
    .filter((p): p is PortfolioProject => p !== null);
}

export function loadPortfolioProjectIds(service: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'portfolio', service);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

export function loadPortfolioProjectDetail(
  service: string,
  projectId: string
): PortfolioProjectDetail | null {
  const projectDir = path.join(process.cwd(), 'public', 'portfolio', service, projectId);
  if (!fs.existsSync(projectDir)) return null;

  const metaPath = path.join(projectDir, 'meta.json');
  if (!fs.existsSync(metaPath)) return null;

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as {
    title: string;
    description: string;
    tags: string[];
    client?: string;
    year?: string;
  };

  const images = fs
    .readdirSync(projectDir)
    .filter((f) => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
    .sort()
    .map((f) => `/portfolio/${service}/${projectId}/${f}`);

  return {
    id: projectId,
    title: meta.title,
    description: meta.description ?? '',
    tags: (meta.tags ?? []).map((t) => t.trim()).filter(Boolean),
    images,
    client: meta.client,
    year: meta.year,
  };
}
