import React, { useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { BuildingIcon, MapPinIcon, PhoneIcon, MailIcon, UsersIcon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddTheater = () => {
  const { axios, getToken, user } = useAppContext();
  
  const [theaterData, setTheaterData] = useState({
    name: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    capacity: '',
    amenities: [],
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [amenityInput, setAmenityInput] = useState('');

  const amenities = [
    'IMAX', '3D', 'Dolby Atmos', 'Reclining Seats', 'Premium Sound',
    'Food & Beverage', 'Parking', 'Wheelchair Accessible', 'Online Booking',
    'Mobile App', 'Loyalty Program', 'Group Bookings'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTheaterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setTheaterData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAddCustomAmenity = () => {
    if (amenityInput.trim() && !theaterData.amenities.includes(amenityInput.trim())) {
      setTheaterData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!theaterData.name || !theaterData.location || !theaterData.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const { data } = await axios.post('/api/admin/theaters', theaterData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        toast.success('Theater added successfully!');
        setTheaterData({
          name: '',
          location: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          phone: '',
          email: '',
          capacity: '',
          amenities: [],
          description: ''
        });
      } else {
        toast.error(data.message || 'Failed to add theater');
      }
    } catch (error) {
      console.error('Error adding theater:', error);
      toast.error('Error adding theater. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="Add" text2="Theater" />
      
      <div className="relative mt-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BuildingIcon className="w-5 h-5" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Theater Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={theaterData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter theater name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={theaterData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., Downtown Mall"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={theaterData.capacity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Number of seats"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={theaterData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                Address Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={theaterData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Street address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={theaterData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={theaterData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="State"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={theaterData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MailIcon className="w-5 h-5" />
                Contact Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={theaterData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="theater@example.com"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                Amenities & Features
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenities.map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={theaterData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded border-gray-300 text-primary focus:ring-primary/50"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="Add custom amenity"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <textarea
                name="description"
                value={theaterData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Describe the theater, its features, and what makes it special..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                Add Theater
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTheater;

