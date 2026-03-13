import fs from 'fs';
import path from 'path';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string | null;
};

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

export function loadTeamMembers(): TeamMember[] {
  const dir = path.join(process.cwd(), 'public', 'images', 'about', 'team');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => {
      const memberDir = path.join(dir, entry.name);
      const metaPath = path.join(memberDir, 'meta.json');
      if (!fs.existsSync(metaPath)) return null;

      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as {
        name: string;
        role: string;
      };

      const imageFile = fs
        .readdirSync(memberDir)
        .find((f) => IMAGE_EXTS.includes(path.extname(f).toLowerCase()));

      return {
        id: entry.name,
        name: meta.name,
        role: meta.role,
        image: imageFile ? `/images/about/team/${entry.name}/${imageFile}` : null,
      };
    })
    .filter((m): m is TeamMember => m !== null);
}
