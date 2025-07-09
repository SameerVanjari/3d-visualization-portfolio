// HoverImageGrid.tsx
import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import {
    ParticleImageShader,
    PaperEffectShader,
    CombinedEffectShader
} from './ImageShaderMaterial'
import { Html } from '@react-three/drei'
import { useNavigate } from 'react-router'
import type { Project } from '../constants/projects'

// Types
type ShaderEffect = 'particles' | 'paper' | 'combined'

interface ImageGridItem extends Project {
    id: string
    url: string
    title: string
    effect?: ShaderEffect
}

interface HoverImageProps {
    imageData: ImageGridItem
    position: [number, number, number]
    scale: [number, number, number]
    onHover?: (hovered: boolean) => void
}

interface ImageGridProps {
    images: ImageGridItem[]
    columns?: number
    spacing?: number
    imageSize?: [number, number]
    hoverIntensity?: number
    animationSpeed?: number
}

// Shader material reference type
interface ShaderMaterialRef extends THREE.ShaderMaterial {
    uniforms: {
        uTime: { value: number }
        uMouse: { value: THREE.Vector2 }
        uTexture: { value: THREE.Texture }
        uIntensity?: { value: number }
        uParticleSize?: { value: number }
        uSpeed?: { value: number }
        uDistortionStrength?: { value: number }
        uWaveIntensity?: { value: number }
        uPaperStrength?: { value: number }
        uCurlAmount?: { value: number }
        uParticleIntensity?: { value: number }
        uAnimationSpeed?: { value: number }
        uHoverTransition?: { value: number }
        [key: string]: any
    }
}

// Individual hoverable image component
const HoverImage: React.FC<HoverImageProps> = ({
    imageData,
    position,
    scale,
    onHover
}) => {
    const meshRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<ShaderMaterialRef>(null)
    const [isHovered, setIsHovered] = useState(false)
    const [hoverProgress, setHoverProgress] = useState(0)
    const navigate = useNavigate()

    // Load texture
    const texture = useLoader(TextureLoader, imageData.url)

    // Mouse position for interactive effects
    const mouse = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))
    const { gl } = useThree()

    // Create shader material based on effect type
    const material = useMemo(() => {
        const effect = imageData.effect || 'particles'
        switch (effect) {
            case 'particles':
                return new ParticleImageShader()
            case 'paper':
                return new PaperEffectShader()
            case 'combined':
                return new CombinedEffectShader()
            default:
                return new ParticleImageShader()
        }
    }, [imageData.effect])

    // Initialize shader uniforms
    useEffect(() => {
        if (materialRef.current && texture) {
            const uniforms = materialRef.current.uniforms

            // Common uniforms
            uniforms.uTexture.value = texture
            uniforms.uTime.value = 0
            uniforms.uMouse.value = mouse.current

            // Effect-specific uniforms
            const effect = imageData.effect || 'particles'
            switch (effect) {
                case 'particles':
                    uniforms.uResolution.value = new THREE.Vector2(512, 512);
                    if (uniforms.uIntensity) uniforms.uIntensity.value = 0
                    if (uniforms.uParticleSize) uniforms.uParticleSize.value = 20.0
                    if (uniforms.uSpeed) uniforms.uSpeed.value = 1.0
                    if (uniforms.uDistortionStrength) uniforms.uDistortionStrength.value = 0
                    break
                case 'paper':
                    if (uniforms.uWaveIntensity) uniforms.uWaveIntensity.value = 0
                    if (uniforms.uPaperStrength) uniforms.uPaperStrength.value = 0
                    if (uniforms.uCurlAmount) uniforms.uCurlAmount.value = 0.5
                    break
                case 'combined':
                    if (uniforms.uParticleIntensity) uniforms.uParticleIntensity.value = 0
                    if (uniforms.uPaperIntensity) uniforms.uPaperIntensity.value = 0
                    if (uniforms.uAnimationSpeed) uniforms.uAnimationSpeed.value = 1.0
                    break
            }
        }
    }, [texture, imageData.effect])

    // Handle hover state changes
    useEffect(() => {
        onHover?.(isHovered)
    }, [isHovered, onHover])

    // Animate hover transition
    useFrame((state, delta) => {
        if (materialRef.current) {
            // Update time
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime

            // Smooth hover transition
            const targetProgress = isHovered ? 1 : 0
            const speed = 3.0 // Transition speed
            setHoverProgress(prev => {
                const newProgress = THREE.MathUtils.lerp(prev, targetProgress, delta * speed)
                return Math.abs(newProgress - targetProgress) < 0.01 ? targetProgress : newProgress
            })

            // Apply hover effects based on shader type
            const effect = imageData.effect || 'particles'
            const uniforms = materialRef.current.uniforms

            switch (effect) {
                case 'particles':
                    uniforms.uIntensity && (uniforms.uIntensity.value = hoverProgress * 0.15)
                    uniforms.uDistortionStrength && (uniforms.uDistortionStrength.value = hoverProgress * 0.08)
                    break
                case 'paper':
                    uniforms.uWaveIntensity && (uniforms.uWaveIntensity.value = hoverProgress * 0.03)
                    uniforms.uPaperStrength && (uniforms.uPaperStrength.value = hoverProgress * 0.4)
                    break
                case 'combined':
                    uniforms.uParticleIntensity && (uniforms.uParticleIntensity.value = hoverProgress * 0.08)
                    uniforms.uPaperIntensity && (uniforms.uPaperIntensity.value = hoverProgress * 0.25)
                    break
            }

            // Update mouse position for interactive effects
            if (isHovered) {
                mouse.current.x = state.mouse.x * 0.1
                mouse.current.y = state.mouse.y * 0.1
                uniforms.uMouse.value = mouse.current
            }
        }
    })

    // Raycaster for hover detection
    const handlePointerOver = (event: React.PointerEvent) => {
        event.stopPropagation()
        setIsHovered(true)
        gl.domElement.style.cursor = 'pointer'
    }

    const handlePointerOut = (event: React.PointerEvent) => {
        event.stopPropagation()
        setIsHovered(false)
        gl.domElement.style.cursor = 'default'
    }

    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={scale}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={() => navigate(`/projects${imageData.path}`)}
        >
            <planeGeometry args={[1, 1, 32, 32]} />
            <Html position={[-0.4, -0.2, 0]}>
                <h2 style={{ whiteSpace: "nowrap" }}>{imageData.title}</h2>
            </Html>
            <primitive
                ref={materialRef}
                object={material}
                attach="material"
                transparent={true}
            />
        </mesh>
    )
}

// Main grid component
export const HoverImageGrid: React.FC<ImageGridProps> = ({
    images,
    columns = 3,
    spacing = 2.5,
    imageSize = [2, 2],
    // @ts-ignore
    hoverIntensity = 1.0,
    // @ts-ignore
    animationSpeed = 1.0
}) => {
    // @ts-ignore
    const [hoveredImage, setHoveredImage] = useState<string | null>(null)
    const [isMobile, setIsMobile] = useState(false)

    // Detect mobile device based on window width
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Calculate grid positions
    const gridPositions = useMemo(() => {
        const positions: Array<[number, number, number]> = []
        if (isMobile) {
            // Vertical grid: one column, stack vertically
            const spacingY = spacing
            const totalHeight = (images.length - 1) * spacingY
            const startY = totalHeight / 2
            images.forEach((_, index) => {
                const x = 0
                const y = startY - index * spacingY
                const z = 0
                positions.push([x, y, z])
            })
        } else {
            // Regular grid
            const rows = Math.ceil(images.length / columns)
            const totalWidth = (columns - 1) * spacing
            const totalHeight = (rows - 1) * spacing
            const startX = -totalWidth / 2
            const startY = totalHeight / 2

            images.forEach((_, index) => {
                const col = index % columns
                const row = Math.floor(index / columns)
                const x = startX + col * spacing
                const y = startY - row * spacing
                const z = 0
                positions.push([x, y, z])
            })
        }
        return positions
    }, [images.length, columns, spacing, isMobile])

    const handleImageHover = (imageId: string) => (hovered: boolean) => {
        setHoveredImage(hovered ? imageId : null)
    }

    return (
        <group>
            {images.map((imageData, index) => (
                <HoverImage
                    key={imageData.id}
                    imageData={imageData}
                    position={gridPositions[index]}
                    scale={[imageSize[0], imageSize[1], 1]}
                    onHover={handleImageHover(imageData.id)}
                />
            ))}
        </group>
    )
}

// Preset configurations for different effects
export const createGridPresets = () => {
    return {
        portfolio: {
            columns: 3,
            spacing: 2.5,
            imageSize: [2, 2] as [number, number],
            hoverIntensity: 1.0,
            animationSpeed: 1.0
        },
        gallery: {
            columns: 4,
            spacing: 2.0,
            imageSize: [1.5, 1.5] as [number, number],
            hoverIntensity: 0.8,
            animationSpeed: 1.2
        },
        showcase: {
            columns: 2,
            spacing: 3.0,
            imageSize: [2.5, 2.5] as [number, number],
            hoverIntensity: 1.2,
            animationSpeed: 0.8
        }
    }
}

// Example usage component
// export const PortfolioGrid: React.FC = () => {
//     // Sample image data - replace with your actual images
//     const sampleImages: ImageGridItem[] = [
//         {
//             id: 'img1',
//             url: '/path/to/image1.jpg',
//             title: 'Project 1',
//             effect: 'particles'
//         },
//         {
//             id: 'img2',
//             url: '/path/to/image2.jpg',
//             title: 'Project 2',
//             effect: 'paper'
//         },
//         {
//             id: 'img3',
//             url: '/path/to/image3.jpg',
//             title: 'Project 3',
//             effect: 'combined'
//         },
//         {
//             id: 'img4',
//             url: '/path/to/image4.jpg',
//             title: 'Project 4',
//             effect: 'particles'
//         },
//         {
//             id: 'img5',
//             url: '/path/to/image5.jpg',
//             title: 'Project 5',
//             effect: 'paper'
//         },
//         {
//             id: 'img6',
//             url: '/path/to/image6.jpg',
//             title: 'Project 6',
//             effect: 'combined'
//         }
//     ]

//     const presets = createGridPresets()

//     return (
//         <HoverImageGrid
//             images={sampleImages}
//             {...presets.portfolio}
//         />
//     )
// }