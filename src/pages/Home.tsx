import { Canvas } from '@react-three/fiber'
import { projects } from '../constants/projects'
import { PortfolioImageWithShaders } from '../components/ImageWithShaders'
import { PortfolioScene } from '../components/PortfolioScene'



const Home = () => {
    return (
        <div className='page-container'>
            <h2>Portfolio</h2>
            <p>3D visualizations for real estate and more.</p>
            {/* <main className='project-list'>
                {projects.map(project => (
                    <a href={'projects' + project.path}>
                        <div className='card'>
                            <img src={project.url} className='card-image' alt={`project-${project.title}`} />
                            <p>{project.title}</p>
                        </div>
                    </a>
                ))}
            </main> */}

            <div className='portfolio-scene'>
                <PortfolioScene preset="portfolio"
                    className="portfolio" images={projects} />
            </div>

            <p className='copyright'>© 2024 Sameer Vanjari. All rights reserved.</p>
        </div>
    )
}

export default Home