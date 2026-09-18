import PageTransition from '@/components/PageTransition';
import ProjectsClient from '@/components/ProjectsClient';
import { getProjectsMerged } from '@/lib/projects-server';

export default async function ProjectsServer() {
  // Hybrid: Firestore (dari /admin) menang atas MDX bila slug sama.
  const projects = await getProjectsMerged({ publishedOnly: true });

  return (
    <PageTransition>
      <ProjectsClient projects={projects} />
    </PageTransition>
  );
}
