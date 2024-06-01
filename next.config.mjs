/** @type {import('next').NextConfig} */
const nextConfig = {
    // Example configuration options:
    // Enable TypeScript support
    typescript: {
      ignoreDevErrors: true, // Ignore TypeScript errors in development
    },
  
    // Define API routes
    async rewrites() {
      return [
        {
          source: '/api/zone/:zoneId/dnsRecords',
          destination: '/api/zone/[zoneId]/dnsRecords/route',
        },
      ];
    },
  };
  
  export default nextConfig;
  