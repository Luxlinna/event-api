import React, { useEffect, useState } from 'react';
import axios from 'axios';


const REACT_BACKEND_URL= 'http://localhost:5001/api';

const backendURL = `${REACT_BACKEND_URL}/events`;

const MainContent = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    fromDate: '', 
    toDate: '', 
    location: '', 
    description: '', 
    image: null,  // For file handling
    eventUrl: '', 
    speaker: '', 
    category: '', 
    categoryDetail: '' 
  });
  const [editMode, setEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await axios.get(backendURL);
    setEvents(response.data);
  };

  const createEvent = async () => {
    const eventCategory = form.category === 'Custom' ? customCategory : form.category;
    const newEvent = { ...form, category: eventCategory };
    
    const formData = new FormData();
    formData.append('name', newEvent.name);
    formData.append('fromDate', newEvent.fromDate);
    formData.append('toDate', newEvent.toDate);
    formData.append('location', newEvent.location);
    formData.append('description', newEvent.description);
    formData.append('eventUrl', newEvent.eventUrl);
    formData.append('speaker', newEvent.speaker);
    formData.append('category', newEvent.category);
    formData.append('categoryDetail', newEvent.categoryDetail);
    if (form.image) formData.append('image', form.image);

    if (editMode) {
      await axios.put(`backendURL/${currentEventId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEditMode(false);
      setCurrentEventId(null);
    } else {
      const response = await axios.post(backendURL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEvents([...events, response.data]);
    }
    resetForm();
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await axios.delete(`backendURL/${id}`);
    setEvents(events.filter(event => event._id !== id));
  };

  const editEvent = (event) => {
    setForm({
      name: event.name,
      fromDate: new Date(event.fromDate).toISOString().split('T')[0],
      toDate: new Date(event.toDate).toISOString().split('T')[0],
      location: event.location,
      description: event.description,
      image: null,
      eventUrl: event.eventUrl,
      speaker: event.speaker,
      category: event.category,
      categoryDetail: event.categoryDetail || ''
    });
    setEditMode(true);
    setCurrentEventId(event._id);
    if (!['Conference', 'Workshop', 'Webinar', 'Meetup', 'Social'].includes(event.category)) {
      setCustomCategory(event.category);
      setForm({ ...form, category: 'Custom' });
    }
  };

  const resetForm = () => {
    setForm({ 
      name: '', 
      fromDate: '', 
      toDate: '', 
      location: '', 
      description: '', 
      image: null, 
      eventUrl: '', 
      speaker: '', 
      category: '', 
      categoryDetail: '' 
    });
    setCustomCategory('');
  };

  return (
    <main className="flex-grow bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Event Management</h1>
    
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <input 
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Event Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          
          <div className="flex space-x-4">
            <input 
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="From Date"
              value={form.fromDate}
              onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
            />
            <input 
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="To Date"
              value={form.toDate}
              onChange={(e) => setForm({ ...form, toDate: e.target.value })}
            />
          </div>

          <input 
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <textarea 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input 
            type="file"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />

          <input 
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Event URL"
            value={form.eventUrl}
            onChange={(e) => setForm({ ...form, eventUrl: e.target.value })}
          />

          <input 
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Speaker"
            value={form.speaker}
            onChange={(e) => setForm({ ...form, speaker: e.target.value })}
          />

          <select 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="" disabled>Select Category</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Webinar">Webinar</option>
            <option value="Meetup">Meetup</option>
            <option value="Social">Social</option>
            <option value="Custom">Custom</option>
          </select>

          {form.category === 'Custom' && (
            <input 
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Custom Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          )}

          <textarea 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Category Details"
            value={form.categoryDetail}
            onChange={(e) => setForm({ ...form, categoryDetail: e.target.value })}
          />

          <button 
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={createEvent}
          >
            {editMode ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">{event.name}</h2>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>From:</strong> {new Date(event.fromDate).toLocaleDateString()}</p>
            <p><strong>To:</strong> {new Date(event.toDate).toLocaleDateString()}</p>
            <p>{event.description}</p>
            {event.imageUrl && <img src={event.imageUrl} alt={event.name} className="w-full h-auto mt-4" />}
            <button 
              className="w-full mt-4 p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              onClick={() => editEvent(event)}
            >
              Edit
            </button>
            <button 
              className="w-full mt-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => deleteEvent(event._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MainContent;
