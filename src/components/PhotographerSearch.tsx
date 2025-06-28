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
  User,
  Target,
  Mail,
  ExternalLink
} from 'lucide-react';
import type { PhotographerFilters } from '../lib/hooks/usePhotographers';

interface PhotographerSearchProps {
  filters: PhotographerFilters;
  onFiltersChange: (filters: PhotographerFilters) => void;
  onClearFilters: () => void;
  locations: string[];
  loading?: boolean;
}

export const PhotographerSearchComponent: React.FC<PhotographerSearchProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  locations,
  loading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<PhotographerFilters>(filters);

  const handleInputChange = (field: keyof PhotographerFilters, value: string) => {
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
            Find Photographers
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
            placeholder="Search photographers by name or bio..."
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
            {filters.experienceLevel && (
              <Badge className="bg-neutral-700 text-white border border-neutral-600">
                Experience: {filters.experienceLevel}
                <button
                  onClick={() => handleInputChange('experienceLevel', '')}
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

              {/* Experience Level Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Experience Level
                </label>
                <select
                  value={localFilters.experienceLevel || ''}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded-md text-white"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleApplyFilters}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Searching...' : 'Search Photographers'}
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

// Photographer Card Component
interface PhotographerCardProps {
  photographer: {
    id: string;
    full_name: string;
    email: string;
    location: string | null;
    bio: string | null;
    experience_level: 'beginner' | 'intermediate' | 'advanced' | null;
    portfolio_url: string | null;
    instagram_handle: string | null;
  };
  onContact?: (photographer: any) => void;
}

export const PhotographerCard: React.FC<PhotographerCardProps> = ({ photographer, onContact }) => {
  const getExperienceColor = (level: string | null) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-neutral-800 border-neutral-700 hover:border-orange-500/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-['Merriweather',serif]">
                  {photographer.full_name}
                </h3>
                <p className="text-gray-400 text-sm">{photographer.email}</p>
              </div>
            </div>
            
            {photographer.location && (
              <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
                <MapPin className="w-4 h-4" />
                {photographer.location}
              </div>
            )}

            {photographer.bio && (
              <p className="text-gray-300 mb-4 font-['Figtree',sans-serif]">
                {photographer.bio}
              </p>
            )}
          </div>
          
          <div className="text-right ml-4">
            <Badge className={`mb-2 ${getExperienceColor(photographer.experience_level)}`}>
              {photographer.experience_level ? 
                photographer.experience_level.charAt(0).toUpperCase() + photographer.experience_level.slice(1) 
                : 'Not Specified'
              }
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {photographer.portfolio_url && (
              <Button
                onClick={() => window.open(photographer.portfolio_url!, '_blank')}
                className="border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Portfolio
              </Button>
            )}
            {photographer.instagram_handle && (
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-600 text-neutral-300 hover:text-white"
                onClick={() => window.open(`https://instagram.com/${photographer.instagram_handle}`, '_blank')}
              >
                Instagram
              </Button>
            )}
          </div>
          
          <Button
            onClick={() => onContact?.(photographer)}
            className="border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 