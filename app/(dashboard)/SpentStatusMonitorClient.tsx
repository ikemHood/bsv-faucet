"use client";
import useSpentStatusMonitor from '@/hooks/useUpdateSpentStatus';

const SpentStatusMonitorClient = () => {
  const { loading, error } = useSpentStatusMonitor();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return null;
};

export default SpentStatusMonitorClient;
