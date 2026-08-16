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


export default function Scene() {
    const [numbers, setNumbers] = useState([2, 6, 3, 4, 5, 1, 7])

    const sort = () => {
        setNumbers([1, 2, 3, 4, 5, 6]);
    }

    const shuffle = () => {
        setNumbers(numbers.map(() => Math.floor((Math.random() * 7 + 1) * 100) / 100));

        // console.log(Math.floor((Math.random() * 8 + 1) * 100) / 100)
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

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10, display: "flex", gap: "10px" }}>
                <button onClick={sort} style={{ padding: "10px", cursor: "pointer" }}>Sort</button>
                <button onClick={shuffle} style={{ padding: "10px", cursor: "pointer" }}>Shuffle</button>
            </div>

            <Canvas
                fallback={<div>Hehe, ur browser is trash</div>}
                camera={{ fov: 50, near: 2, far: 1000, position: [0, 5, 15] }}
                shadows={true}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <group position={[-(numbers.length / 2 - 0.27), -(numbers.length / 2), 0]}>
                    {numbers.map((value, index) => {
                        return (
                            <Box key={index} position={(index * 1.1)} scale={value} />
                        )
                    })}
                </group>
            </Canvas>
        </div>
    )
}
