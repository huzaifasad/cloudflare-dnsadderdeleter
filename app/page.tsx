'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Zone {
  id: string;
  name: string;
}

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [zones, setZones] = useState<Zone[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const fetchZones = async () => {
    setError('');
    try {
      const response = await fetch('/api/zone/getzones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setZones(data);
      localStorage.setItem('apiKey', apiKey);
    } catch (error: any) {
      console.error('Error fetching zones:', error);
      setError(error.message);
    }
  };

  const handleZoneSelect = (zone: Zone) => {
    router.push(`/zone?apiKey=${apiKey}&zoneId=${zone.id}&zoneName=${zone.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Cloudflare DNS Manager</h1>
        <div className="mb-4">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Cloudflare API key"
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-center mb-6">
          <button
            onClick={fetchZones}
            className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition duration-300"
          >
            Fetch Zones
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {zones.length > 0 && (
          <ul className="list-disc pl-5 space-y-2">
            {zones.map((zone) => (
              <li
                key={zone.id}
                onClick={() => handleZoneSelect(zone)}
                className="cursor-pointer text-blue-500 hover:underline"
              >
                {zone.name} (ID: {zone.id})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
