export interface DiseaseResult {
  is_leaf: boolean;
  crop: string;
  health_status: 'Healthy' | 'Unhealthy' | 'Uncertain';
  health_score: number;
  disease?: string; // keeping disease for backward compatibility in history, but we'll use 'problem' from API
  problem?: string;
  confidence: number;
  severity: 'None' | 'Low' | 'Moderate' | 'High' | 'Severe' | 'Healthy';
  affected_area: string;
  symptoms: string[];
  causes: string[];
  recommendations: string[];
  prevention: string[];
  is_demo?: boolean;
}

export interface DiseaseScanRecord {
  id: string;
  date: string;
  result: DiseaseResult;
}

// Simulated data for Demo Mode
const DEMO_RESULTS: DiseaseResult[] = [
  {
    is_leaf: true,
    is_demo: true,
    crop: 'Tomato',
    health_status: 'Unhealthy',
    health_score: 55,
    disease: 'Leaf Spot Disease',
    problem: 'Leaf Spot Disease',
    confidence: 92,
    severity: 'Moderate',
    affected_area: '35%',
    symptoms: [
      'Multiple dark circular lesions',
      'Yellowing around affected areas',
      'Brown/necrotic tissue',
      'Progressive leaf damage'
    ],
    causes: [
      'Fungal infection (e.g., Septoria)',
      'High humidity and prolonged leaf wetness',
      'Poor air circulation'
    ],
    recommendations: [
      'Remove severely infected leaves.',
      'Avoid overhead watering.',
      'Improve air circulation.',
      'Use an appropriate fungicide according to the crop and local agricultural guidance.'
    ],
    prevention: [
      'Maintain proper spacing.',
      'Avoid prolonged leaf wetness.',
      'Monitor new leaves regularly.'
    ]
  },
  {
    is_leaf: true,
    is_demo: true,
    crop: 'Potato',
    health_status: 'Unhealthy',
    health_score: 30,
    disease: 'Late Blight',
    problem: 'Late Blight',
    confidence: 94,
    severity: 'High',
    affected_area: '50%',
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
  }
];

export const analyzePlantImage = async (imageFile: File | string | null): Promise<DiseaseResult> => {
  // 1. Validation
  if (!imageFile) {
    throw new Error('No image provided. Please select an image.');
  }

  // Convert File to base64 if it's a File object
  let base64Image = imageFile;
  if (imageFile instanceof File) {
    base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  }

  try {
    const response = await fetch('/api/analyze-leaf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });

    if (response.status !== 503 && response.ok) {
       const result = await response.json();
       // Map to interface just to be safe
       return {
         ...result,
         is_demo: false,
         disease: result.problem // Map problem to disease for legacy compat
       };
    }
    
    // If it fails or returns 503, log warning and fallback to demo
    console.warn('AI API unavailable or failed. Falling back to Demo Mode.');
  } catch (err) {
    console.warn('Error calling AI API. Falling back to Demo Mode.', err);
  }

  // 4. Mock Analysis Layer (Fallback)
  const delay = Math.floor(Math.random() * 2000) + 2000;
  await new Promise(resolve => setTimeout(resolve, delay));

  const isLeafSpot = Math.random() < 0.6; 
  if (isLeafSpot) {
    return DEMO_RESULTS[0];
  } else {
    return DEMO_RESULTS[1];
  }
};
