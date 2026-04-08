import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import PageTransition from '@/components/PageTransition';
import ProjectsClient from '@/components/ProjectsClient';

export default function ProjectsServer() {
  const directory = path.join(process.cwd(), 'content', 'projects');
  
  // Define proper typing for the parsed MDX frontmatter
  let projects: any[] = [];

  try {
    if (fs.existsSync(directory)) {
      const files = fs.readdirSync(directory);
      projects = files.map((filename) => {
        const slug = filename.replace('.mdx', '');
        const markdownWithMeta = fs.readFileSync(path.join(directory, filename), 'utf-8');
        const { data: frontMatter } = matter(markdownWithMeta);
        return {
          slug,
          ...frontMatter,
        };
      });
      // Sort by date inside frontmatter if exists, else keep original order
      projects.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    }
  } catch (error) {
    console.error('Error fetching projects MDX:', error);
  }

  return (
    <PageTransition>
      <ProjectsClient projects={projects} />
    </PageTransition>
  );
}
