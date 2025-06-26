import { projects } from '../constants/projects'



const Home = () => {
    return (
        <div className='page-container'>
            <h2>Portfolio</h2>
            <main className='project-list'>
                {projects.map(project => (
                    <a href={'projects' + project.path}>
                        <div className='card'>
                            <img src={project.image} className='card-image' alt={`project-${project.label}`} />
                            <p>{project.label}</p>
                        </div>
                    </a>
                ))}
            </main>
        </div>
    )
}

export default Home