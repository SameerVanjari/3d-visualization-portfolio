// PortfolioScene.tsx - Complete scene setup
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import { HoverImageGrid, createGridPresets } from './HoverImageGrid'
import type { Project } from '../constants/projects'

// Loading component
const Loader = () => (
    <Html center>
        <div style={{
            color: 'white',
            fontSize: '1.2rem',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center'
        }}>
            Loading...
        </div>
    </Html>
)

// Camera and lighting setup
const SceneSetup: React.FC = () => {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            {/* Environment */}
            <Environment preset="studio" />

            {/* Camera Controls */}
            <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableRotate={false}
                minDistance={3}
                maxDistance={20}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 6}
            />
        </>
    )
}

// Main Portfolio Scene Component
interface PortfolioSceneProps {
    images?: Array<Project>;
    preset?: 'portfolio' | 'gallery' | 'showcase'
    className?: string
}

export const PortfolioScene: React.FC<PortfolioSceneProps> = ({
    images,
    preset = 'portfolio',
    className = ''
}) => {
    // Default images if none provided
    const defaultImages = [
        {
            id: 'img1',
            url: 'https://picsum.photos/512/512?random=1',
            title: 'Abstract Art',
            effect: 'particles' as const,
            path: "/"
        },
        {
            id: 'img2',
            url: 'https://picsum.photos/512/512?random=2',
            title: 'Nature Photography',
            effect: 'paper' as const,
            path: "/"
        },
        {
            id: 'img3',
            url: 'https://picsum.photos/512/512?random=3',
            title: 'Digital Design',
            effect: 'combined' as const,
            path: "/"
        },
        {
            id: 'img4',
            url: 'https://picsum.photos/512/512?random=4',
            title: 'Architecture',
            effect: 'particles' as const,
            path: "/"
        },
        {
            id: 'img5',
            url: 'https://picsum.photos/512/512?random=5',
            title: 'Street Art',
            effect: 'paper' as const,
            path: "/"
        },
        {
            id: 'img6',
            url: 'https://picsum.photos/512/512?random=6',
            title: 'Minimalism',
            effect: 'combined' as const,
            path: "/"
        }
    ]

    const imagesToRender = images || defaultImages
    const presets = createGridPresets()
    const gridProps = presets[preset]

    return (
        <div className={`${className}`}>
            <Canvas
                camera={{
                    position: [0, 0, 2],
                    fov: 45,
                    near: 0.1,
                    far: 100
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                }}
                shadows

            >
                <Suspense fallback={<Loader />}>
                    <SceneSetup />
                    <HoverImageGrid
                        images={imagesToRender}
                        {...gridProps}
                    />
                </Suspense>
            </Canvas>
        </div>
    )
}