'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useDashboardStore } from '@/lib/store'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'

interface GeoTreeNode {
  name: string
  children: GeoTreeNode[]
  level: number
}

export function GeographyMultiSelect() {
  const { data, filters, updateFilters } = useDashboardStore()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set())
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

  // Build hierarchical geography tree from "By Region" segment data
  const geoTree = useMemo((): GeoTreeNode[] => {
    if (!data?.dimensions?.segments) return []

    const byRegion = data.dimensions.segments['By Region']
    if (!byRegion?.hierarchy) {
      const allGeos = data.dimensions.geographies?.all_geographies || []
      return allGeos.map(name => ({ name, children: [], level: 0 }))
    }

    const hierarchy = byRegion.hierarchy
    const tree: GeoTreeNode[] = []

    // Global is always the root
    tree.push({ name: 'Global', children: [], level: 0 })

    // Build region → country tree from hierarchy
    for (const region of Object.keys(hierarchy)) {
      const countries = (hierarchy[region] || []).filter(c => c !== region)
      const regionNode: GeoTreeNode = {
        name: region,
        children: countries.map(country => ({
          name: country,
          children: [],
          level: 2
        })),
        level: 1
      }
      tree.push(regionNode)
    }

    return tree
  }, [data])

  // Build region-to-countries mapping for expanding region selections
  const regionToCountries = useMemo((): Record<string, string[]> => {
    const mapping: Record<string, string[]> = {}
    for (const node of geoTree) {
      if (node.children.length > 0) {
        mapping[node.name] = node.children.map(c => c.name)
      }
    }
    return mapping
  }, [geoTree])

  // Filter based on search
  const matchesSearch = (name: string) => {
    if (!searchTerm) return true
    return name.toLowerCase().includes(searchTerm.toLowerCase())
  }

  // Single-select: selecting a geography replaces the current selection
  // When a region is selected, expand to include its child countries for chart display
  const handleSelect = (geography: string) => {
    const isAlreadySelected = filters.geographies.length === 1 && filters.geographies[0] === geography

    if (isAlreadySelected) {
      // Deselect
      updateFilters({ geographies: [] })
    } else {
      // Select this geography
      // If it's a region with children, include the region + its countries
      // so the chart can show country-level comparison
      const children = regionToCountries[geography]
      if (children && children.length > 0) {
        updateFilters({ geographies: [geography, ...children] })
      } else {
        updateFilters({ geographies: [geography] })
      }
    }
  }

  // Check which geography the user explicitly selected (the first one, or the region)
  const userSelectedGeo = useMemo(() => {
    if (filters.geographies.length === 0) return null
    // If the first geography is a region key, that's the user's selection
    const first = filters.geographies[0]
    if (regionToCountries[first]) return first
    return first
  }, [filters.geographies, regionToCountries])

  const handleClearAll = () => {
    updateFilters({ geographies: [] })
  }

  const toggleExpand = (region: string) => {
    setExpandedRegions(prev => {
      const next = new Set(prev)
      if (next.has(region)) {
        next.delete(region)
      } else {
        next.add(region)
      }
      return next
    })
  }

  if (!data) return null

  // Check if any child of a region matches search
  const regionHasSearchMatch = (node: GeoTreeNode) => {
    if (matchesSearch(node.name)) return true
    return node.children.some(child => matchesSearch(child.name))
  }

  // Determine if a geography is selected (either directly or as part of region expansion)
  const isSelected = (name: string) => filters.geographies.includes(name)
  const isUserSelection = (name: string) => userSelectedGeo === name

  // Display label for the button
  const buttonLabel = userSelectedGeo
    ? userSelectedGeo
    : 'Select geography...'

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
      >
        <span className="text-sm text-black">
          {buttonLabel}
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
              onClick={handleClearAll}
              className="px-3 py-1 text-xs bg-gray-100 text-black rounded hover:bg-gray-200"
            >
              Clear
            </button>
          </div>

          {/* Hierarchical Geography Tree - Single Select */}
          <div className="overflow-y-auto max-h-64">
            {geoTree.length === 0 ? (
              <div className="px-3 py-4 text-sm text-black text-center">
                No geographies available
              </div>
            ) : (
              geoTree.map((node) => {
                if (searchTerm && !regionHasSearchMatch(node)) return null

                const hasChildren = node.children.length > 0
                const isExpanded = expandedRegions.has(node.name) || !!searchTerm

                return (
                  <div key={node.name}>
                    {/* Region/Global row */}
                    <div
                      className={`flex items-center py-2 hover:bg-blue-50 cursor-pointer border-t border-gray-100 ${
                        node.level === 0 ? 'bg-gray-50 font-medium' : ''
                      } ${isUserSelection(node.name) ? 'bg-blue-100' : ''}`}
                      style={{ paddingLeft: `${node.level * 16 + 12}px`, paddingRight: '12px' }}
                    >
                      {/* Expand/collapse toggle */}
                      {hasChildren ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleExpand(node.name) }}
                          className="mr-1 p-0.5 hover:bg-gray-200 rounded"
                        >
                          {isExpanded
                            ? <ChevronDown className="h-3 w-3 text-gray-500" />
                            : <ChevronRight className="h-3 w-3 text-gray-500" />
                          }
                        </button>
                      ) : (
                        <span className="mr-1 w-4" />
                      )}

                      <label className="flex items-center flex-1 cursor-pointer">
                        <input
                          type="radio"
                          name="geography-select"
                          checked={isUserSelection(node.name)}
                          onChange={() => handleSelect(node.name)}
                          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className={`text-sm text-black flex-1 ${node.level === 1 ? 'font-medium' : ''}`}>
                          {node.name}
                        </span>
                        {isUserSelection(node.name) && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </label>
                    </div>

                    {/* Country children (indented) */}
                    {hasChildren && isExpanded && node.children.map(child => {
                      if (searchTerm && !matchesSearch(child.name)) return null

                      return (
                        <label
                          key={child.name}
                          className={`flex items-center py-1.5 hover:bg-blue-50 cursor-pointer border-t border-gray-50 ${
                            isUserSelection(child.name) ? 'bg-blue-100' : ''
                          }`}
                          style={{ paddingLeft: `${child.level * 16 + 28}px`, paddingRight: '12px' }}
                        >
                          <input
                            type="radio"
                            name="geography-select"
                            checked={isUserSelection(child.name)}
                            onChange={() => handleSelect(child.name)}
                            className="mr-2 h-3.5 w-3.5 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 flex-1">{child.name}</span>
                          {isUserSelection(child.name) && (
                            <Check className="h-3.5 w-3.5 text-blue-600" />
                          )}
                        </label>
                      )
                    })}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Selected geography display */}
      {userSelectedGeo && (
        <div className="mt-2">
          <span className="text-xs text-black">
            Selected: {userSelectedGeo}
            {regionToCountries[userSelectedGeo] && (
              <span className="text-gray-500"> ({regionToCountries[userSelectedGeo].length} countries)</span>
            )}
          </span>
        </div>
      )}
    </div>
  )
}
