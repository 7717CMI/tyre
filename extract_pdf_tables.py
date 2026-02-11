"""
PDF Table Extractor for Global Solar Micro Inverter Market
Extracts ALL tables from the PDF and produces CSV files matching the dashboard format.

Output format matches:
Region,Segment,Sub-segment,Sub-segment 1,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031
"""

import PyPDF2
import re
import csv
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'C:\Users\vrashal\Desktop\New folder\template\Fahhhhh.PDF'
OUTPUT_DIR = r'C:\Users\vrashal\Desktop\New folder'

# Year columns in the dashboard CSV format
YEAR_COLS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031]

# All known segment names across all tables
KNOWN_SEGMENTS = {
    'By Technology': [
        'Single-Phase Micro Inverters',
        'Three-Phase Micro Inverters',
    ],
    'By Power Rating': [
        'Less than 250 W',
        '250 W - 500 W',
        'More than 500 W',
    ],
    'By Provider': [
        'Direct Sales through OEM',
        'Distributors and Wholesalers',
        'Retailers',
        'Solar Installers and Contractors',
    ],
    'By End User': [
        'Residential',
        'Commercial and Industrial',
        'Utility-scale',
    ],
    # "By Region" segments are context-dependent; handled separately in code
}

# Mapping of PDF text variations to canonical names
NAME_NORMALIZE = {
    'Single -Phase Micro Inverters': 'Single-Phase Micro Inverters',
    'Three -Phase Micro Inverters': 'Three-Phase Micro Inverters',
    'Utility -scale': 'Utility-scale',
    'Utility -Scale': 'Utility-scale',
    'Utility-Scale': 'Utility-scale',
    'Commercial And Industrial': 'Commercial and Industrial',
    'Less Than 250 W': 'Less than 250 W',
    'More Than 500 W': 'More than 500 W',
    'Direct Sales Through OEM': 'Direct Sales through OEM',
    'Rest of Middle East &Africa': 'Rest of Middle East & Africa',
    'Middle East &Africa': 'Middle East & Africa',
    'Middle East & \nAfrica': 'Middle East & Africa',
    'Rest of Asia-Pacific': 'Rest of Asia Pacific',
    'Rest of Latin-America': 'Rest of Latin America',
    'Rest of Middle East &\nAfrica': 'Rest of Middle East & Africa',
    'Rest of Middle East\n& Africa': 'Rest of Middle East & Africa',
    'U. S.': 'U.S.',
}


def build_table_registry():
    """Build complete registry of all tables and their metadata."""
    tables = []

    # ===== GLOBAL TABLES (Sections 5-8) =====
    tables.append((95, '5.2', 'Global', 'By Technology', 'value'))
    tables.append((96, '5.3', 'Global', 'By Technology', 'volume'))
    tables.append((103, '6.2', 'Global', 'By Power Rating', 'value'))
    tables.append((104, '6.3', 'Global', 'By Power Rating', 'volume'))
    tables.append((113, '7.2', 'Global', 'By Provider', 'value'))
    tables.append((114, '7.3', 'Global', 'By Provider', 'volume'))
    tables.append((124, '8.2', 'Global', 'By End User', 'value'))
    tables.append((125, '8.3', 'Global', 'By End User', 'volume'))
    tables.append((134, '9.1', 'Global', 'By Region', 'value'))

    # NORTH AMERICA
    for pg, tid, st, dt in [
        (139, '9.2', 'By Technology', 'value'), (140, '9.3', 'By Technology', 'volume'),
        (141, '9.4', 'By Power Rating', 'value'), (142, '9.5', 'By Power Rating', 'volume'),
        (143, '9.6', 'By Provider', 'value'), (144, '9.7', 'By Provider', 'volume'),
        (145, '9.8', 'By End User', 'value'), (146, '9.9', 'By End User', 'volume'),
        (147, '9.10', 'By Region', 'value'), (148, '9.11', 'By Region', 'volume'),
    ]:
        tables.append((pg, tid, 'North America', st, dt))

    # U.S.
    for pg, tid, st, dt in [
        (150, '9.12', 'By Technology', 'value'), (151, '9.13', 'By Technology', 'volume'),
        (152, '9.14', 'By Power Rating', 'value'), (153, '9.15', 'By Power Rating', 'volume'),
        (154, '9.16', 'By Provider', 'value'), (155, '9.17', 'By Provider', 'volume'),
        (156, '9.18', 'By End User', 'value'), (157, '9.19', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'U.S.', st, dt))

    # Canada
    for pg, tid, st, dt in [
        (159, '9.20', 'By Technology', 'value'), (160, '9.21', 'By Technology', 'volume'),
        (161, '9.22', 'By Power Rating', 'value'), (162, '9.23', 'By Power Rating', 'volume'),
        (163, '9.24', 'By Provider', 'value'), (164, '9.25', 'By Provider', 'volume'),
        (165, '9.26', 'By End User', 'value'), (166, '9.27', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Canada', st, dt))

    # EUROPE
    for pg, tid, st, dt in [
        (172, '9.28', 'By Technology', 'value'), (173, '9.29', 'By Technology', 'volume'),
        (174, '9.30', 'By Power Rating', 'value'), (175, '9.31', 'By Power Rating', 'volume'),
        (176, '9.32', 'By Provider', 'value'), (177, '9.33', 'By Provider', 'volume'),
        (178, '9.34', 'By End User', 'value'), (179, '9.35', 'By End User', 'volume'),
        (180, '9.36', 'By Region', 'value'), (181, '9.37', 'By Region', 'volume'),
    ]:
        tables.append((pg, tid, 'Europe', st, dt))

    # U.K.
    for pg, tid, st, dt in [
        (183, '9.38', 'By Technology', 'value'), (184, '9.39', 'By Technology', 'volume'),
        (185, '9.40', 'By Power Rating', 'value'), (186, '9.41', 'By Power Rating', 'volume'),
        (187, '9.42', 'By Provider', 'value'), (188, '9.43', 'By Provider', 'volume'),
        (189, '9.44', 'By End User', 'value'), (190, '9.45', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'U.K.', st, dt))

    # Germany
    for pg, tid, st, dt in [
        (192, '9.46', 'By Technology', 'value'), (193, '9.47', 'By Technology', 'volume'),
        (194, '9.48', 'By Power Rating', 'value'), (195, '9.49', 'By Power Rating', 'volume'),
        (196, '9.50', 'By Provider', 'value'), (197, '9.51', 'By Provider', 'volume'),
        (198, '9.52', 'By End User', 'value'), (199, '9.53', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Germany', st, dt))

    # Italy
    for pg, tid, st, dt in [
        (201, '9.54', 'By Technology', 'value'), (202, '9.55', 'By Technology', 'volume'),
        (203, '9.56', 'By Power Rating', 'value'), (204, '9.57', 'By Power Rating', 'volume'),
        (205, '9.58', 'By Provider', 'value'), (206, '9.59', 'By Provider', 'volume'),
        (207, '9.60', 'By End User', 'value'), (208, '9.61', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Italy', st, dt))

    # France
    for pg, tid, st, dt in [
        (210, '9.62', 'By Technology', 'value'), (211, '9.63', 'By Technology', 'volume'),
        (212, '9.64', 'By Power Rating', 'value'), (213, '9.65', 'By Power Rating', 'volume'),
        (214, '9.66', 'By Provider', 'value'), (215, '9.67', 'By Provider', 'volume'),
        (216, '9.68', 'By End User', 'value'), (217, '9.69', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'France', st, dt))

    # Spain
    for pg, tid, st, dt in [
        (219, '9.70', 'By Technology', 'value'), (220, '9.71', 'By Technology', 'volume'),
        (221, '9.72', 'By Power Rating', 'value'), (222, '9.73', 'By Power Rating', 'volume'),
        (223, '9.74', 'By Provider', 'value'), (224, '9.75', 'By Provider', 'volume'),
        (225, '9.76', 'By End User', 'value'), (226, '9.77', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Spain', st, dt))

    # Russia
    for pg, tid, st, dt in [
        (228, '9.78', 'By Technology', 'value'), (229, '9.79', 'By Technology', 'volume'),
        (230, '9.80', 'By Power Rating', 'value'), (231, '9.81', 'By Power Rating', 'volume'),
        (232, '9.82', 'By Provider', 'value'), (233, '9.83', 'By Provider', 'volume'),
        (234, '9.84', 'By End User', 'value'), (235, '9.85', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Russia', st, dt))

    # Rest of Europe
    for pg, tid, st, dt in [
        (237, '9.86', 'By Technology', 'value'), (238, '9.87', 'By Technology', 'volume'),
        (239, '9.88', 'By Power Rating', 'value'), (240, '9.89', 'By Power Rating', 'volume'),
        (241, '9.90', 'By Provider', 'value'), (242, '9.91', 'By Provider', 'volume'),
        (243, '9.92', 'By End User', 'value'), (244, '9.93', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Rest of Europe', st, dt))

    # ASIA PACIFIC
    for pg, tid, st, dt in [
        (249, '9.94', 'By Technology', 'value'), (250, '9.95', 'By Technology', 'volume'),
        (251, '9.96', 'By Power Rating', 'value'), (252, '9.97', 'By Power Rating', 'volume'),
        (253, '9.98', 'By Provider', 'value'), (254, '9.99', 'By Provider', 'volume'),
        (255, '9.100', 'By End User', 'value'), (256, '9.101', 'By End User', 'volume'),
        (257, '9.102', 'By Region', 'value'), (258, '9.103', 'By Region', 'volume'),
    ]:
        tables.append((pg, tid, 'Asia Pacific', st, dt))

    # China
    for pg, tid, st, dt in [
        (260, '9.104', 'By Technology', 'value'), (261, '9.105', 'By Technology', 'volume'),
        (262, '9.106', 'By Power Rating', 'value'), (263, '9.107', 'By Power Rating', 'volume'),
        (264, '9.108', 'By Provider', 'value'), (265, '9.109', 'By Provider', 'volume'),
        (266, '9.110', 'By End User', 'value'), (267, '9.111', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'China', st, dt))

    # India
    for pg, tid, st, dt in [
        (269, '9.112', 'By Technology', 'value'), (270, '9.113', 'By Technology', 'volume'),
        (271, '9.114', 'By Power Rating', 'value'), (272, '9.115', 'By Power Rating', 'volume'),
        (273, '9.116', 'By Provider', 'value'), (274, '9.117', 'By Provider', 'volume'),
        (275, '9.118', 'By End User', 'value'), (276, '9.119', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'India', st, dt))

    # Japan
    for pg, tid, st, dt in [
        (278, '9.120', 'By Technology', 'value'), (279, '9.121', 'By Technology', 'volume'),
        (280, '9.122', 'By Power Rating', 'value'), (281, '9.123', 'By Power Rating', 'volume'),
        (282, '9.124', 'By Provider', 'value'), (283, '9.125', 'By Provider', 'volume'),
        (284, '9.126', 'By End User', 'value'), (285, '9.127', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Japan', st, dt))

    # South Korea
    for pg, tid, st, dt in [
        (287, '9.128', 'By Technology', 'value'), (288, '9.129', 'By Technology', 'volume'),
        (289, '9.130', 'By Power Rating', 'value'), (290, '9.131', 'By Power Rating', 'volume'),
        (291, '9.132', 'By Provider', 'value'), (292, '9.133', 'By Provider', 'volume'),
        (293, '9.134', 'By End User', 'value'), (294, '9.135', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'South Korea', st, dt))

    # ASEAN
    for pg, tid, st, dt in [
        (296, '9.136', 'By Technology', 'value'), (297, '9.137', 'By Technology', 'volume'),
        (298, '9.138', 'By Power Rating', 'value'), (299, '9.139', 'By Power Rating', 'volume'),
        (300, '9.140', 'By Provider', 'value'), (301, '9.141', 'By Provider', 'volume'),
        (302, '9.142', 'By End User', 'value'), (303, '9.143', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'ASEAN', st, dt))

    # Australia
    for pg, tid, st, dt in [
        (305, '9.144', 'By Technology', 'value'), (306, '9.145', 'By Technology', 'volume'),
        (307, '9.146', 'By Power Rating', 'value'), (308, '9.147', 'By Power Rating', 'volume'),
        (309, '9.148', 'By Provider', 'value'), (310, '9.149', 'By Provider', 'volume'),
        (311, '9.150', 'By End User', 'value'), (312, '9.151', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Australia', st, dt))

    # Rest of Asia Pacific
    for pg, tid, st, dt in [
        (314, '9.152', 'By Technology', 'value'), (315, '9.153', 'By Technology', 'volume'),
        (316, '9.154', 'By Power Rating', 'value'), (317, '9.155', 'By Power Rating', 'volume'),
        (318, '9.156', 'By Provider', 'value'), (319, '9.157', 'By Provider', 'volume'),
        (320, '9.158', 'By End User', 'value'), (321, '9.159', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Rest of Asia Pacific', st, dt))

    # MIDDLE EAST & AFRICA
    for pg, tid, st, dt in [
        (326, '9.160', 'By Technology', 'value'), (327, '9.161', 'By Technology', 'volume'),
        (328, '9.162', 'By Power Rating', 'value'), (329, '9.163', 'By Power Rating', 'volume'),
        (330, '9.164', 'By Provider', 'value'), (331, '9.165', 'By Provider', 'volume'),
        (332, '9.166', 'By End User', 'value'), (333, '9.167', 'By End User', 'volume'),
        (334, '9.168', 'By Region', 'value'), (335, '9.169', 'By Region', 'volume'),
    ]:
        tables.append((pg, tid, 'Middle East & Africa', st, dt))

    # GCC
    for pg, tid, st, dt in [
        (337, '9.170', 'By Technology', 'value'), (338, '9.171', 'By Technology', 'volume'),
        (339, '9.172', 'By Power Rating', 'value'), (340, '9.173', 'By Power Rating', 'volume'),
        (341, '9.174', 'By Provider', 'value'), (342, '9.175', 'By Provider', 'volume'),
        (343, '9.176', 'By End User', 'value'), (344, '9.177', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'GCC', st, dt))

    # South Africa
    for pg, tid, st, dt in [
        (346, '9.178', 'By Technology', 'value'), (347, '9.179', 'By Technology', 'volume'),
        (348, '9.180', 'By Power Rating', 'value'), (349, '9.181', 'By Power Rating', 'volume'),
        (350, '9.182', 'By Provider', 'value'), (351, '9.183', 'By Provider', 'volume'),
        (352, '9.184', 'By End User', 'value'), (353, '9.185', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'South Africa', st, dt))

    # Rest of Middle East & Africa
    for pg, tid, st, dt in [
        (355, '9.186', 'By Technology', 'value'), (356, '9.187', 'By Technology', 'volume'),
        (357, '9.188', 'By Power Rating', 'value'), (358, '9.189', 'By Power Rating', 'volume'),
        (359, '9.190', 'By Provider', 'value'), (360, '9.191', 'By Provider', 'volume'),
        (361, '9.192', 'By End User', 'value'), (362, '9.193', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Rest of Middle East & Africa', st, dt))

    # LATIN AMERICA
    for pg, tid, st, dt in [
        (367, '9.194', 'By Technology', 'value'), (368, '9.195', 'By Technology', 'volume'),
        (369, '9.196', 'By Power Rating', 'value'), (370, '9.197', 'By Power Rating', 'volume'),
        (371, '9.198', 'By Provider', 'value'), (372, '9.199', 'By Provider', 'volume'),
        (373, '9.200', 'By End User', 'value'), (374, '9.201', 'By End User', 'volume'),
        (375, '9.202', 'By Region', 'value'), (376, '9.203', 'By Region', 'volume'),
    ]:
        tables.append((pg, tid, 'Latin America', st, dt))

    # Brazil
    for pg, tid, st, dt in [
        (378, '9.204', 'By Technology', 'value'), (379, '9.205', 'By Technology', 'volume'),
        (380, '9.206', 'By Power Rating', 'value'), (381, '9.207', 'By Power Rating', 'volume'),
        (382, '9.208', 'By Provider', 'value'), (383, '9.209', 'By Provider', 'volume'),
        (384, '9.210', 'By End User', 'value'), (385, '9.211', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Brazil', st, dt))

    # Argentina
    for pg, tid, st, dt in [
        (387, '9.212', 'By Technology', 'value'), (388, '9.213', 'By Technology', 'volume'),
        (389, '9.214', 'By Power Rating', 'value'), (390, '9.215', 'By Power Rating', 'volume'),
        (391, '9.216', 'By Provider', 'value'), (392, '9.217', 'By Provider', 'volume'),
        (393, '9.218', 'By End User', 'value'), (394, '9.219', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Argentina', st, dt))

    # Mexico
    for pg, tid, st, dt in [
        (396, '9.220', 'By Technology', 'value'), (397, '9.221', 'By Technology', 'volume'),
        (398, '9.222', 'By Power Rating', 'value'), (399, '9.223', 'By Power Rating', 'volume'),
        (400, '9.224', 'By Provider', 'value'), (401, '9.225', 'By Provider', 'volume'),
        (402, '9.226', 'By End User', 'value'), (403, '9.227', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Mexico', st, dt))

    # Rest of Latin America
    for pg, tid, st, dt in [
        (405, '9.228', 'By Technology', 'value'), (406, '9.229', 'By Technology', 'volume'),
        (407, '9.230', 'By Power Rating', 'value'), (408, '9.231', 'By Power Rating', 'volume'),
        (409, '9.232', 'By Provider', 'value'), (410, '9.233', 'By Provider', 'volume'),
        (411, '9.234', 'By End User', 'value'), (412, '9.235', 'By End User', 'volume'),
    ]:
        tables.append((pg, tid, 'Rest of Latin America', st, dt))

    return tables


def parse_number(s):
    """Parse a number string, handling commas."""
    s = s.strip().replace(',', '')
    try:
        return float(s)
    except ValueError:
        return None


def normalize_name(name):
    """Normalize segment/region names."""
    name = name.strip()
    # Remove leading/trailing dashes and spaces
    name = name.strip(' -')
    # Collapse multiple spaces
    name = re.sub(r'\s+', ' ', name)

    if name in NAME_NORMALIZE:
        return NAME_NORMALIZE[name]

    return name


def get_region_segments(parent_region):
    """Get expected country/sub-region segments for a By Region table based on its parent."""
    region_children = {
        'Global': ['North America', 'Europe', 'Asia Pacific', 'Middle East & Africa', 'Latin America'],
        'North America': ['U.S.', 'Canada'],
        'Europe': ['U.K.', 'Germany', 'Italy', 'France', 'Spain', 'Russia', 'Rest of Europe'],
        'Asia Pacific': ['China', 'India', 'Japan', 'South Korea', 'ASEAN', 'Australia', 'Rest of Asia Pacific'],
        'Middle East & Africa': ['GCC', 'South Africa', 'Rest of Middle East & Africa'],
        'Latin America': ['Brazil', 'Argentina', 'Mexico', 'Rest of Latin America'],
    }
    return region_children.get(parent_region, [])


def extract_table_data_smart(page_text, segment_type, parent_region=None):
    """
    Smart extraction that uses known segment names to correctly parse rows.
    Returns list of (segment_name, [13 year values]) tuples.
    Excludes 'Total' rows.
    """
    # Get the expected segment names for this type
    if segment_type == 'By Region':
        expected_segments = get_region_segments(parent_region) if parent_region else []
    else:
        expected_segments = KNOWN_SEGMENTS.get(segment_type, [])

    rows = []

    # Strategy: For each known segment, find the line in the text that matches it
    # and extract the 13 numbers following it
    full_text = page_text.replace('\n', ' ')

    # For each expected segment name, try to find it and extract numbers
    for canonical_name in expected_segments:
        # Build possible text patterns for this segment
        # Account for PDF text extraction artifacts (e.g., "Single -Phase" instead of "Single-Phase")
        patterns = [canonical_name]

        # Add variations with spaces around hyphens
        if '-' in canonical_name:
            patterns.append(canonical_name.replace('-', ' -'))
            patterns.append(canonical_name.replace('-', '- '))
            patterns.append(canonical_name.replace('-', ' - '))

        # Add variations from NAME_NORMALIZE (reverse lookup)
        for pdf_name, norm_name in NAME_NORMALIZE.items():
            if norm_name == canonical_name:
                patterns.append(pdf_name)

        found = False
        for pattern in patterns:
            # Escape special regex chars in the pattern
            escaped = re.escape(pattern)
            # Allow flexible whitespace between words
            escaped = escaped.replace(r'\ ', r'\s+')
            # Allow flexible & matching (& or &amp;)
            escaped = escaped.replace(r'\&', r'[&]')

            # Search for the pattern followed by numbers
            # Use word boundary or space to avoid partial matches
            # e.g. avoid matching "Europe" inside "Rest of Europe"
            try:
                # Try with boundary: pattern must be at start of line or preceded by newline/space
                match = re.search(r'(?:^|\n| )' + escaped + r'\s+([\d,]+\.?\d*)', full_text)
                if not match:
                    # Also try without boundary for short names
                    match = re.search(escaped + r'\s+([\d,]+\.?\d*)', full_text)
            except re.error:
                match = re.search(escaped + r'\s+([\d,]+\.?\d*)', full_text)

            if match:
                # Found the segment name; now extract all numbers AFTER the full pattern
                # We need to find where the segment name ends in the original text
                # The match includes the leading space/newline and the first number
                # We want to extract starting from where the actual segment text ends

                # Find the segment text in the match to determine its end position
                seg_match = re.search(escaped, full_text[match.start():])
                if seg_match:
                    seg_end_pos = match.start() + seg_match.end()
                else:
                    seg_end_pos = match.end()
                remaining = full_text[seg_end_pos:]

                # Extract all numbers from the remaining text
                all_nums = re.findall(r'[\d,]+\.?\d*', remaining)

                # We need exactly 13 year values (possibly followed by CAGR percentage)
                year_values = []
                for num_str in all_nums:
                    val = parse_number(num_str)
                    if val is not None:
                        year_values.append(val)
                    if len(year_values) >= 13:
                        break

                if len(year_values) == 13:
                    rows.append((canonical_name, year_values))
                    found = True
                    break

        if not found:
            print(f"    WARNING: Could not find segment '{canonical_name}' in table text")

    return rows


def determine_parent_region(region):
    """Determine the parent region for a country/sub-region."""
    country_to_region = {
        'U.S.': 'North America',
        'Canada': 'North America',
        'U.K.': 'Europe',
        'Germany': 'Europe',
        'Italy': 'Europe',
        'France': 'Europe',
        'Spain': 'Europe',
        'Russia': 'Europe',
        'Rest of Europe': 'Europe',
        'China': 'Asia Pacific',
        'India': 'Asia Pacific',
        'Japan': 'Asia Pacific',
        'South Korea': 'Asia Pacific',
        'ASEAN': 'Asia Pacific',
        'Australia': 'Asia Pacific',
        'Rest of Asia Pacific': 'Asia Pacific',
        'GCC': 'Middle East & Africa',
        'South Africa': 'Middle East & Africa',
        'Rest of Middle East & Africa': 'Middle East & Africa',
        'Brazil': 'Latin America',
        'Argentina': 'Latin America',
        'Mexico': 'Latin America',
        'Rest of Latin America': 'Latin America',
    }
    return country_to_region.get(region, None)


def main():
    print("Opening PDF...")
    reader = PyPDF2.PdfReader(PDF_PATH)
    print(f"PDF has {len(reader.pages)} pages")

    table_registry = build_table_registry()
    print(f"Registered {len(table_registry)} tables to extract")

    value_rows = []
    volume_rows = []

    success_count = 0
    fail_count = 0

    for page_num, table_id, region, segment_type, data_type in table_registry:
        page_idx = page_num - 1

        if page_idx >= len(reader.pages):
            print(f"  FAIL: Page {page_num} out of range for TABLE {table_id}")
            fail_count += 1
            continue

        text = reader.pages[page_idx].extract_text() or ''

        if not text.strip():
            print(f"  FAIL: Empty text on page {page_num} for TABLE {table_id}")
            fail_count += 1
            continue

        # Extract table rows using smart matching
        parsed_rows = extract_table_data_smart(text, segment_type, parent_region=region)

        if not parsed_rows:
            print(f"  FAIL: No data rows from page {page_num} TABLE {table_id} ({region} {segment_type} {data_type})")
            fail_count += 1
            continue

        # Build CSV rows
        for seg_name, year_vals in parsed_rows:
            if segment_type == 'By Region':
                if region == 'Global':
                    # Global by region table: list major regions
                    csv_row = [region, segment_type, seg_name, seg_name] + year_vals
                else:
                    # Regional by country table (e.g., North America -> U.S., Canada)
                    csv_row = ['Global', segment_type, region, seg_name] + year_vals
            else:
                csv_row = [region, segment_type, seg_name, seg_name] + year_vals

            if data_type == 'value':
                value_rows.append(csv_row)
            else:
                volume_rows.append(csv_row)

        success_count += 1

    print(f"\nExtraction complete: {success_count}/{len(table_registry)} tables successful, {fail_count} failed")
    print(f"Value rows: {len(value_rows)}")
    print(f"Volume rows: {len(volume_rows)}")

    # Write Value CSV
    header = ['Region', 'Segment', 'Sub-segment', 'Sub-segment 1'] + [str(y) for y in YEAR_COLS]

    value_csv_path = os.path.join(OUTPUT_DIR, 'Global-Solar-Micro-Inverter-Market-Value.csv')
    with open(value_csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        for row in value_rows:
            writer.writerow(row)
    print(f"\nWrote Value CSV: {value_csv_path} ({len(value_rows)} data rows)")

    # Write Volume CSV
    volume_csv_path = os.path.join(OUTPUT_DIR, 'Global-Solar-Micro-Inverter-Market-Volume.csv')
    with open(volume_csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        for row in volume_rows:
            writer.writerow(row)
    print(f"Wrote Volume CSV: {volume_csv_path} ({len(volume_rows)} data rows)")

    # Detailed summary
    print("\n=== EXTRACTION SUMMARY ===")
    regions_val = sorted(set(r[0] for r in value_rows))
    segments_val = sorted(set(r[1] for r in value_rows))
    subsegments_val = sorted(set(r[2] for r in value_rows))
    print(f"Value CSV:")
    print(f"  Regions ({len(regions_val)}): {regions_val}")
    print(f"  Segments ({len(segments_val)}): {segments_val}")
    print(f"  Sub-segments ({len(subsegments_val)}): {subsegments_val}")
    print(f"  Total rows: {len(value_rows)}")

    regions_vol = sorted(set(r[0] for r in volume_rows))
    segments_vol = sorted(set(r[1] for r in volume_rows))
    subsegments_vol = sorted(set(r[2] for r in volume_rows))
    print(f"\nVolume CSV:")
    print(f"  Regions ({len(regions_vol)}): {regions_vol}")
    print(f"  Segments ({len(segments_vol)}): {segments_vol}")
    print(f"  Sub-segments ({len(subsegments_vol)}): {subsegments_vol}")
    print(f"  Total rows: {len(volume_rows)}")

    # Verify a few key values
    print("\n=== SPOT CHECK ===")
    # Check Global Technology Value: Single-Phase should be 2422.1 in 2019
    for r in value_rows:
        if r[0] == 'Global' and r[1] == 'By Technology' and r[2] == 'Single-Phase Micro Inverters':
            print(f"Global/Technology/Single-Phase 2019={r[4]}, 2024={r[9]}, 2031={r[16]} (expect 2422.1, 3540.4, 7734.1)")
            break

    # Check Global Power Rating: Less than 250 W
    for r in value_rows:
        if r[0] == 'Global' and r[1] == 'By Power Rating' and r[2] == 'Less than 250 W':
            print(f"Global/Power Rating/Less than 250W 2019={r[4]}, 2024={r[9]}, 2031={r[16]} (expect 1710.9, 2572.3, 5846.4)")
            break

    # Check Global Provider: Solar Installers
    for r in value_rows:
        if r[0] == 'Global' and r[1] == 'By Provider' and r[2] == 'Solar Installers and Contractors':
            print(f"Global/Provider/Solar Installers 2019={r[4]}, 2024={r[9]}, 2031={r[16]} (expect 1188.0, 1888.2, 4595.7)")
            break


if __name__ == '__main__':
    main()
