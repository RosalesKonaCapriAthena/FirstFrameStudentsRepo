import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Search, 
  Filter, 
  X, 
  MapPin, 
  Calendar, 
  Target
} from 'lucide-react';
import type { SearchFilters } from '../lib/hooks/useOpportunities';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  sports: string[];
  locations: string[];
  loading?: boolean;
}

export const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  sports,
  locations,
  loading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  const activeFilterCount = Object.values(filters).filter(value => value && value !== '').length;

  return (
    <Card className="w-full bg-neutral-800 border-neutral-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-blue-600 text-white">
                {activeFilterCount} active
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-neutral-300 hover:text-white"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <Input
            placeholder="Search opportunities by title, description, or sport..."
            value={localFilters.searchTerm || ''}
            onChange={(e) => handleInputChange('searchTerm', e.target.value)}
            className="pl-10 bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400"
          />
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.searchTerm && (
              <Badge className="bg-neutral-700 text-white border border-neutral-600">
                Search: {filters.searchTerm}
                <button
                  onClick={() => handleInputChange('searchTerm', '')}
                  className="ml-2 hover:text-red-400"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.sport && (
              <Badge className="bg-neutral-700 text-white border border-neutral-600">
                Sport: {filters.sport}
                <button
                  onClick={() => handleInputChange('sport', '')}
                  className="ml-2 hover:text-red-400"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.location && (
              <Badge className="bg-neutral-700 text-white border border-neutral-600">
                Location: {filters.location}
                <button
                  onClick={() => handleInputChange('location', '')}
                  className="ml-2 hover:text-red-400"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.difficulty && (
              <Badge className="bg-neutral-700 text-white border border-neutral-600">
                Level: {filters.difficulty}
                <button
                  onClick={() => handleInputChange('difficulty', '')}
                  className="ml-2 hover:text-red-400"
                >
                  ×
                </button>
              </Badge>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <Badge className="bg-neutral-700 text-white border border-neutral-600">
                Date Range
                <button
                  onClick={() => {
                    handleInputChange('dateFrom', '');
                    handleInputChange('dateTo', '');
                  }}
                  className="ml-2 hover:text-red-400"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-neutral-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sport Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Sport
                </label>
                <select
                  value={localFilters.sport || ''}
                  onChange={(e) => handleInputChange('sport', e.target.value)}
                  className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                >
                  <option value="">All Sports</option>
                  {sports.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <select
                  value={localFilters.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  Experience Level
                </label>
                <select
                  value={localFilters.difficulty || ''}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  Status
                </label>
                <select
                  value={localFilters.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400">From</label>
                  <Input
                    type="date"
                    value={localFilters.dateFrom || ''}
                    onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                    className="bg-neutral-700 border-neutral-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">To</label>
                  <Input
                    type="date"
                    value={localFilters.dateTo || ''}
                    onChange={(e) => handleInputChange('dateTo', e.target.value)}
                    className="bg-neutral-700 border-neutral-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleApplyFilters}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Applying...' : 'Apply Filters'}
              </Button>
              <Button
                onClick={handleClearFilters}
                className="border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 