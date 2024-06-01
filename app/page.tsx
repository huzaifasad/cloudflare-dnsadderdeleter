
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

  // Effect to initialize apiKey from localStorage on component mount
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

      // Save apiKey to localStorage after successful fetch
      localStorage.setItem('apiKey', apiKey);
    } catch (error: any) {
      console.error('Error fetching zones:', error);
      // setError(error.message);
    }
  };

  const handleZoneSelect = (zone: Zone) => {
    router.push(`/zone?apiKey=${apiKey}&zoneId=${zone.id}&zoneName=${zone.name}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cloudflare DNS Manager</h1>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your Cloudflare API key"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      <button
        onClick={fetchZones}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
      >
        Fetch Zones
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {zones.length > 0 && (
        <ul className="list-disc pl-5">
          {zones.map((zone) => (
            <li key={zone.id} onClick={() => handleZoneSelect(zone)} className="cursor-pointer hover:underline">
              {zone.name} (ID: {zone.id})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
