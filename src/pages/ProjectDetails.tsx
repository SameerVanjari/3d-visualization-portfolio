import { Canvas, useLoader } from '@react-three/fiber';
import { Suspense, useState } from 'react'
import { Link, useParams } from 'react-router'
import { projects } from '../constants/projects';
import { textures, type Hotspot } from '../constants/textures';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import * as THREE from 'three';
import { MoveLeft } from 'lucide-react';
import { useSpring, animated } from '@react-spring/three';
import { Environment, Html, OrbitControls } from '@react-three/drei';

interface TextureSphereProps {
    currentUrl: string;
    nextUrl: string;
    triggerTransition: boolean;
    hotspots: Hotspot[] | undefined;
}
const AnimatedMaterial = animated.meshStandardMaterial as any;

function TextureSphere({ currentUrl, nextUrl, triggerTransition, hotspots }: TextureSphereProps) {
    const currentTexture = useLoader(RGBELoader, currentUrl);
    const nextTexture = useLoader(RGBELoader, nextUrl);


    const { opacity } = useSpring({
        opacity: triggerTransition ? 1 : 0,
        config: { duration: 1000 }, // 1 second crossfade
    });

    return (
        <>
            <mesh>
                <sphereGeometry args={[60, 65, 65]} />
                <AnimatedMaterial
                    map={currentTexture}
                    // transparent
                    opacity={opacity.to((o) => 1 - o) as any}
                    side={THREE.BackSide}
                />
                <AnimatedMaterial
                    map={nextTexture}
                    // transparent
                    opacity={opacity}
                    side={THREE.BackSide}
                />
                {hotspots?.map((hotspot) => (
                    <mesh key={hotspot.id} position={hotspot.position} scale={[1, 1, 1]}>
                        <Html>
                            <div className='info-point' >
                                i
                            </div>
                            <div className='info-text'>
                                <h4>{hotspot.title}</h4>
                                <hr />
                                <p>{hotspot.description}</p>
                            </div>
                        </Html>
                    </mesh>
                ))}
            </mesh>
        </>
    );
}


const ProjectDetails = () => {
    const params = useParams();
    const currentPage = params?.slug;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [triggerTransition, setTriggerTransition] = useState(false);

    const currentProject = projects?.find(
        (project) => project.path.split('/')[1] === currentPage
    );

    const currentTextureList =
        currentProject && currentProject.textures !== undefined
            ? textures[currentProject.textures as keyof typeof textures]
            : undefined;

    const textureList = currentTextureList?.map(
        (text) => '/textures' + text.texture
    );


    const handleNext = () => {
        const next = currentIndex !== textureList!.length - 1 ? currentIndex + 1 : 0;
        setNextIndex(next);
        setTriggerTransition(true);
        // After 1s, swap current and reset
        setTimeout(() => {
            setCurrentIndex(next);
            setTriggerTransition(false);
        }, 1000);
    };

    const handlePrev = () => {
        const prev = currentIndex !== 0 ? currentIndex - 1 : textureList!.length - 1;
        setNextIndex(prev);
        setTriggerTransition(true);
        setTimeout(() => {
            setCurrentIndex(prev);
            setTriggerTransition(false);
        }, 1000);
    };



    return (
        <div className="page-container">
            <div className="title">
                <Link to="/" className="back-btn">
                    <MoveLeft /> Back
                </Link>
                <h2>{currentPage?.toLocaleUpperCase()}</h2>
            </div>

            <div className="navigation-btns">
                <button
                    onClick={handlePrev}
                    type="button"
                    className="btn"
                >
                    Prev
                </button>
                <p>{currentTextureList?.[currentIndex]?.label}</p>
                <button
                    onClick={handleNext}
                    type="button"
                    className="btn"
                >
                    Next
                </button>
            </div>
            <div className='three-container'>
                <Canvas className='canvas'>
                    <Suspense fallback="loading...">
                        <OrbitControls maxDistance={60} minDistance={8} />
                        <Environment preset='sunset' />
                        {/* <mesh>
                            <sphereGeometry args={[60, 65, 65]} />
                            <meshStandardMaterial map={texts[currentText]} side={THREE.BackSide} />
                            {
                                currentTextureList?.[currentText]?.hotspots.map((hotspot) => (
                                    <mesh key={hotspot.id} position={hotspot.position} scale={[1, 1, 1]}>
                                        <Html>
                                            <div className='info-point' >
                                                i
                                            </div>
                                            <div className='info-text'>
                                                <h4>{hotspot.title}</h4>
                                                <hr />
                                                <p>{hotspot.description}</p>
                                            </div>
                                        </Html>
                                    </mesh>
                                ))
                            }
                        </mesh> */}
                        <TextureSphere
                            currentUrl={textureList![currentIndex]}
                            nextUrl={textureList![nextIndex]}
                            triggerTransition={triggerTransition}
                            hotspots={currentTextureList?.[currentIndex]?.hotspots}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
};

export default ProjectDetails