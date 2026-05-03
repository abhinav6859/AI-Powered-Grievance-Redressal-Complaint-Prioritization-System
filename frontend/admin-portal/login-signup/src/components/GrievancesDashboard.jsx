import GrievanceCard from './GrievanceCard';
import ResolutionTimeline from './ResolutionTimeline';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import GrievanceDetails from './GrievanceDetail';
const API = import.meta.env.VITE_API_URL;

const GrievancesDashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchGrievances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/api/admin-dashboard/grievances`);
      console.log("Fetched grievances:", res.data);
      // Ensure data is an array
      setGrievances(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching grievances:', err);
      setError('Failed to load grievances. Please try again.');
      setGrievances([]);
    } finally {
      setLoading(false);
    }
  }, [API]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin-dashboard/stats`);
      setStats(res.data || { total: 0, pending: 0, inProgress: 0, resolved: 0 });
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Don't set error for stats failure, just use defaults
    }
  }, [API]);

  useEffect(() => {
    fetchGrievances();
    fetchStats();
  }, [fetchGrievances, fetchStats]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axios.put(`${API}/api/admin-dashboard/grievances/${id}/status`, { status: newStatus });
      
      // Update grievances state
      setGrievances(prev =>
        prev.map(g => (g._id === id ? { ...g, status: newStatus } : g))
      );
      
      // Refresh stats after status change
      await fetchStats();
      
      // Update selected grievance if it's the one being edited
      if (selectedGrievance && selectedGrievance._id === id) {
        setSelectedGrievance(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCardClick = (grievance) => {
    setSelectedGrievance(grievance);
  };

  const handleCloseDetails = () => {
    setSelectedGrievance(null);
  };

  const handleRetry = () => {
    fetchGrievances();
    fetchStats();
  };

  // Stats cards configuration
  const statCards = [
    { label: 'Total', value: stats.total, color: 'gray', bgColor: 'bg-white', textColor: 'text-gray-900' },
    { label: 'Pending', value: stats.pending, color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
    { label: 'In Progress', value: stats.inProgress, color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    { label: 'Resolved', value: stats.resolved, color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-700' }
  ];

  return (
    <div className="flex flex-col lg:flex-row p-6 gap-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Grievances Dashboard</h1>
          <button
            onClick={handleRetry}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} p-5 shadow-sm rounded-xl text-center transition-transform hover:scale-105 cursor-pointer`}
            >
              <h4 className={`text-gray-600 font-semibold text-sm uppercase tracking-wide`}>
                {stat.label}
              </h4>
              <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Grievances List */}
        {!loading && grievances.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No grievances found</h3>
            <p className="mt-2 text-gray-500">There are no grievances to display at this time.</p>
          </div>
        )}

        {/* Grievances Cards */}
        {!loading && grievances.length > 0 && (
          <div className="space-y-4">
            {grievances.map((grievance) => (
              <div
                key={grievance._id}
                onClick={() => handleCardClick(grievance)}
                className="cursor-pointer transition-all hover:scale-[1.01]"
              >
                <GrievanceCard
                  data={grievance}
                  onStatusChange={handleStatusChange}
                  isUpdating={updatingId === grievance._id}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Details Panel */}
      {selectedGrievance && (
        <div className="lg:w-96 w-full">
          <GrievanceDetails
            grievance={selectedGrievance}
            onClose={handleCloseDetails}
            onStatusChange={handleStatusChange}
            isUpdating={updatingId === selectedGrievance._id}
          />
        </div>
      )}
    </div>
  );
};

export default GrievancesDashboard;