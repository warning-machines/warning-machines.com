import fs from 'fs';
import path from 'path';

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string | null;
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
        tags: meta.tags ?? [],
        image: imageFile ? `/portfolio/${service}/${entry.name}/${imageFile}` : null,
      };
    })
    .filter((p): p is PortfolioProject => p !== null);
}
