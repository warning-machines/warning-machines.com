import { loadPortfolioProjects } from '@/lib/loadPortfolioProjects';
export type { PortfolioProject } from '@/lib/loadPortfolioProjects';

export function loadElectronicsProjects() {
  return loadPortfolioProjects('electronics');
}
