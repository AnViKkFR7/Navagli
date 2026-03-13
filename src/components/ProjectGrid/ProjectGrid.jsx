import ProjectCard from '../ProjectCard/ProjectCard';
import styles from './ProjectGrid.module.css';

/**
 * Responsive project grid.
 * @param {{ projects: object[], limit?: number }} props
 */
export default function ProjectGrid({ projects, limit }) {
  const displayedProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <div id="projects-grid" className={styles.grid}>
      {displayedProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
