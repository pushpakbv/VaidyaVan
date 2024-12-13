import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const loadModel = (path) => {
  return useLoader(GLTFLoader, path);
};

// Plant information database
export const plantInfo = {
  tulsi: {
    name: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum sanctum',
    benefits: [
      'Boosts immunity',
      'Reduces stress and anxiety',
      'Anti-inflammatory properties',
      'Helps with respiratory issues'
    ],
    uses: 'Can be consumed as tea, used in traditional medicine, or as a dietary supplement.',
    description: 'Tulsi is considered a sacred plant in Ayurveda and is known for its numerous medicinal properties.'
  },
  aloeVera: {
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    benefits: [
      'Heals burns and cuts',
      'Improves skin health',
      'Aids digestion',
      'Anti-inflammatory'
    ],
    uses: 'Applied topically for skin conditions or consumed as juice for internal benefits.',
    description: 'Aloe Vera is a succulent plant known for its healing properties and versatile uses in medicine and cosmetics.'
  },
  neem: {
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    benefits: [
      'Antibacterial properties',
      'Natural pesticide',
      'Improves oral health',
      'Purifies blood'
    ],
    uses: 'Used in traditional medicine, dental care, and agriculture.',
    description: 'Neem is known as a natural medicine cabinet and has been used in traditional medicine for thousands of years.'
  },
  turmeric: {
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    benefits: [
      'Powerful anti-inflammatory',
      'Antioxidant properties',
      'Improves brain function',
      'Aids in joint health'
    ],
    uses: 'Used in cooking, traditional medicine, and as a dietary supplement.',
    description: 'Turmeric is a golden spice known for its medicinal properties and is widely used in Ayurvedic medicine.'
  },
  ashwagandha: {
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    benefits: [
      'Reduces stress and anxiety',
      'Boosts energy levels',
      'Improves concentration',
      'Strengthens immune system'
    ],
    uses: 'Consumed as a powder, capsule, or in traditional preparations.',
    description: 'Ashwagandha is an ancient medicinal herb known for its adaptogenic properties.'
  }
};
