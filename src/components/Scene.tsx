'use client'
// https://threejsresources.com/frameworks/three-js-nextjs
// https://r3f.docs.pmnd.rs/getting-started/introduction

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

interface IBoxProps {
    position: number;
    scale: number;
}

function Box({ position, scale }: IBoxProps) {
    const mesh = useRef<any>(null)

    useFrame((_, delta) => {
        if (!mesh.current) return

        const distance = position - mesh.current.position.x

        mesh.current.position.x += distance * delta * 5
    })
    return (
        <group>
            <mesh
                ref={mesh}
                position={[0, scale / 2, 0]}
                scale={[1, scale, 1]}
            >
                <boxGeometry />
                <meshStandardMaterial />
            </mesh>
        </group>
    )
}

export default function Scene() {
    const [boxPos, setBoxPos] = useState(4.4)

    const move = () => {
        setBoxPos((boxPos + 1.1) % 5.5)
    }

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10, display: "flex", gap: "10px" }}>
                <button onClick={move} style={{ padding: "10px", cursor: "pointer" }}>Move</button>
            </div>

            <Canvas
                fallback={<div>Hehe, ur browser is trash</div>}
                camera={{ fov: 50, near: 2, far: 1000, position: [0, 5, 15] }}
                shadows={true}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <group position={[-2.2, -2, 0]}>
                    <Box position={0} scale={1} />
                    <Box position={1.1} scale={2} />
                    <Box position={2.2} scale={3} />
                    <Box position={3.3} scale={4} />
                    <Box position={boxPos} scale={5} />
                </group>
            </Canvas>
        </div>
    )
}
