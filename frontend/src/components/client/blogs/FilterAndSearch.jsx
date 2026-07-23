"use client"
import React from 'react'
import { useState } from 'react';

import { Search, Filter, X, ChevronDown, SortAsc, SortDesc } from 'lucide-react';



// Advanced Filter Component
const FilterAndSearch = ({ filters, onFilterChange, onClearFilters, totalResults, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: SortDesc },
    { value: 'oldest', label: 'Oldest First', icon: SortAsc },
    { value: 'name', label: 'Title A-Z', icon: SortAsc },
    { value: 'name-desc', label: 'Title Z-A', icon: SortDesc },
  ];

  const hasActiveFilters = filters.search_term || filters.start_date || filters.end_date || filters.sort_by !== 'newest';

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-600/50 mb-8">
      {/* Search Bar - Always Visible */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={filters.search_term || ''}
            onChange={(e) => onFilterChange({ search_term: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Advanced Filters</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                `${totalResults} result${totalResults !== 1 ? 's' : ''}`
              )}
            </span>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-slate-600/50 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={filters.sort_by || 'newest'}
                onChange={(e) => onFilterChange({ sort_by: e.target.value })}
                className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => onFilterChange({ start_date: e.target.value })}
                className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => onFilterChange({ end_date: e.target.value })}
                className="w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Quick Date Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quick Filters</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Last 7 days', days: 7 },
                { label: 'Last 30 days', days: 30 },
                { label: 'Last 3 months', days: 90 },
                { label: 'This year', days: 365 }
              ].map(({ label, days }) => (
                <button
                  key={label}
                  onClick={() => {
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() - days);
                    onFilterChange({
                      start_date: startDate.toISOString().split('T')[0],
                      end_date: new Date().toISOString().split('T')[0]
                    });
                  }}
                  className="px-3 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-full hover:bg-blue-600/30 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FilterAndSearch
