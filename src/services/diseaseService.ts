export interface DiseaseResult {
  crop: string;
  disease: string;
  confidence: number;
  severity: 'Healthy' | 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Unable to Identify';
  symptoms: string[];
  causes: string[];
  recommendations: string[];
  prevention: string[];
}

export interface DiseaseScanRecord {
  id: string;
  date: string;
  result: DiseaseResult;
}

// Simulated data for Demo Mode
const DEMO_RESULTS: DiseaseResult[] = [
  {
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: 92,
    severity: 'Moderate Risk',
    symptoms: [
      'Brown to black spots with concentric rings on older leaves.',
      'Yellowing of leaves around the spots.',
      'Defoliation starting from the bottom of the plant.'
    ],
    causes: [
      'Fungus (Alternaria solani).',
      'Warm temperatures combined with high humidity.',
      'Prolonged leaf wetness.'
    ],
    recommendations: [
      'Remove and destroy infected leaves.',
      'Apply a copper-based fungicide or chlorothalonil.',
      'Avoid overhead watering to keep leaves dry.'
    ],
    prevention: [
      'Practice crop rotation (avoid planting nightshades in the same spot).',
      'Ensure proper spacing for good air circulation.',
      'Apply organic mulch to prevent soil-borne spores from splashing onto leaves.'
    ]
  },
  {
    crop: 'Potato',
    disease: 'Late Blight',
    confidence: 88,
    severity: 'High Risk',
    symptoms: [
      'Water-soaked, irregular pale green lesions on leaves.',
      'White fungal growth on the underside of leaves in humid conditions.',
      'Dark brown to purplish lesions on stems.'
    ],
    causes: [
      'Oomycete pathogen (Phytophthora infestans).',
      'Cool, moist weather conditions.'
    ],
    recommendations: [
      'Immediately destroy heavily infected plants.',
      'Apply protective fungicides containing mancozeb or chlorothalonil.',
      'Do not compost infected plant debris.'
    ],
    prevention: [
      'Plant certified disease-free seed potatoes.',
      'Hill up soil around the base of plants to protect tubers.',
      'Avoid overhead irrigation late in the day.'
    ]
  },
  {
    crop: 'Rice',
    disease: 'Rice Blast',
    confidence: 95,
    severity: 'High Risk',
    symptoms: [
      'Diamond-shaped lesions with grey centers and brown borders on leaves.',
      'Lesions on nodes causing the stem to break (neck blast).'
    ],
    causes: [
      'Fungus (Magnaporthe oryzae).',
      'High nitrogen fertilization.',
      'Extended periods of dew or light rain.'
    ],
    recommendations: [
      'Apply systemic fungicides like tricyclazole or isoprothiolane.',
      'Maintain appropriate water levels in the field.'
    ],
    prevention: [
      'Plant resistant varieties.',
      'Avoid excessive application of nitrogen fertilizers.',
      'Destroy crop residue after harvest.'
    ]
  },
  {
    crop: 'Cotton',
    disease: 'Healthy',
    confidence: 98,
    severity: 'Healthy',
    symptoms: ['None. Leaves appear green and vibrant without spotting.'],
    causes: ['Optimal growing conditions and good crop management.'],
    recommendations: ['Continue regular monitoring and maintenance.'],
    prevention: ['Maintain current irrigation and fertilization schedule.']
  }
];

export const analyzePlantImage = async (imageFile: File | string | null): Promise<DiseaseResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  if (!imageFile) {
    throw new Error('No image provided.');
  }

  // Simulate image quality check (random failure)
  const isPoorQuality = Math.random() < 0.05;
  if (isPoorQuality) {
    throw new Error('Image quality is too low for reliable analysis. Please upload a clearer image showing the leaf.');
  }

  // Return a random demo result
  const randomIndex = Math.floor(Math.random() * DEMO_RESULTS.length);
  return DEMO_RESULTS[randomIndex];
};
