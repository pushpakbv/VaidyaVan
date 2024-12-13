import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Plant Component using 3D models
const Plant = ({ position, modelPath, name, info, setSelectedPlant, scale = 1 }) => {
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF(modelPath);

  // Clone the scene to avoid sharing materials
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setSelectedPlant({ name, info })}
    >
      <primitive object={clonedScene} />
      {hovered && (
        <Html position={[0, 3, 0]}>
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg transform -translate-x-1/2">
            <p className="text-lg font-bold text-green-800">{name}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

// Information Modal Component
const PlantInfo = ({ plant, onClose }) => {
  if (!plant) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl z-50 max-w-md">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-t-2xl" />
      <h2 className="text-3xl font-bold text-green-800 mb-4">{plant.name}</h2>
      <div className="text-gray-700 space-y-4">
        <p className="text-lg leading-relaxed">{plant.info.description}</p>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-green-700">Benefits:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {plant.info.benefits.map((benefit, index) => (
              <li key={index} className="text-gray-600">{benefit}</li>
            ))}
          </ul>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="font-semibold text-green-800">Traditional Uses:</p>
          <p className="text-gray-600 mt-1">{plant.info.uses}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 font-semibold"
      >
        Close
      </button>
    </div>
  );
};

const VirtualGarden = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Define plants array inside the component
  const plantsData = [
    {
      name: 'Tulsi (Holy Basil)',
      modelPath: '/3d-models/tulsi.glb',
      position: [-5, 0.1, -5],
      scale: 2.5,
      info: {
        description: 'Tulsi is a sacred plant in Ayurvedic medicine, known for its powerful healing properties.',
        benefits: [
          'Boosts immunity',
          'Reduces stress and anxiety',
          'Improves respiratory health',
          'Has anti-inflammatory properties'
        ],
        uses: 'Can be consumed as tea, used in traditional medicine, or as a dietary supplement.'
      }
    },
    {
      name: 'Aloe Vera',
      modelPath: '/3d-models/aloe_vera_plant.glb',
      position: [0, 0.62, -5],
      scale: 1,
      info: {
        description: 'Aloe Vera is a succulent plant species known for its medicinal properties.',
        benefits: [
          'Heals burns and wounds',
          'Improves skin health',
          'Aids digestion',
          'Reduces dental plaque'
        ],
        uses: 'Applied topically for skin conditions or consumed as juice for internal benefits.'
      }
    },
    {
      name: 'Neem',
      modelPath: '/3d-models/neem_plant.glb',
      position: [5, 2, -5],
      scale: 2,
      info: {
        description: 'Neem is known as a natural medicine cabinet, used in traditional medicine for thousands of years.',
        benefits: [
          'Natural antibacterial',
          'Improves skin health',
          'Boosts immune system',
          'Natural pesticide'
        ],
        uses: 'Used in traditional medicine, dental care, and agriculture.'
      }
    },
    {
      name: 'Turmeric',
      modelPath: '/3d-models/Turmeric.glb',
      position: [-5, 2, 0],
      scale: 2,
      info: {
        description: 'Turmeric is a powerful medicinal herb and spice with numerous health benefits.',
        benefits: [
          'Powerful anti-inflammatory',
          'Strong antioxidant',
          'Improves brain function',
          'Helps with arthritis'
        ],
        uses: 'Used in cooking, traditional medicine, and as a dietary supplement.'
      }
    },
    {
      name: 'Ashwagandha',
      modelPath: '/3d-models/aswagandha.glb',
      position: [5, 2, 0],
      scale: 2,
      info: {
        description: 'Ashwagandha is an ancient medicinal herb used in Ayurvedic medicine.',
        benefits: [
          'Reduces stress and anxiety',
          'Improves strength and muscle mass',
          'Boosts fertility in men',
          'Enhances brain function'
        ],
        uses: 'Consumed as a powder, capsule, or in traditional preparations.'
      }
    },
    {
      name: 'Banana Plant',
      modelPath: '/3d-models/banana_plant.glb',
      position: [-5, 0.09, 5],
      scale: 2,
      info: {
        description: 'Banana plants are known for their nutritious fruits and medicinal properties.',
        benefits: [
          'Rich in nutrients',
          'Supports digestive health',
          'Provides natural energy',
          'Contains antioxidants'
        ],
        uses: 'Fruit consumed fresh, leaves used in traditional medicine and cooking.'
      }
    },
    {
      name: 'Basil',
      modelPath: '/3d-models/stylized_basil_pot_plant.glb',
      position: [5, 0, 5],
      scale: 7,
      info: {
        description: 'Basil is an aromatic herb with significant medicinal properties.',
        benefits: [
          'Anti-inflammatory properties',
          'Rich in antioxidants',
          'Supports cardiovascular health',
          'Enhances immune system'
        ],
        uses: 'Used in cooking, aromatherapy, and traditional medicine.'
      }
    },
    
  ];

  return (
    <div className="w-full h-screen relative">
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 60 }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#f0f8ff']} />
          
          {/* Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <hemisphereLight intensity={0.5} groundColor="#2d5a27" />

          {/* Plants */}
          {plantsData.map((plant) => (
            <Plant
              key={plant.name}
              {...plant}
              setSelectedPlant={setSelectedPlant}
            />
          ))}

          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial 
              color="#2d5a27"
              roughness={1}
              metalness={0}
            />
          </mesh>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {/* Plant Information */}
      {selectedPlant && (
        <PlantInfo
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}

      {/* Controls Help */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
        <h3 className="text-xl font-bold text-green-800 mb-3">Virtual Herbal Garden</h3>
        <div className="space-y-2">
          <p className="text-green-700 font-semibold">Navigation Controls:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>🖱 Left Click + Drag: Rotate view</li>
            <li>🖱 Right Click + Drag: Pan</li>
            <li>🖱 Scroll: Zoom in/out</li>
            <li>🖱 Click on plants for information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VirtualGarden;