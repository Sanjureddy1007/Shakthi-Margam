import React, { useState } from 'react';
import { BusinessProfile } from '../../models/BusinessProfile';
import { useAIAssistant } from '../../context/AIAssistantProvider';

interface AssessmentFormProps {
  onComplete: (profile: BusinessProfile) => void;
  className?: string;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete, className }) => {
  const { setBusinessProfileId } = useAIAssistant();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BusinessProfile>>({
    name: '',
    description: '',
    industry: '',
    stage: 'startup',
    location: {
      district: '',
      city: '',
      pincode: '',
    },
    team: {
      size: 1,
      employmentType: 'full-time',
      hasCoFounders: false,
    },
    financials: {
      fundingStatus: 'bootstrapped',
    },
    socialMedia: {
      platforms: [],
      contentFrequency: 'irregular',
    },
    offerings: {
      type: 'product',
      count: 1,
      priceRange: {
        min: 0,
        max: 0,
      },
    },
    customers: {
      targetSegments: [],
      demographics: {},
      geographicFocus: 'local',
      acquisitionChannels: [],
    },
    challenges: [],
    goals: {
      shortTerm: [],
      longTerm: [],
    },
    telanganaSpecific: {
      useGovernmentSchemes: false,
      memberOfAssociations: false,
      localMarketFocus: true,
      exportFocus: false,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof BusinessProfile] as Record<string, any> || {}),
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof BusinessProfile] as Record<string, any> || {}),
          [child]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: checked,
      });
    }
  };

  const handleArrayChange = (name: string, value: string) => {
    const path = name.split('.');

    if (path.length === 1) {
      // Top-level array
      const currentArray = formData[path[0] as keyof BusinessProfile] as string[] || [];
      setFormData({
        ...formData,
        [path[0]]: [...currentArray, value],
      });
    } else if (path.length === 2) {
      // Nested array
      const parent = path[0];
      const child = path[1];
      const parentObj = formData[parent as keyof BusinessProfile] as any;
      const currentArray = parentObj[child] as string[] || [];

      setFormData({
        ...formData,
        [parent]: {
          ...parentObj,
          [child]: [...currentArray, value],
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a complete business profile
    const profile: BusinessProfile = {
      ...formData as BusinessProfile,
      id: `profile_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Set the business profile ID in the AI assistant context
    setBusinessProfileId(profile.id);

    // Call the onComplete callback with the profile
    onComplete(profile);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Assessment</h2>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Business Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                required
              >
                <option value="">Select Industry</option>
                <option value="textiles">Textiles and Handlooms</option>
                <option value="food-processing">Food Processing</option>
                <option value="handicrafts">Handicrafts</option>
                <option value="it-services">IT Services</option>
                <option value="beauty-wellness">Beauty and Wellness</option>
                <option value="retail">Retail</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="agriculture">Agriculture</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Business Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                required
              >
                <option value="idea">Idea Stage</option>
                <option value="startup">Startup (0-2 years)</option>
                <option value="growth">Growth (2-5 years)</option>
                <option value="established">Established (5+ years)</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Additional steps would be implemented here */}

        {/* Final step with submit button */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Review and Submit</h3>

            <p className="text-gray-600">
              Please review your information before submitting. This will help us provide personalized guidance for your business.
            </p>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                Previous
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              >
                Submit Assessment
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AssessmentForm;
