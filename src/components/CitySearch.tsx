import { useState, useEffect, useRef, useCallback } from 'react'
import { searchCities, formatCityName, type GeocodingResult } from '../lib/openmeteo'
import { useAdaptiveTextColors } from '../hooks/useAdaptiveTextColors'

/** Debounce delay for search input in milliseconds */
const SEARCH_DEBOUNCE_MS = 300

interface CitySearchProps {
  onSubmit: (lat: number, lon: number, cityName: string) => void
  onCancel: () => void
  textColors: ReturnType<typeof useAdaptiveTextColors>['classes']
}

/**
 * City search component with debounced autocomplete
 * Replaces the manual lat/lon entry with user-friendly city search
 */
export function CitySearch({ onSubmit, onCancel, textColors }: CitySearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([])
      setShowResults(false)
      setFocusedIndex(-1)
      return
    }

    setLoading(true)
    setError('')

    try {
      const cities = await searchCities(searchQuery, 5)
      setResults(cities)
      setShowResults(true)
      setFocusedIndex(-1)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed'
      setError(message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle query changes with debounce
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    setError('')

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      performSearch(newQuery)
    }, SEARCH_DEBOUNCE_MS)
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // Handle city selection
  const handleCitySelect = (city: GeocodingResult) => {
    const cityName = formatCityName(city)
    onSubmit(city.latitude, city.longitude, cityName)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) {
      if (e.key === 'Escape') {
        setShowResults(false)
        setFocusedIndex(-1)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, -1))
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < results.length) {
          handleCitySelect(results[focusedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowResults(false)
        setFocusedIndex(-1)
        break
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setQuery('')
    setResults([])
    setError('')
    onCancel()
  }

  return (
    <section aria-labelledby="city-search-title" className="flex flex-col items-center justify-center py-16 space-y-6 px-4">
      <div className="text-6xl" role="img" aria-label="Search icon">
        🔍
      </div>
      <div className="w-full max-w-md" ref={containerRef}>
        <h2 id="city-search-title" className={`text-xl font-semibold ${textColors.primary} mb-3 text-center`}>
          Find Your City
        </h2>
        <p className={`${textColors.secondary} mb-6 text-center text-sm`}>
          Search for your city to get local weather and outfit recommendations.
        </p>

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 pr-10"
            aria-describedby="search-hint"
            aria-expanded={showResults && results.length > 0}
            aria-haspopup="listbox"
            aria-controls="city-results-list"
            aria-activedescendant={focusedIndex >= 0 ? `city-option-${results[focusedIndex]?.id}` : undefined}
            role="combobox"
            aria-autocomplete="list"
          />

          {/* Loading spinner */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <p id="search-hint" className={`text-xs ${textColors.muted} mt-2`}>
          Start typing to see suggestions
        </p>

        {/* Error message */}
        {error && (
          <div role="alert" className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
            <button
              type="button"
              onClick={() => performSearch(query)}
              className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Search results dropdown */}
        {showResults && results.length > 0 && (
          <ul
            id="city-results-list"
            role="listbox"
            className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            {results.map((city, index) => (
              <li key={city.id}>
                <button
                  id={`city-option-${city.id}`}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className={`w-full px-4 py-3 text-left transition-colors border-b border-gray-100 last:border-b-0 ${
                    index === focusedIndex
                      ? 'bg-blue-100'
                      : 'hover:bg-blue-50 focus:bg-blue-50'
                  } focus:outline-none`}
                  role="option"
                  aria-selected={index === focusedIndex}
                >
                  <span className="font-medium text-gray-900">{city.name}</span>
                  {city.admin1 && (
                    <span className="text-gray-600">, {city.admin1}</span>
                  )}
                  <span className="text-gray-500">, {city.country}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* No results message */}
        {showResults && results.length === 0 && !loading && query.length >= 2 && !error && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className={`text-sm ${textColors.secondary} text-center`}>
              No cities found for "{query}"
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full px-6 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium text-lg border border-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  )
}
