import { Environment, Html, OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import React, { Suspense, useState } from 'react'
import { Link, useParams } from 'react-router'
import { projects } from '../constants/projects';
import { textures } from '../constants/textures';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import * as THREE from 'three';
import { MoveLeft } from 'lucide-react';

const ProjectDetails = () => {
    const params = useParams();
    const currentPage = params?.slug;
    const currentProject = projects?.find(project => project.path.split('/')[1] == currentPage);
    const currentTextureList = currentProject && currentProject.textures !== undefined
        ? textures[currentProject.textures as keyof typeof textures]
        : undefined;
    const textureList = currentTextureList?.map((text: { texture: string }) => '/textures' + text.texture);
    const texts = useLoader(RGBELoader, textureList as string[])

    const [currentText, setCurrentText] = useState(0);

    return (
        <div className='page-container'>
            <div className='title'>
                <Link to={'/'} className='back-btn'><MoveLeft /> Back </Link>
                <h2>{currentPage?.toLocaleUpperCase()}</h2>
            </div>

            <div className="navigation-btns">
                <button onClick={() => currentText !== 0 ? setCurrentText(prev => prev - 1) : setCurrentText(texts.length - 1)} type='button' className='btn'>Prev</button>
                <p>{currentTextureList && currentTextureList[currentText]?.label}</p>
                <button onClick={() => currentText !== texts.length - 1 ? setCurrentText(prev => prev + 1) : setCurrentText(0)} type='button' className='btn'>Next</button>
            </div>
            <div className='three-container'>
                <Canvas className='canvas'>
                    <Suspense fallback="loading...">
                        <OrbitControls maxDistance={60} minDistance={8} />
                        <Environment preset='sunset' />
                        <mesh>
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
                        </mesh>
                    </Suspense>
                </Canvas>
            </div>

        </div >
    )
}

export default ProjectDetails