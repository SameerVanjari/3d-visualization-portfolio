// ImageShaderMaterial.ts
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Type definitions for shader uniforms
interface ParticleShaderUniforms {
  uTexture: THREE.Texture | null
  uTime: number
  uMouse: THREE.Vector2
  uResolution: THREE.Vector2
  uIntensity: number
  uParticleSize: number
  uSpeed: number
  uDistortionStrength: number
}

interface PaperShaderUniforms {
  uTexture: THREE.Texture | null
  uTime: number
  uMouse: THREE.Vector2
  uWaveIntensity: number
  uPaperStrength: number
  uCurlAmount: number
}

interface CombinedShaderUniforms {
  uTexture: THREE.Texture | null
  uTime: number
  uMouse: THREE.Vector2
  uParticleIntensity: number
  uPaperIntensity: number
  uAnimationSpeed: number
}

// Particle Distortion Shader
const ParticleImageShader = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(1, 1),
    uIntensity: 0.1,
    uParticleSize: 20.0,
    uSpeed: 1.0,
    uDistortionStrength: 0.05,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uIntensity;
    
    // Noise function
    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      // Paper-like subtle movement
      vec3 pos = position;
      float wave1 = sin(pos.x * 4.0 + uTime * 0.5) * 0.01;
      float wave2 = cos(pos.y * 3.0 + uTime * 0.3) * 0.01;
      float wave3 = sin(pos.x * 2.0 + pos.y * 2.0 + uTime * 0.4) * 0.005;
      
      pos.z += (wave1 + wave2 + wave3) * uIntensity;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uParticleSize;
    uniform float uSpeed;
    uniform float uDistortionStrength;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Hash function for random values
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    // Noise function
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }
    
    // Particle distortion
    vec2 particleDistortion(vec2 uv) {
      vec2 distortion = vec2(0.0);
      
      // Create moving particles
      for(int i = 0; i < 8; i++) {
        float fi = float(i);
        vec2 particlePos = vec2(
          fract(fi * 0.618 + uTime * uSpeed * 0.1),
          fract(fi * 0.382 + uTime * uSpeed * 0.15)
        );
        
        float dist = distance(uv, particlePos);
        float influence = smoothstep(uParticleSize * 0.01, 0.0, dist);
        
        vec2 direction = normalize(uv - particlePos);
        distortion += direction * influence * uDistortionStrength;
      }
      
      return distortion;
    }
    
    // Paper texture overlay
    float paperTexture(vec2 uv) {
      float paper = 0.0;
      paper += noise(uv * 100.0) * 0.1;
      paper += noise(uv * 50.0) * 0.2;
      paper += noise(uv * 25.0) * 0.3;
      paper += noise(uv * 12.5) * 0.4;
      return paper * 0.1;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Apply particle distortion
      vec2 distortedUv = uv + particleDistortion(uv);
      
      // Add subtle paper movement
      float paperWave = sin(uv.x * 20.0 + uTime) * cos(uv.y * 15.0 + uTime * 0.7) * 0.002;
      distortedUv += paperWave;
      
      // Sample the texture
      vec4 color = texture2D(uTexture, distortedUv);
      
      // Add paper texture overlay
      float paperOverlay = paperTexture(uv);
      color.rgb = mix(color.rgb, color.rgb * (1.0 + paperOverlay), 0.3);
      
      // Add subtle color variations for paper effect
      color.rgb *= 0.95 + paperOverlay * 0.1;
      
      gl_FragColor = color;
    }
  `
)

// Enhanced Paper Effect Shader
const PaperEffectShader = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uWaveIntensity: 0.02,
    uPaperStrength: 0.3,
    uCurlAmount: 0.5,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uWaveIntensity;
    uniform float uCurlAmount;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Create paper-like curling and waving
      float waveX = sin(pos.y * 3.0 + uTime * 0.5) * uWaveIntensity;
      float waveY = cos(pos.x * 4.0 + uTime * 0.3) * uWaveIntensity;
      float curl = sin(pos.x * 2.0 + pos.y * 2.0 + uTime * 0.2) * uCurlAmount * 0.01;
      
      pos.z += waveX + waveY + curl;
      
      // Slight rotation for paper flutter
      float angle = sin(uTime * 0.5) * 0.02;
      pos.x += sin(angle) * pos.y * 0.01;
      pos.y += cos(angle) * pos.x * 0.01;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uPaperStrength;
    
    varying vec2 vUv;
    
    // Paper grain noise
    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      return rand(p) * 2.0 - 1.0;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Sample texture
      vec4 color = texture2D(uTexture, uv);
      
      // Paper grain
      float grain = noise(uv * 200.0 + uTime * 0.1) * 0.05;
      float fiberNoise = noise(uv * 80.0) * 0.1;
      float paperTexture = noise(uv * 300.0) * 0.03;
      
      // Combine paper effects
      float paperEffect = (grain + fiberNoise + paperTexture) * uPaperStrength;
      
      // Apply paper coloring (slightly warm/sepia tone)
      color.rgb = mix(color.rgb, color.rgb * vec3(1.02, 1.01, 0.98), 0.2);
      
      // Add paper texture
      color.rgb += paperEffect;
      
      // Slight vignette for paper effect
      float vignette = smoothstep(0.8, 0.3, distance(uv, vec2(0.5)));
      color.rgb *= 0.9 + vignette * 0.1;
      
      gl_FragColor = color;
    }
  `
)

// Advanced combined shader (particles + paper)
const CombinedEffectShader = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uParticleIntensity: 0.05,
    uPaperIntensity: 0.3,
    uAnimationSpeed: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uAnimationSpeed;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Paper movement
      float wave1 = sin(pos.x * 3.0 + uTime * uAnimationSpeed * 0.5) * 0.01;
      float wave2 = cos(pos.y * 4.0 + uTime * uAnimationSpeed * 0.3) * 0.01;
      pos.z += wave1 + wave2;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uParticleIntensity;
    uniform float uPaperIntensity;
    uniform float uAnimationSpeed;
    
    varying vec2 vUv;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Particle distortion
      vec2 distortion = vec2(0.0);
      for(int i = 0; i < 6; i++) {
        float fi = float(i);
        vec2 particlePos = vec2(
          fract(fi * 0.618 + uTime * uAnimationSpeed * 0.1),
          fract(fi * 0.382 + uTime * uAnimationSpeed * 0.15)
        );
        
        float dist = distance(uv, particlePos);
        float influence = smoothstep(0.2, 0.0, dist);
        distortion += normalize(uv - particlePos) * influence * uParticleIntensity;
      }
      
      vec2 finalUv = uv + distortion;
      vec4 color = texture2D(uTexture, finalUv);
      
      // Paper texture
      float paper = noise(uv * 150.0) * 0.1 + noise(uv * 75.0) * 0.05;
      color.rgb = mix(color.rgb, color.rgb * (1.0 + paper), uPaperIntensity);
      
      gl_FragColor = color;
    }
  `
)

// shaderMaterial returns a constructor, so we use 'new' to create instances
const ParticleImageShaderImpl = new ParticleImageShader()
const PaperEffectShaderImpl = new PaperEffectShader()
const CombinedEffectShaderImpl = new CombinedEffectShader()

export {
  ParticleImageShader,
  PaperEffectShader,
  CombinedEffectShader,
  ParticleImageShaderImpl,
  PaperEffectShaderImpl,
  CombinedEffectShaderImpl
}
export type { ParticleShaderUniforms, PaperShaderUniforms, CombinedShaderUniforms }


