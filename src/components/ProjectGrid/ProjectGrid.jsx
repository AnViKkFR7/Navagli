import ProjectCard from '../ProjectCard/ProjectCard';

/**
 * Responsive project grid.
 * @param {{ projects: object[], limit?: number }} props
 */
export default function ProjectGrid({ projects, limit }) {
  const displayedProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      {displayedProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
