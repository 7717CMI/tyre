'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useDashboardStore } from '@/lib/store'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'

export function GeographyMultiSelect() {
  const { data, filters, updateFilters } = useDashboardStore()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set())
  const [expandedSubRegions, setExpandedSubRegions] = useState<Set<string>>(new Set())
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Extract hierarchy from geography dimension
  const geoHierarchy = useMemo(() => {
    if (!data?.dimensions?.geographies) return { regions: [], sub_regions: {}, countries: {} }
    const geo = data.dimensions.geographies
    return {
      regions: geo.regions || [],
      sub_regions: geo.sub_regions || {},
      countries: geo.countries || {}
    }
  }, [data])

  // Get all leaf geographies for search filtering
  const allLeafGeos = useMemo(() => {
    if (!data?.dimensions?.geographies) return []
    return data.dimensions.geographies.all_geographies.filter(g => g !== 'Global')
  }, [data])

  // Filter geographies by search term
  const matchesSearch = (name: string) => {
    if (!searchTerm) return true
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  }

  // Check if a region/sub-region has any matching items in search
  const hasSearchMatch = (parentKey: string): boolean => {
    if (!searchTerm) return true
    if (matchesSearch(parentKey)) return true

    // Check sub-regions
    const subRegions = geoHierarchy.sub_regions[parentKey] || []
    for (const sr of subRegions) {
      if (matchesSearch(sr)) return true
      const countries = geoHierarchy.countries[sr] || []
      if (countries.some(c => matchesSearch(c))) return true
    }

    // Check direct countries
    const countries = geoHierarchy.countries[parentKey] || []
    if (countries.some(c => matchesSearch(c))) return true

    return false
  }

  const handleToggle = (geography: string) => {
    const current = filters.geographies
    const updated = current.includes(geography)
      ? current.filter(g => g !== geography)
      : [...current, geography]

    updateFilters({ geographies: updated })
  }

  const toggleExpand = (key: string, level: 'region' | 'subRegion') => {
    if (level === 'region') {
      setExpandedRegions(prev => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        return next
      })
    } else {
      setExpandedSubRegions(prev => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        return next
      })
    }
  }

  const handleSelectAll = () => {
    if (!data) return
    updateFilters({
      geographies: data.dimensions.geographies.all_geographies
    })
  }

  const handleClearAll = () => {
    updateFilters({ geographies: [] })
  }

  // Auto-expand when searching
  useEffect(() => {
    if (searchTerm) {
      setExpandedRegions(new Set(geoHierarchy.regions))
      const allSubs = new Set<string>()
      Object.values(geoHierarchy.sub_regions).forEach(subs => {
        subs.forEach(s => allSubs.add(s))
      })
      setExpandedSubRegions(allSubs)
    }
  }, [searchTerm, geoHierarchy])

  if (!data) return null

  const selectedCount = filters.geographies.length
  const hasHierarchy = geoHierarchy.regions.length > 0

  // Render a checkbox item
  const renderCheckbox = (name: string, indent: number) => {
    if (!matchesSearch(name) && searchTerm) return null
    return (
      <label
        key={name}
        className="flex items-center py-1.5 hover:bg-blue-50 cursor-pointer"
        style={{ paddingLeft: `${indent * 16 + 12}px`, paddingRight: '12px' }}
      >
        <input
          type="checkbox"
          checked={filters.geographies.includes(name)}
          onChange={() => handleToggle(name)}
          className="mr-2.5 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <span className="text-sm text-black flex-1">{name}</span>
      </label>
    )
  }

  // Render expand/collapse toggle
  const renderToggle = (key: string, level: 'region' | 'subRegion', isExpanded: boolean) => (
    <button
      onClick={(e) => { e.stopPropagation(); toggleExpand(key, level) }}
      className="p-0.5 hover:bg-gray-200 rounded mr-1"
    >
      {isExpanded
        ? <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        : <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
      }
    </button>
  )

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
      >
        <span className="text-sm text-black">
          {selectedCount === 0
            ? 'Select geographies...'
            : `${selectedCount} selected`}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b">
            <input
              type="text"
              placeholder="Search geographies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="px-3 py-2 bg-gray-50 border-b flex gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1 text-xs bg-gray-100 text-black rounded hover:bg-gray-200"
            >
              Clear All
            </button>
          </div>

          {/* Hierarchical Geography Tree */}
          <div className="overflow-y-auto max-h-64">
            {hasHierarchy ? (
              geoHierarchy.regions.map(region => {
                if (!hasSearchMatch(region)) return null
                const isRegionExpanded = expandedRegions.has(region)
                const subRegions = geoHierarchy.sub_regions[region] || []
                const directCountries = geoHierarchy.countries[region] || []
                const hasChildren = subRegions.length > 0 || directCountries.length > 0

                return (
                  <div key={region}>
                    {/* Region Level */}
                    <div className="flex items-center py-1.5 hover:bg-blue-50 border-b border-gray-100" style={{ paddingLeft: '8px', paddingRight: '12px' }}>
                      {hasChildren && renderToggle(region, 'region', isRegionExpanded)}
                      {!hasChildren && <span className="w-5" />}
                      <label className="flex items-center cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={filters.geographies.includes(region)}
                          onChange={() => handleToggle(region)}
                          className="mr-2.5 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-black">{region}</span>
                      </label>
                    </div>

                    {/* Sub-regions or direct countries */}
                    {isRegionExpanded && (
                      <>
                        {subRegions.map(subRegion => {
                          if (!hasSearchMatch(subRegion) && !matchesSearch(subRegion)) return null
                          const isSubExpanded = expandedSubRegions.has(subRegion)
                          const countries = geoHierarchy.countries[subRegion] || []

                          return (
                            <div key={subRegion}>
                              {/* Sub-region Level */}
                              <div className="flex items-center py-1.5 hover:bg-blue-50" style={{ paddingLeft: '28px', paddingRight: '12px' }}>
                                {countries.length > 0 && renderToggle(subRegion, 'subRegion', isSubExpanded)}
                                {countries.length === 0 && <span className="w-5" />}
                                <label className="flex items-center cursor-pointer flex-1">
                                  <input
                                    type="checkbox"
                                    checked={filters.geographies.includes(subRegion)}
                                    onChange={() => handleToggle(subRegion)}
                                    className="mr-2.5 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-800">{subRegion}</span>
                                </label>
                              </div>

                              {/* Countries under sub-region */}
                              {isSubExpanded && countries.map(country => renderCheckbox(country, 4))}
                            </div>
                          )
                        })}

                        {/* Direct countries under region (no sub-region) */}
                        {directCountries.map(country => renderCheckbox(country, 2))}
                      </>
                    )}
                  </div>
                )
              })
            ) : (
              // Flat list fallback when no hierarchy
              allLeafGeos.length === 0 ? (
                <div className="px-3 py-4 text-sm text-black text-center">
                  {searchTerm ? 'No geographies found matching your search' : 'No geographies available'}
                </div>
              ) : (
                allLeafGeos.filter(g => matchesSearch(g)).map(geography => renderCheckbox(geography, 0))
              )
            )}
          </div>
        </div>
      )}

      {/* Selected Count Badge */}
      {selectedCount > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs text-black">
            {selectedCount} {selectedCount === 1 ? 'geography' : 'geographies'} selected
          </span>
        </div>
      )}
    </div>
  )
}
