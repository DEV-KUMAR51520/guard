"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardCard from "../components/DashboardCard";
import IncidentAlert from "../components/IncidentAlert";
import IncidentBarChart from "../components/IncidentBarChart";
import MapComponent from "../components/MapComponent";
import Modal from "../components/Modal";
import { AlertTriangle, Globe, UserCheck, Sun as SunIcon, Moon as MoonIcon, Link2, MapPin, Zap } from "lucide-react";
import { useTheme } from "../lib/hooks/useTheme";

// Mocked Data
const mockTouristData = [
  { id: 'tourist-001', name: 'Joe Bloggs', lat: 28.6139, lng: 77.2090, status: 'safe' },
  { id: 'tourist-002', name: 'Jane Doe', lat: 28.5833, lng: 77.1990, status: 'safe' },
  { id: 'tourist-003', name: 'John Smith', lat: 28.6089, lng: 77.2130, status: 'warning' },
  { id: 'tourist-004', name: 'Alice Williams', lat: 28.625, lng: 77.185, status: 'safe' },
  { id: 'tourist-005', name: 'Bob Johnson', lat: 28.59, lng: 77.25, status: 'critical' },
];

const mockIncidentData = [
  { id: 'inc-001', touristId: 'tourist-003', type: 'High-risk location detected', timestamp: '2025-09-07T10:00:00Z', status: 'pending' },
  { id: 'inc-002', touristId: 'tourist-005', type: 'Panic button activated', timestamp: '2025-09-07T11:45:00Z', status: 'unassigned' },
  { id: 'inc-003', touristId: 'tourist-001', type: 'Band sensor anomaly', timestamp: '2025-09-07T11:48:00Z', status: 'resolved' },
];

const mockStats = {
  totalTourists: 5,
  activeIncidents: 2,
  incidentsResolvedToday: 1,
};


export default function DashboardPage() {
  const [tourists, setTourists] = useState(mockTouristData);
  const [incidents, setIncidents] = useState(mockIncidentData);
  const [stats, setStats] = useState(mockStats);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const { theme: darkTheme, toggleTheme: setDarkTheme } = useTheme();

  const incidentTypesData = [
    { name: 'Panic Button', value: incidents.filter(i => i.type.includes('Panic')).length },
    { name: 'Location Risk', value: incidents.filter(i => i.type.includes('location')).length },
    { name: 'Band Anomaly', value: incidents.filter(i => i.type.includes('Band')).length },
    { name: 'Geofence Breach', value: 0 },
  ];

  useEffect(() => {
    // This effect will be replaced by a WebSocket connection to the API Gateway
    const interval = setInterval(() => {
      const newIncident = {
        id: `inc-${Math.random().toString(36).substring(2, 9)}`,
        touristId: mockTouristData[Math.floor(Math.random() * mockTouristData.length)].id,
        type: Math.random() > 0.5 ? 'High-risk location detected' : 'Band sensor anomaly',
        timestamp: new Date().toISOString(),
        status: 'unassigned'
      };
      setIncidents(prev => [newIncident, ...prev].slice(0, 5));
      setStats(prev => ({
        ...prev,
        activeIncidents: prev.activeIncidents + 1,
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = (id) => {
    // In a real app, this would be an API call to the backend
    setIncidents(incidents.map(inc => inc.id === id ? { ...inc, status: 'pending' } : inc));
  };

  const handleResolve = (id) => {
    // In a real app, this would be an API call to the backend
    setIncidents(incidents.filter(inc => inc.id !== id));
    setStats(prev => ({
      ...prev,
      activeIncidents: prev.activeIncidents - 1,
      incidentsResolvedToday: prev.incidentsResolvedToday + 1
    }));
  };

  const handleMapClick = (tourist) => {
    const incident = incidents.find(inc => inc.touristId === tourist.id);
    if (incident) {
      setSelectedIncident(incident);
      setShowIncidentModal(true);
    } else {
      setSelectedIncident({
        id: 'n/a',
        touristId: tourist.id,
        type: 'No active incidents',
        timestamp: new Date().toISOString(),
        status: 'safe'
      });
      setShowIncidentModal(true);
    }
  };

  return (
    <>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 p-6 font-sans antialiased text-gray-900 dark:text-white transition-colors`}>
        <header className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <Globe className="h-6 w-6" />
            <h1 className="text-3xl font-extrabold tracking-tight">Tourist Safety Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {new Date().toLocaleString()}
            </span>
            <button onClick={() => setDarkTheme(!darkTheme)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              {darkTheme ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard title="Total Tourists" value={stats.totalTourists} icon={<Globe className="h-6 w-6" />} />
              <DashboardCard title="Active Incidents" value={stats.activeIncidents} icon={<AlertTriangle className="h-6 w-6 text-red-500" />} className="bg-red-50 dark:bg-red-950" />
              <DashboardCard title="Incidents Resolved" value={stats.incidentsResolvedToday} icon={<UserCheckIcon className="h-6 w-6 text-green-500" />} className="bg-green-50 dark:bg-green-950" />
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
              <MapComponent tourists={tourists} onTouristClick={handleMapClick} />
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Live Alerts ({incidents.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {incidents.length > 0 ? incidents.map(incident => (
                  <IncidentAlert
                    key={incident.id}
                    incident={incident}
                    onAcknowledge={handleAcknowledge}
                    onResolve={handleResolve}
                  />
                )) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No active incidents.</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Health & Analytics</h2>
              <IncidentBarChart data={incidentTypesData} />
            </div>
          </aside>
        </main>
      </div>

      <Modal
        show={showIncidentModal}
        title="Incident Details"
        onClose={() => setShowIncidentModal(false)}
      >
        {selectedIncident && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Incident ID: <span className="font-mono">{selectedIncident.id}</span></p>
            <p className="text-lg font-semibold">Type: {selectedIncident.type}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tourist ID: <span className="font-mono">{selectedIncident.touristId}</span></p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Timestamp: {new Date(selectedIncident.timestamp).toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status: <span className={`font-semibold ${selectedIncident.status === 'unassigned' ? 'text-red-500' : selectedIncident.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>{selectedIncident.status}</span></p>
          </div>
        )}
      </Modal>
    </>
  );
}
