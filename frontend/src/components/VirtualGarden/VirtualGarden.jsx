import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import axiosInstance from '../../api/axiosInstance';

// Plant Quiz Component
const PlantQuiz = ({ plant, onClose, onPass }) => {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  
  const questions = React.useMemo(() => [
    {
      question: `What is the main description of ${plant.name}?`,
      options: [plant.info.description, 'A common garden plant', 'A decorative plant', 'A rare species'],
      correct: 0
    },
    {
      question: `Which of these is NOT a benefit of ${plant.name}?`,
      options: ['Improves garden aesthetics', ...plant.info.benefits.slice(0, 3)],
      correct: 0
    },
    {
      question: `What is the primary use of ${plant.name}?`,
      options: [plant.info.uses, 'Only for decoration', 'No medicinal value', 'Cannot be used by humans'],
      correct: 0
    }
  ], [plant]);

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    const score = (correct / questions.length) * 100;
    if (score >= 70) onPass();
    setShowResult(true);
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 p-8 rounded-2xl shadow-2xl z-50 max-w-md w-full">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Knowledge Check: {plant.name}</h2>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6">
          <p className="font-semibold mb-2">{q.question}</p>
          {q.options.map((option, oIndex) => (
            <label key={oIndex} className="block mb-2">
              <input type="radio" name={`q${qIndex}`} onChange={() => setAnswers(prev => ({...prev, [qIndex]: oIndex}))}/>
              {option}
            </label>
          ))}
        </div>
      ))}
      <div className="flex gap-3">
        <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white px-4 py-2 rounded">Submit</button>
        <button onClick={onClose} className="flex-1 bg-gray-200 px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
};

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

  // Calculate position for the label based on model height
  const labelPosition = [0, scale * 3, 0];

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
        <Html position={labelPosition} center>
          <div className="transform -translate-y-full">
            <div className="bg-green-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-lg text-sm font-medium whitespace-nowrap">
              {name}
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
                <div className="border-solid border-t-4 border-x-4 border-transparent border-t-green-800/90 w-2"></div>
              </div>
            </div>
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
  const [quizPopup, setQuizPopup] = useState({ show: false, plant: null });
  const [purchasedPlants, setPurchasedPlants] = useState([]);
  const { user, fetchUserData } = useAuthStore();
  const navigate = useNavigate();

  // Fetch user data and load purchased plants when component mounts
  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching user data...');
      const userData = await fetchUserData();
      console.log('User data received:', userData);
      
      if (userData && userData._id) {
        // Load purchased plants from localStorage with user-specific key
        const inventory = JSON.parse(localStorage.getItem(`inventory_${userData._id}`)) || [];
        setPurchasedPlants(inventory);
      } else {
        // If no user is logged in, clear purchased plants
        setPurchasedPlants([]);
      }
    };
    fetchData();
  }, [fetchUserData]);

  // Function to check if a plant is purchased
  const isPlantPurchased = (plantName) => {
    return purchasedPlants.includes(plantName);
  };

  // Function to handle buy button click
  const handleBuyClick = (plant, event) => {
    event.stopPropagation();
    
    if (isPlantPurchased(plant.name)) {
      alert('You already own this plant!');
      return;
    }
    
    const userCoins = user?.coins || 0;
    const plantCost = 100;
    
    if (userCoins >= plantCost) {
      setQuizPopup({ show: true, plant });
    } else {
      alert(`Not enough coins to purchase this plant! You have ${userCoins} coins, but need ${plantCost} coins.`);
    }
  };

  // Function to handle quiz pass
  const handleQuizPass = async () => {
    try {
      // Deduct coins through API
      const response = await axiosInstance.post('/users/deduct-coins', {
        amount: 100 // plantCost
      });

      if (response.data.success) {
        // Update user's coins in the store
        const updatedUser = { ...user, coins: response.data.newBalance };
        useAuthStore.getState().setUser(updatedUser);
        
        // Add to purchased plants state and localStorage with user-specific key
        const updatedInventory = [...purchasedPlants, quizPopup.plant.name];
        setPurchasedPlants(updatedInventory);
        localStorage.setItem(`inventory_${user._id}`, JSON.stringify(updatedInventory));
        
        setQuizPopup({ show: false, plant: null });
        alert(`Congratulations! You've successfully purchased ${quizPopup.plant.name}!`);
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Error processing purchase. Please try again.');
      }
    }
  };

  // Function to handle exit
  const handleExit = () => {
    navigate('/');
  };

  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #4ade80;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #22c55e;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Define plants array inside the component
  const plantsData = [
    {
      name: 'Tulsi (Holy Basil)',
      modelPath: '/3d-models/tulsi.glb',
      position: [-15, 0.1, -15],
      scale: 5,
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
      position: [0, 1, -15],
      scale: 2,
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
      position: [15, 6, -15],
      scale: 6,
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
      position: [-25, 8, 30],
      scale: 8,
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
      position: [15, 6, 0],
      scale: 6,
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
      position: [1, 0.09, 30],
      scale: 4,
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
      position: [0, 0, 15],
      scale: 20,
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
    {
      name: 'Hawthorn Tree',
      modelPath: '/3d-models/hawthorn_tree.glb',
      position: [15, 1, 40],
      scale: 2,
      info: {
        description: 'Hawthorn is a medicinal tree known for its cardiovascular benefits.',
        benefits: [
          'Supports heart health',
          'Reduces blood pressure',
          'Antioxidant properties',
          'Aids digestion'
        ],
        uses: 'Berries and flowers used in traditional medicine and heart health supplements.'
      }
    },
    {
      name: 'Red Ginger',
      modelPath: '/3d-models/red_ginger_var4.glb',
      position: [-7.5, 0, 7.5],
      scale: 1,
      info: {
        description: 'Red Ginger is a tropical plant known for its ornamental and medicinal value.',
        benefits: [
          'Anti-inflammatory properties',
          'Digestive aid',
          'Immune system support',
          'Natural pain relief'
        ],
        uses: 'Used in traditional medicine, cooking, and ornamental gardening.'
      }
    },
    {
      name: 'Willow Tree',
      modelPath: '/3d-models/willow.glb',
      position: [-30, 0, -7.5],
      scale: 2.5,
      info: {
        description: 'Willow trees are known for their pain-relieving properties and were the original source of aspirin.',
        benefits: [
          'Natural pain relief',
          'Reduces inflammation',
          'Fever reduction',
          'Anti-bacterial properties'
        ],
        uses: 'Bark used in traditional medicine and modern pharmaceuticals.'
      }
    },
    {
      name: 'Rosemary Willow',
      modelPath: '/3d-models/realistic_hd_rosemary_willow_6399.glb',
      position: [10, 0, 15],
      scale: 14,
      info: {
        description: 'Rosemary Willow combines the medicinal properties of both rosemary and willow species.',
        benefits: [
          'Memory enhancement',
          'Anti-inflammatory',
          'Aromatherapy benefits',
          'Natural pest deterrent'
        ],
        uses: 'Used in herbal medicine, aromatherapy, and landscaping.'
      }
    }
  ];

  return (
    <div className="w-full h-screen relative">
      {/* Exit Button */}
      <button
        onClick={handleExit}
        className="absolute top-4 right-4 z-50 flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span className="font-medium">Exit Garden</span>
      </button>

      {/* Controls Help */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg z-50">
        <h3 className="text-xl font-bold text-green-800 mb-3">Virtual Herbal Garden</h3>
        <div className="space-y-2">
          <p className="text-green-700 font-semibold">Navigation Controls:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Left Click + Drag: Rotate view</li>
            <li>Right Click + Drag: Pan</li>
            <li>Scroll: Zoom in/out</li>
            <li>Click on plants for information</li>
          </ul>
        </div>
      </div>

      {/* Plant List */}
      <div className="absolute top-56 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg max-w-xs z-50">
        <h3 className="text-lg font-bold text-green-800 mb-3 border-b border-green-200 pb-2">Plants in Garden</h3>
        <ul className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {plantsData.map((plant) => (
            <li 
              key={plant.name}
              className="group cursor-pointer hover:bg-green-50 rounded-lg p-2 transition-all duration-200"
              onClick={() => setSelectedPlant(plant)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 group-hover:bg-green-600"></span>
                  <span className="text-green-700 font-medium group-hover:text-green-800">
                    {plant.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  {isPlantPurchased(plant.name) ? (
                    <span className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded-md">
                      Purchased
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleBuyClick(plant, e)}
                      className="px-2 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Buy
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
          {plantsData.filter(plant => isPlantPurchased(plant.name)).map((plant) => (
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

      {/* Quiz Popup */}
      {quizPopup.show && (
        <PlantQuiz
          plant={quizPopup.plant}
          onClose={() => setQuizPopup({ show: false, plant: null })}
          onPass={handleQuizPass}
        />
      )}

      {/* Plant Information */}
      {selectedPlant && (
        <PlantInfo
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}
    </div>
  );
};

export default VirtualGarden;