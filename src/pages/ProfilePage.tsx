import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import profileService, { UserProfile } from '../services/profileService';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Fetch user profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const userProfile = await profileService.getCurrentProfile(user.id);
        if (userProfile) {
          setProfile(userProfile);
        }
      }
    };

    fetchProfile();
  }, [user]);

  // Set initial form values from profile
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setPhoneNumber(profile.phone_number || '');
      setDistrict(profile.district || '');
      setCity(profile.city || '');
    }
  }, [profile]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');

    // Validate form
    if (!name) {
      setErrorMessage('Name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      if (user) {
        const success = await profileService.updateProfile(user.id, {
          full_name: name,
          phone_number: phoneNumber,
          district,
          city
        });

        if (success) {
          setSuccessMessage('Profile updated successfully');
        } else {
          setErrorMessage('Failed to update profile');
        }
      } else {
        setErrorMessage('You must be logged in to update your profile');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while updating your profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
    } else {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Profile</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
                </div>

                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-6 my-2" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-6 my-2" role="alert">
                    <span className="block sm:inline">{errorMessage}</span>
                  </div>
                )}

                <div className="border-t border-gray-200">
                  <form onSubmit={handleSubmit}>
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {user?.email}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <input
                            type="tel"
                            name="phone-number"
                            id="phone-number"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">District</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <input
                            type="text"
                            name="district"
                            id="district"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                          />
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">City</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <input
                            type="text"
                            name="city"
                            id="city"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:px-6">
                        <div className="flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Logout
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {isSubmitting ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </dl>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
