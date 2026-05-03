import GrievanceCard from '../GrievanceCard';
import ResolutionTimeline from '../ResolutionTimeline';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import GrievanceDetails from '../GrievanceDetail'; 

const API = import.meta.env.VITE_API_URL;

// Department mapping rules
const departmentMapping = {
  // Water supply complaints go to Health department
  'water supply': 'health',
  
  // Agriculture complaints go to Health department  
  'agriculture': 'health',
  
  // Sanitation complaints go to General department
  'sanitation': 'general',
  
  // Electricity complaints go to General department
  'electricity': 'general',
  
  // Road and Transport complaints go to Transport department
  'road and transport': 'transport',
  'transport': 'transport',
  'road': 'transport'
};

// Function to determine which department officer should see this grievance
const getAssignedDepartment = (grievanceDepartment) => {
  const deptLower = grievanceDepartment?.toLowerCase() || '';
  
  // Check if this department needs to be remapped
  for (const [originalDept, mappedDept] of Object.entries(departmentMapping)) {
    if (deptLower.includes(originalDept)) {
      return mappedDept;
    }
  }
  
  // If no mapping found, return the original department
  return grievanceDepartment;
};

const GrievancesDashboard = ({ userRole, userDepartment }) => {
  const [grievances, setGrievances] = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [selectedGrievance, setSelectedGrievance] = useState(null); 
  
  // Filter grievances based on department officer/head
  const filterGrievancesByDepartment = useCallback((allGrievances, role, department) => {
    if (!allGrievances) return;
    
    let filtered = [];
    
    if (role === 'head' || role === 'officer') {
      // For department heads and officers, show complaints mapped to their department
      filtered = allGrievances.filter(grievance => {
        const assignedDept = getAssignedDepartment(grievance.department);
        return assignedDept?.toLowerCase() === department?.toLowerCase();
      });
      
      console.log(`Showing grievances for ${role} of ${department} department:`, filtered.length);
    } else if (role === 'admin') {
      // Admin sees all grievances
      filtered = allGrievances;
      console.log("Admin sees all grievances:", filtered.length);
    } else {
      // Default: show only general department grievances
      filtered = allGrievances.filter(grievance => {
        const assignedDept = getAssignedDepartment(grievance.department);
        return assignedDept?.toLowerCase() === 'general';
      });
    }
    
    setFilteredGrievances(filtered);
    
    // Update stats based on filtered grievances
    const total = filtered.length;
    const pending = filtered.filter(g => g.status === 'Pending').length;
    const inProgress = filtered.filter(g => g.status === 'In Progress').length;
    const resolved = filtered.filter(g => g.status === 'Resolved').length;
    
    setStats({ total, pending, inProgress, resolved });
  }, []);

  const fetchGrievances = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin-dashboard/grievances`);
      console.log("Fetched grievances:", res.data); 
      setGrievances(res.data);
      
      // Filter grievances based on user's role and department
      filterGrievancesByDepartment(res.data, userRole, userDepartment);
    } catch (err) {
      console.error('Error fetching grievances:', err);
    }
  }, [userRole, userDepartment, filterGrievancesByDepartment]);

  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API}/api/admin-dashboard/grievances/${id}/status`, { status: newStatus });
      
      // Update both original and filtered grievances
      const updatedGrievances = grievances.map((g) => 
        (g._id === id ? { ...g, status: newStatus } : g)
      );
      setGrievances(updatedGrievances);
      
      // Re-filter to update the displayed list
      filterGrievancesByDepartment(updatedGrievances, userRole, userDepartment);
      
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-6 gap-6 bg-gray-100 min-h-screen">
    
      <div className="flex-1 space-y-6">
        
        {/* Department Info Banner */}
        {userRole && userDepartment && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700 font-semibold">
                  Logged in as: <span className="uppercase">{userRole}</span>
                </p>
                <p className="text-sm text-blue-700">
                  Department: <span className="uppercase font-bold">{userDepartment}</span>
                </p>
              </div>
              <div className="text-xs text-gray-600">
                Showing complaints assigned to your department
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 shadow rounded text-center">
            <h4 className="text-gray-700 font-semibold">Total (Your Dept)</h4>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-yellow-100 p-4 shadow rounded text-center">
            <h4 className="text-gray-700 font-semibold">Pending</h4>
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-blue-100 p-4 shadow rounded text-center">
            <h4 className="text-gray-700 font-semibold">In Progress</h4>
            <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
          </div>
          <div className="bg-green-100 p-4 shadow rounded text-center">
            <h4 className="text-gray-700 font-semibold">Resolved</h4>
            <p className="text-2xl font-bold text-green-700">{stats.resolved}</p>
          </div>
        </div>

        {filteredGrievances.length === 0 ? (
          <div className="bg-white p-8 shadow rounded text-center">
            <p className="text-gray-500">No grievances assigned to your department</p>
          </div>
        ) : (
          filteredGrievances.map((g) => (
            <div onClick={() => setSelectedGrievance(g)} key={g._id} className="cursor-pointer">
              {/* Show original department mapping in a subtle way */}
              <div className="text-xs text-gray-400 mb-1 ml-2">
                Original: {g.department} → Assigned to: {getAssignedDepartment(g.department)}
              </div>
              <GrievanceCard 
                data={{
                  ...g,
                  department: getAssignedDepartment(g.department) // Show assigned department
                }} 
                onStatusChange={handleStatusChange} 
              />
            </div>
          ))
        )}
      </div>
      
      {selectedGrievance && (
        <GrievanceDetails
          grievance={{
            ...selectedGrievance,
            assignedDepartment: getAssignedDepartment(selectedGrievance.department),
            originalDepartment: selectedGrievance.department
          }}
          onClose={() => setSelectedGrievance(null)}
        />
      )}
    </div>
  );
};

export default GrievancesDashboard;