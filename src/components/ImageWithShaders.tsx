// PortfolioImage.tsx - Component to use the shaders
import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import {
    ParticleImageShaderImpl,
    PaperEffectShaderImpl,
    CombinedEffectShaderImpl,
    ParticleImageShader,
    PaperEffectShader,
    CombinedEffectShader
} from './ImageShaderMaterial'

// Effect type
type ShaderEffect = 'particles' | 'paper' | 'combined'

// Component props interface
interface PortfolioImageProps {
    imageUrl: string
    position?: [number, number, number]
    scale?: [number, number, number]
    effect?: ShaderEffect
    // Shader-specific props
    particleIntensity?: number
    paperStrength?: number
    animationSpeed?: number
    distortionStrength?: number
    particleSize?: number
}

// Shader material reference types
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
        [key: string]: any
    }
}

export const PortfolioImageWithShaders: React.FC<PortfolioImageProps> = ({
    imageUrl,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    effect = 'particles',
    particleIntensity = 0.1,
    paperStrength = 0.3,
    animationSpeed = 1.0,
    distortionStrength = 0.05,
    particleSize = 20.0,
    ...props
}) => {
    const meshRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<ShaderMaterialRef>(null)

    // Load texture with proper typing
    const texture = useLoader(TextureLoader, imageUrl)

    // Mouse position for interactive effects
    const mouse = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))

    // Update shader uniforms when props change


    // Shader material based on effect type
    const shaderProps = useMemo((): Record<string, any> => {
        const baseProps = {
            uTexture: texture,
            uTime: 0,
            uMouse: mouse.current,
            transparent: true,
        }

        switch (effect) {
            case 'particles':
                return {
                    ...baseProps,
                    uResolution: new THREE.Vector2(512, 512),
                    uIntensity: particleIntensity,
                    uParticleSize: particleSize,
                    uSpeed: animationSpeed,
                    uDistortionStrength: distortionStrength,
                }
            case 'paper':
                return {
                    ...baseProps,
                    uWaveIntensity: 0.02,
                    uPaperStrength: paperStrength,
                    uCurlAmount: 0.5,
                }
            case 'combined':
                return {
                    ...baseProps,
                    uParticleIntensity: particleIntensity,
                    uPaperIntensity: paperStrength,
                    uAnimationSpeed: animationSpeed,
                }
            default:
                return baseProps
        }
    }, [texture, effect, particleIntensity, paperStrength, animationSpeed, distortionStrength, particleSize])

    const getCurrentMaterial = () => {
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
    }

    const material = useMemo(() => getCurrentMaterial(), [effect])

    const renderShaderMaterial = () => {
        return (
            <primitive
                ref={materialRef}
                object={material}
                attach="material"
            />
        )
    }

    useEffect(() => {
        if (materialRef.current) {
            Object.keys(shaderProps).forEach(key => {
                if (materialRef.current!.uniforms[key]) {
                    materialRef.current!.uniforms[key].value = shaderProps[key]
                }
            })
        }
    }, [shaderProps])

    // Animation
    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime

            // Update mouse position for subtle interaction
            mouse.current.x = state.mouse.x * 0.1
            mouse.current.y = state.mouse.y * 0.1
            materialRef.current.uniforms.uMouse.value = mouse.current
        }
    })

    return (
        <mesh ref={meshRef} position={position} scale={scale} {...props}>
            <planeGeometry args={[1, 1, 32, 32]} />
            {renderShaderMaterial()}
        </mesh>
    )
}

// Usage example interface
interface PortfolioSceneProps {
    images?: Array<{
        url: string
        position: [number, number, number]
        scale: [number, number, number]
        effect: ShaderEffect
    }>
}

// Usage example in your portfolio
export const PortfolioScene: React.FC<PortfolioSceneProps> = ({ images }) => {
    const defaultImages = [
        {
            url: "/path/to/your/image1.jpg",
            position: [-2, 0, 0] as [number, number, number],
            scale: [2, 2, 1] as [number, number, number],
            effect: 'particles' as ShaderEffect,
        },
        {
            url: "/path/to/your/image2.jpg",
            position: [2, 0, 0] as [number, number, number],
            scale: [2, 2, 1] as [number, number, number],
            effect: 'paper' as ShaderEffect,
        },
    ]

    const imagesToRender = images || defaultImages

    return (
        <>
            {imagesToRender.map((image, index) => (
                <PortfolioImageWithShaders
                    key={index}
                    imageUrl={image.url}
                    position={image.position}
                    scale={image.scale}
                    effect={image.effect}
                />
            ))}
        </>
    )
}

// Utility function for creating shader presets
export const createShaderPreset = (
    type: ShaderEffect,
    customProps?: Partial<PortfolioImageProps>
): Partial<PortfolioImageProps> => {
    const presets: Record<ShaderEffect, Partial<PortfolioImageProps>> = {
        particles: {
            effect: 'particles',
            particleIntensity: 0.1,
            distortionStrength: 0.05,
            particleSize: 20.0,
            animationSpeed: 1.0,
        },
        paper: {
            effect: 'paper',
            paperStrength: 0.3,
            animationSpeed: 0.8,
        },
        combined: {
            effect: 'combined',
            particleIntensity: 0.05,
            paperStrength: 0.2,
            animationSpeed: 1.2,
        },
    }

    return { ...presets[type], ...customProps }
}