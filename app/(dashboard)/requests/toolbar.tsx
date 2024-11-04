'use client';
import { useState } from 'react';
import { Search, Download } from 'lucide-react';

const Toolbar = () => {
  const [search, setSearch] = useState('');
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search requests"
          className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <a
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        href="/api/requests/export"
      >
        <Download className="h-4 w-4" />
        Export to CSV
      </a>
    </div>
  );
};

export default Toolbar;
