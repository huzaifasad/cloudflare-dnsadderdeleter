'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface DNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
}

const ZoneContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiKey = searchParams.get('apiKey');
  const zoneId = searchParams.get('zoneId');
  const zoneName = searchParams.get('zoneName');
  const [loaded, setLoaded] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDNSRecords = useCallback(async () => {
    try {
      const response = await fetch(`/api/getdnsrecords?apiKey=${apiKey}&zoneId=${zoneId}`);
      const data = await response.json();
      if (response.ok) {
        setDnsRecords(data);
        setError(null);
      } else {
        setError(data.detail || data.error);
      }
      setLoaded(true);
    } catch (error) {
      setError('Error fetching DNS records');
      setLoaded(true);
    }
  }, [apiKey, zoneId]);

  useEffect(() => {
    if (apiKey && zoneId && zoneName) {
      fetchDNSRecords();
    }
  }, [apiKey, zoneId, zoneName, fetchDNSRecords]);

  const addBulkDNSRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/adddnsrecords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, zoneId }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('DNS records created successfully.');
        fetchDNSRecords(); // Refresh DNS records
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Error creating DNS records');
    }
    setIsLoading(false);
  };

  if (!loaded) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Selected Zone</h1>
      <p className="mb-2"><strong>API Key:</strong> {apiKey}</p>
      <p className="mb-2"><strong>Zone Name:</strong> {zoneName}</p>
      <p className="mb-4"><strong>Zone ID:</strong> {zoneId}</p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
      >
        Back
      </button>
      <h2 className="text-xl font-semibold mb-4">DNS Records</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Content</th>
            <th className="py-2 px-4 border-b">TTL</th>
            <th className="py-2 px-4 border-b">Proxied</th>
          </tr>
        </thead>
        <tbody>
          {dnsRecords.map((record) => (
            <tr key={record.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{record.type}</td>
              <td className="py-2 px-4 border-b">{record.name}</td>
              <td className="py-2 px-4 border-b">{record.content}</td>
              <td className="py-2 px-4 border-b">{record.ttl}</td>
              <td className="py-2 px-4 border-b">{record.proxied ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={addBulkDNSRecords}
        className={`mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Bulk DNS Records'}
      </button>
    </div>
  );
};

const Zone = () => (
  <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
    <ZoneContent />
  </Suspense>
);

export default Zone;
