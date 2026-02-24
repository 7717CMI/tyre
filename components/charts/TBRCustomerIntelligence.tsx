'use client'

import { Download } from 'lucide-react'

// ============================================================
// Brand/Product Pricing Table for Germany
// ============================================================

interface BrandProductRow {
  countryName: string
  brandType: string
  brandName: string
  tbrTireType: string
  rimDiameterClass: string
  b2b2023: string
  b2b2024: string
  b2b2025: string
  retail2023: string
  retail2024: string
  retail2025: string
  oemBusiness2025: string
  aftermarket2025: string
  marketShare2025: string
}

const brandProductData: BrandProductRow[] = [
  // A-Tier (Premium Brands) - Brand-1: Continental
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Continental', tbrTireType: 'Conti EcoPlus HS3', rimDiameterClass: 'Up to 19.5 inches', b2b2023: '$385', b2b2024: '$395', b2b2025: '$410', retail2023: '$445', retail2024: '$460', retail2025: '$475', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Continental', tbrTireType: 'Conti Hybrid HD3', rimDiameterClass: 'Up to 19.5 inches', b2b2023: '$395', b2b2024: '$405', b2b2025: '$420', retail2023: '$455', retail2024: '$470', retail2025: '$485', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Continental', tbrTireType: 'Conti EcoPlus HT3', rimDiameterClass: '20–22.5 inches', b2b2023: '$420', b2b2024: '$435', b2b2025: '$450', retail2023: '$485', retail2024: '$500', retail2025: '$520', oemBusiness2025: 'US$285M', aftermarket2025: 'US$195M', marketShare2025: '18.5%' },
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Continental', tbrTireType: 'Conti CrossTrac HD3', rimDiameterClass: '20–22.5 inches', b2b2023: '$440', b2b2024: '$455', b2b2025: '$470', retail2023: '$510', retail2024: '$525', retail2025: '$545', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Continental', tbrTireType: 'Conti Coach HA3', rimDiameterClass: '24.5 inches and above', b2b2023: '$475', b2b2024: '$490', b2b2025: '$510', retail2023: '$550', retail2024: '$565', retail2025: '$585', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Continental', tbrTireType: 'Conti Urban HA3', rimDiameterClass: '24.5 inches and above', b2b2023: '$490', b2b2024: '$505', b2b2025: '$525', retail2023: '$565', retail2024: '$580', retail2025: '$600', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  // A-Tier - Brand-2: Michelin
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Michelin', tbrTireType: 'X Line Energy Z', rimDiameterClass: 'Up to 19.5 inches', b2b2023: '$390', b2b2024: '$400', b2b2025: '$415', retail2023: '$450', retail2024: '$465', retail2025: '$480', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Michelin', tbrTireType: 'X Multi Energy D', rimDiameterClass: 'Up to 19.5 inches', b2b2023: '$400', b2b2024: '$410', b2b2025: '$425', retail2023: '$460', retail2024: '$475', retail2025: '$490', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Michelin', tbrTireType: 'X Multi HD D', rimDiameterClass: '20–22.5 inches', b2b2023: '$430', b2b2024: '$445', b2b2025: '$460', retail2023: '$495', retail2024: '$510', retail2025: '$530', oemBusiness2025: 'US$270M', aftermarket2025: 'US$180M', marketShare2025: '17.2%' },
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Michelin', tbrTireType: 'X Works XDY', rimDiameterClass: '20–22.5 inches', b2b2023: '$450', b2b2024: '$465', b2b2025: '$480', retail2023: '$520', retail2024: '$535', retail2025: '$555', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Michelin', tbrTireType: 'X Coach XZ', rimDiameterClass: '24.5 inches and above', b2b2023: '$485', b2b2024: '$500', b2b2025: '$520', retail2023: '$560', retail2024: '$575', retail2025: '$595', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  // A-Tier - Brand-N: Bridgestone
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Bridgestone', tbrTireType: 'Ecopia H-Steer 002', rimDiameterClass: 'Up to 19.5 inches', b2b2023: '$375', b2b2024: '$385', b2b2025: '$400', retail2023: '$435', retail2024: '$445', retail2025: '$460', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Bridgestone', tbrTireType: 'Duravis R-Drive 002', rimDiameterClass: '20–22.5 inches', b2b2023: '$415', b2b2024: '$430', b2b2025: '$445', retail2023: '$480', retail2024: '$495', retail2025: '$510', oemBusiness2025: 'US$240M', aftermarket2025: 'US$165M', marketShare2025: '15.8%' },
  { countryName: 'Germany', brandType: 'A-Tier (Premium Brands)', brandName: 'Bridgestone', tbrTireType: 'Duravis R-Trailer 002', rimDiameterClass: '24.5 inches and above', b2b2023: '$460', b2b2024: '$475', b2b2025: '$490', retail2023: '$530', retail2024: '$545', retail2025: '$565', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },

  // Tier (Mid-Range Brands) - Brand-1: Hankook
  { countryName: 'Germany', brandType: 'B Tier (Mid-Range Brands)', brandName: 'Hankook', tbrTireType: 'SmartFlex AH31', rimDiameterClass: 'Up to 19.5 inches', b2b2023: '$310', b2b2024: '$320', b2b2025: '$330', retail2023: '$360', retail2024: '$370', retail2025: '$385', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'B Tier (Mid-Range Brands)', brandName: 'Hankook', tbrTireType: 'SmartFlex DH31', rimDiameterClass: 'Up to 19.5 inches', b2b2023: '$320', b2b2024: '$330', b2b2025: '$340', retail2023: '$370', retail2024: '$380', retail2025: '$395', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'B Tier (Mid-Range Brands)', brandName: 'Hankook', tbrTireType: 'SmartWork DM09', rimDiameterClass: '20–22.5 inches', b2b2023: '$345', b2b2024: '$355', b2b2025: '$370', retail2023: '$400', retail2024: '$410', retail2025: '$425', oemBusiness2025: 'US$165M', aftermarket2025: 'US$120M', marketShare2025: '10.8%' },
  { countryName: 'Germany', brandType: 'B Tier (Mid-Range Brands)', brandName: 'Hankook', tbrTireType: 'SmartWork AM09', rimDiameterClass: '20–22.5 inches', b2b2023: '$355', b2b2024: '$365', b2b2025: '$380', retail2023: '$410', retail2024: '$420', retail2025: '$435', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'B Tier (Mid-Range Brands)', brandName: 'Hankook', tbrTireType: 'SmartFlex TH31', rimDiameterClass: '24.5 inches and above', b2b2023: '$380', b2b2024: '$390', b2b2025: '$405', retail2023: '$440', retail2024: '$450', retail2025: '$465', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'B Tier (Mid-Range Brands)', brandName: 'Hankook', tbrTireType: 'SmartControl AW02', rimDiameterClass: '24.5 inches and above', b2b2023: '$395', b2b2024: '$405', b2b2025: '$420', retail2023: '$455', retail2024: '$465', retail2025: '$480', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  // Tier (Mid-Range) - Brand-2: Prometeon (Pirelli)
  { countryName: 'Germany', brandType: 'C Tier (Economy Brands)', brandName: 'Prometeon', tbrTireType: 'Itineris S90', rimDiameterClass: 'Up to 19.5 inches', b2b2023: '$305', b2b2024: '$315', b2b2025: '$325', retail2023: '$355', retail2024: '$365', retail2025: '$375', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'C Tier (Economy Brands)', brandName: 'Prometeon', tbrTireType: 'Itineris T90', rimDiameterClass: '20–22.5 inches', b2b2023: '$340', b2b2024: '$350', b2b2025: '$365', retail2023: '$395', retail2024: '$405', retail2025: '$420', oemBusiness2025: 'US$125M', aftermarket2025: 'US$90M', marketShare2025: '8.2%' },
  { countryName: 'Germany', brandType: 'C Tier (Economy Brands)', brandName: 'Prometeon', tbrTireType: 'FR:01 II', rimDiameterClass: '20–22.5 inches', b2b2023: '$350', b2b2024: '$360', b2b2025: '$375', retail2023: '$405', retail2024: '$415', retail2025: '$430', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'C Tier (Economy Brands)', brandName: 'Prometeon', tbrTireType: 'Itineris D90', rimDiameterClass: 'Up to 19.5 inches', b2b2023: '$315', b2b2024: '$325', b2b2025: '$335', retail2023: '$365', retail2024: '$375', retail2025: '$385', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
  { countryName: 'Germany', brandType: 'C Tier (Economy Brands)', brandName: 'Prometeon', tbrTireType: 'TR:01 II', rimDiameterClass: '24.5 inches and above', b2b2023: '$370', b2b2024: '$380', b2b2025: '$395', retail2023: '$430', retail2024: '$440', retail2025: '$455', oemBusiness2025: '', aftermarket2025: '', marketShare2025: '' },
]

// ============================================================
// Component
// ============================================================

interface TBRCustomerIntelligenceProps {
  title?: string
  height?: number
}

export default function TBRCustomerIntelligence({ title, height = 600 }: TBRCustomerIntelligenceProps) {
  const exportPricingCSV = () => {
    const headers = ['Country Name', 'Brand Type', 'Brand Name', 'TBR Tire Types', 'Rim Diameter Class', 'B2B 2023', 'B2B 2024', 'B2B 2025', 'Retail 2023', 'Retail 2024', 'Retail 2025', 'OEM Business-2025', 'Aftermarket-2025', 'Market Share (%) 2025']
    const rows = brandProductData.map(r => [
      r.countryName, r.brandType, r.brandName, r.tbrTireType, r.rimDiameterClass,
      r.b2b2023, r.b2b2024, r.b2b2025, r.retail2023, r.retail2024, r.retail2025,
      r.oemBusiness2025, r.aftermarket2025, r.marketShare2025
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `brand-pricing-germany-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Group brand data by brandType for rowspan rendering
  const getBrandTypeGroups = () => {
    const groups: { brandType: string; rows: BrandProductRow[]; brandGroups: { brandName: string; rows: BrandProductRow[] }[] }[] = []
    let currentBrandType = ''
    let currentBrandName = ''

    brandProductData.forEach(row => {
      if (row.brandType !== currentBrandType) {
        currentBrandType = row.brandType
        currentBrandName = ''
        groups.push({ brandType: row.brandType, rows: [], brandGroups: [] })
      }
      const group = groups[groups.length - 1]
      group.rows.push(row)
      if (row.brandName !== currentBrandName) {
        currentBrandName = row.brandName
        group.brandGroups.push({ brandName: row.brandName, rows: [] })
      }
      group.brandGroups[group.brandGroups.length - 1].rows.push(row)
    })
    return groups
  }

  const brandTypeGroups = getBrandTypeGroups()

  const getBrandTypeColor = (brandType: string) => {
    if (brandType.includes('Premium')) return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' }
    if (brandType.includes('Mid-Range')) return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' }
    return { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' }
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-black mb-2">{title || 'Customer Intelligence'}</h2>
      <div className="mb-4 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Note:</span> This type of data and intelligence will be provided according to every country.
        </p>
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Note:</span> Brand tier classification (A-tier, B-tier, C-tier) will be based on the company's brand segmentation and the brand's market presence in the respective country.
        </p>
      </div>

      <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Brand Pricing & Financial Performance - Germany</h3>
            <button
              onClick={exportPricingCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto border rounded-lg" style={{ maxHeight: height }}>
            <table className="min-w-full border-collapse">
              <thead className="sticky top-0 z-10">
                {/* Top-level header */}
                <tr>
                  <th rowSpan={3} className="bg-gray-100 border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-black min-w-[100px]">Country Name</th>
                  <th rowSpan={3} className="bg-gray-100 border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-black min-w-[140px]">Brand Type</th>
                  <th rowSpan={3} className="bg-gray-100 border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-black min-w-[110px]">Brand Name</th>
                  <th rowSpan={3} className="bg-gray-100 border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-black min-w-[150px]">TBR Tire Types</th>
                  <th rowSpan={3} className="bg-gray-100 border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-black min-w-[140px]">Rim Diameter Class</th>
                  <th colSpan={6} className="bg-yellow-300 border border-gray-300 px-3 py-2 text-center text-sm font-bold text-black">
                    Average Prices US$
                  </th>
                  <th colSpan={2} className="bg-cyan-400 border border-gray-300 px-3 py-2 text-center text-sm font-bold text-black">
                    Financial Performance
                  </th>
                  <th rowSpan={3} className="bg-emerald-400 border border-gray-300 px-3 py-2 text-center text-sm font-bold text-black min-w-[120px]">
                    Market Share (%), 2025
                  </th>
                </tr>
                {/* Second-level header */}
                <tr>
                  <th colSpan={3} className="bg-yellow-200 border border-gray-300 px-3 py-1.5 text-center text-xs font-semibold text-black">B2B</th>
                  <th colSpan={3} className="bg-yellow-100 border border-gray-300 px-3 py-1.5 text-center text-xs font-semibold text-black">Retail</th>
                  <th rowSpan={2} className="bg-cyan-200 border border-gray-300 px-2 py-1.5 text-center text-xs font-semibold text-black min-w-[120px]">OEM Business-2025</th>
                  <th rowSpan={2} className="bg-cyan-200 border border-gray-300 px-2 py-1.5 text-center text-xs font-semibold text-black min-w-[120px]">Aftermarket-2025</th>
                </tr>
                {/* Year headers */}
                <tr className="bg-gray-50">
                  <th className="bg-yellow-50 border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-black min-w-[70px]">2023</th>
                  <th className="bg-yellow-50 border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-black min-w-[70px]">2024</th>
                  <th className="bg-yellow-50 border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-black min-w-[70px]">2025</th>
                  <th className="bg-yellow-50 border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-black min-w-[70px]">2023</th>
                  <th className="bg-yellow-50 border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-black min-w-[70px]">2024</th>
                  <th className="bg-yellow-50 border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-black min-w-[70px]">2025</th>
                </tr>
              </thead>
              <tbody>
                {brandTypeGroups.map((btGroup) => {
                  const colors = getBrandTypeColor(btGroup.brandType)
                  let btRowIndex = 0

                  return btGroup.brandGroups.map((bnGroup, bnIdx) => {
                    return bnGroup.rows.map((row, rowIdx) => {
                      const isFirstRowOfBrandType = btRowIndex === 0
                      const isFirstRowOfBrand = rowIdx === 0
                      btRowIndex++

                      return (
                        <tr key={`${btGroup.brandType}-${bnGroup.brandName}-${rowIdx}`} className="hover:bg-gray-50">
                          {/* Country Name - only first row of brand type */}
                          {isFirstRowOfBrandType && (
                            <td rowSpan={btGroup.rows.length} className="border border-gray-300 px-3 py-2 text-sm font-medium text-black align-top bg-white">
                              Germany
                            </td>
                          )}
                          {/* Brand Type - only first row of brand type */}
                          {isFirstRowOfBrandType && (
                            <td rowSpan={btGroup.rows.length} className={`border border-gray-300 px-3 py-2 text-sm font-medium ${colors.text} align-top ${colors.bg}`}>
                              {btGroup.brandType}
                            </td>
                          )}
                          {/* Brand Name - only first row of brand */}
                          {isFirstRowOfBrand && (
                            <td rowSpan={bnGroup.rows.length} className="border border-gray-300 px-3 py-2 text-sm font-medium text-black align-top">
                              {bnGroup.brandName}
                            </td>
                          )}
                          {/* Product & Rim */}
                          <td className="border border-gray-300 px-3 py-2 text-sm text-black">{row.tbrTireType}</td>
                          <td className="border border-gray-300 px-3 py-2 text-sm text-black">{row.rimDiameterClass}</td>
                          {/* B2B Prices */}
                          <td className="border border-gray-300 px-3 py-2 text-sm text-black text-center">{row.b2b2023}</td>
                          <td className="border border-gray-300 px-3 py-2 text-sm text-black text-center">{row.b2b2024}</td>
                          <td className="border border-gray-300 px-3 py-2 text-sm text-black text-center">{row.b2b2025}</td>
                          {/* Retail Prices */}
                          <td className="border border-gray-300 px-3 py-2 text-sm text-black text-center">{row.retail2023}</td>
                          <td className="border border-gray-300 px-3 py-2 text-sm text-black text-center">{row.retail2024}</td>
                          <td className="border border-gray-300 px-3 py-2 text-sm text-black text-center">{row.retail2025}</td>
                          {/* Financial Performance & Market Share - only on brand level */}
                          {isFirstRowOfBrand && (() => {
                            const brandFinData = bnGroup.rows.find(r => r.oemBusiness2025 || r.aftermarket2025 || r.marketShare2025) || row
                            return (
                              <>
                                <td rowSpan={bnGroup.rows.length} className="border border-gray-300 px-3 py-2 text-sm text-black text-center font-medium align-middle">
                                  {brandFinData.oemBusiness2025 || '—'}
                                </td>
                                <td rowSpan={bnGroup.rows.length} className="border border-gray-300 px-3 py-2 text-sm text-black text-center font-medium align-middle">
                                  {brandFinData.aftermarket2025 || '—'}
                                </td>
                                <td rowSpan={bnGroup.rows.length} className="border border-gray-300 px-3 py-2 text-sm text-black text-center font-medium align-middle">
                                  {brandFinData.marketShare2025 || '—'}
                                </td>
                              </>
                            )
                          })()}
                        </tr>
                      )
                    })
                  })
                })}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  )
}
