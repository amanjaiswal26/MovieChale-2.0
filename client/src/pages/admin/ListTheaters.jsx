import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { BuildingIcon, MapPinIcon, PhoneIcon, MailIcon, UsersIcon, EditIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListTheaters = () => {
  const { axios, getToken, user } = useAppContext();
  
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchTheaters = async () => {
    try {
      const { data } = await axios.get('/api/admin/theaters', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        setTheaters(data.theaters || []);
      } else {
        toast.error(data.message || 'Failed to fetch theaters');
      }
    } catch (error) {
      console.error('Error fetching theaters:', error);
      toast.error('Error fetching theaters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTheater = async (theaterId) => {
    if (!window.confirm('Are you sure you want to delete this theater?')) {
      return;
    }

    try {
      const { data } = await axios.delete(`/api/admin/theaters/${theaterId}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        toast.success('Theater deleted successfully!');
        fetchTheaters();
      } else {
        toast.error(data.message || 'Failed to delete theater');
      }
    } catch (error) {
      console.error('Error deleting theater:', error);
      toast.error('Error deleting theater. Please try again.');
    }
  };

  const handleViewTheater = (theater) => {
    setSelectedTheater(theater);
    setShowModal(true);
  };

  const handleEditTheater = (theater) => {
    setEditingTheater(theater);
    setShowEditModal(true);
  };

  const handleUpdateTheater = async (updatedTheater) => {
    try {
      const { data } = await axios.put(`/api/admin/theaters/${updatedTheater._id}`, updatedTheater, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        toast.success('Theater updated successfully!');
        fetchTheaters();
        setShowEditModal(false);
        setEditingTheater(null);
      } else {
        toast.error(data.message || 'Failed to update theater');
      }
    } catch (error) {
      console.error('Error updating theater:', error);
      toast.error('Error updating theater. Please try again.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchTheaters();
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Theaters" />
      
      <div className="relative mt-6">
        {theaters.length === 0 ? (
          <div className="text-center py-12">
            <BuildingIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No theaters found</h3>
            <p className="text-gray-500">Add your first theater to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theaters.map((theater) => (
              <div key={theater._id} className="bg-primary/10 border border-primary/20 rounded-lg p-6 hover:-translate-y-1 transition duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <BuildingIcon className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">{theater.name}</h3>
                      <p className="text-sm text-gray-500">{theater.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewTheater(theater)}
                      className="p-2 text-gray-500 hover:text-primary transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditTheater(theater)}
                      className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                      title="Edit Theater"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTheater(theater._id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      title="Delete Theater"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {theater.address && (
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{theater.address}</span>
                    </div>
                  )}
                  
                  {theater.phone && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{theater.phone}</span>
                    </div>
                  )}
                  
                  {theater.email && (
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{theater.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Capacity: {theater.capacity} seats</span>
                  </div>
                </div>

                {theater.amenities && theater.amenities.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {theater.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                          {amenity}
                        </span>
                      ))}
                      {theater.amenities.length > 3 && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                          +{theater.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theater Details Modal */}
      {showModal && selectedTheater && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <BuildingIcon className="w-8 h-8 text-primary" />
                  {selectedTheater.name}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-gray-900">{selectedTheater.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Capacity</label>
                      <p className="text-gray-900">{selectedTheater.capacity} seats</p>
                    </div>
                  </div>
                </div>

                {selectedTheater.address && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Address</h3>
                    <div className="space-y-2">
                      <p className="text-gray-900">{selectedTheater.address}</p>
                      {(selectedTheater.city || selectedTheater.state || selectedTheater.zipCode) && (
                        <p className="text-gray-600">
                          {[selectedTheater.city, selectedTheater.state, selectedTheater.zipCode]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {(selectedTheater.phone || selectedTheater.email) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      {selectedTheater.phone && (
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{selectedTheater.phone}</span>
                        </div>
                      )}
                      {selectedTheater.email && (
                        <div className="flex items-center gap-2">
                          <MailIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{selectedTheater.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedTheater.amenities && selectedTheater.amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTheater.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTheater.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-700">{selectedTheater.description}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleEditTheater(selectedTheater);
                  }}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Edit Theater
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Theater Modal */}
      {showEditModal && editingTheater && (
        <EditTheaterModal
          theater={editingTheater}
          onUpdate={handleUpdateTheater}
          onClose={() => {
            setShowEditModal(false);
            setEditingTheater(null);
          }}
        />
      )}
    </>
  );
};

// Edit Theater Modal Component
const EditTheaterModal = ({ theater, onUpdate, onClose }) => {
  const [theaterData, setTheaterData] = useState({
    name: theater.name || '',
    location: theater.location || '',
    address: theater.address || '',
    city: theater.city || '',
    state: theater.state || '',
    zipCode: theater.zipCode || '',
    phone: theater.phone || '',
    email: theater.email || '',
    capacity: theater.capacity || '',
    amenities: theater.amenities || [],
    description: theater.description || ''
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...theater, ...theaterData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Edit Theater</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Theater Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={theaterData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={theaterData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={theaterData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Amenities & Features</h3>
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

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Update Theater
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListTheaters;

