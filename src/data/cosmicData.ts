import { CelestialBody, Constellation, Exoplanet, SpaceSound, ExplorerProfile, SmallBodyItem } from '../types';

export const HERO_ASSETS = {
  heroDeepCosmos: '/src/assets/images/hero_deep_cosmos_1795355603574.jpg',
  heroSpaceBackdrop: '/src/assets/images/hero_space_backdrop_1795502706297.jpg',
  loginCosmosBackdrop: '/src/assets/images/login_cosmos_backdrop_1795502706564.jpg',
};

export const CELESTIAL_BODIES: CelestialBody[] = [
  {
    id: 'sun-view',
    name: 'Sun',
    type: 'Star',
    dist: '0 km',
    distAU: 0,
    gravity: '274.0 m/s²',
    temp: '5,500°C',
    details: 'The heart of our solar system, accounting for 99.86% of its total mass. It is a G-type main-sequence star (G2V) powered by nuclear fusion of hydrogen into helium.',
    surface: "Composed entirely of plasma with intense magnetic flux loops and sunspot activity. The visible photosphere is a boiling sea of granular convection cells.",
    atmosphere: 'Consists of the chromosphere and the corona, which extends millions of kilometers into space at temperatures reaching 1 to 3 million kelvin.',
    moons: 0,
    moonList: [],
    discovery: 'Known since antiquity.',
    day: '25-35 Earth days (differential rotation)',
    orbitalPeriodDays: 0,
    radiusKm: 696340,
    color: '#FDB813',
    imageUrl: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000790/GSFC_20171208_Archive_e000790~medium.jpg',
    eyesTarget: 'sun',
    imageHint: 'sun surface'
  },
  {
    id: 'mercury-view',
    name: 'Mercury',
    type: 'Terrestrial',
    dist: '57.9m km',
    distAU: 0.387,
    gravity: '3.7 m/s²',
    temp: '-173 to 427°C',
    details: 'The smallest and innermost planet in the Solar System. Heavily cratered with no natural satellites, exhibiting extreme temperature swings between day and night.',
    surface: 'Silicate crust with a massive metallic iron core comprising about 85% of the planetary radius.',
    atmosphere: 'Extremely thin exosphere containing trace sodium, magnesium, oxygen, and helium.',
    moons: 0,
    moonList: [],
    discovery: 'Recorded by Assyrian astronomers in 14th century BCE.',
    day: '58.6 Earth days',
    orbitalPeriodDays: 87.97,
    radiusKm: 2439.7,
    color: '#9CA3AF',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA15162/PIA15162~medium.jpg',
    eyesTarget: 'mercury',
    imageHint: 'mercury planet'
  },
  {
    id: 'venus-view',
    name: 'Venus',
    type: 'Terrestrial',
    dist: '108.2m km',
    distAU: 0.723,
    gravity: '8.87 m/s²',
    temp: '464°C',
    details: 'Earth’s twin in size and mass, but enveloped in an oppressive runaway greenhouse atmosphere that makes its surface hotter than Mercury.',
    surface: 'Vast volcanic basalt plains, massive shield volcanoes (like Maat Mons), and extensive tessera terrain.',
    atmosphere: '96.5% Carbon Dioxide with sulfuric acid clouds and surface pressures 92 times greater than Earth.',
    moons: 0,
    moonList: [],
    discovery: 'Known since antiquity; tracked by ancient Maya and Babylonians.',
    day: '243 Earth days (retrograde)',
    orbitalPeriodDays: 224.7,
    radiusKm: 6051.8,
    color: '#FBBF24',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~medium.jpg',
    eyesTarget: 'venus',
    imageHint: 'venus planet'
  },
  {
    id: 'earth-view',
    name: 'Earth',
    type: 'Terrestrial',
    dist: '149.6m km',
    distAU: 1.0,
    gravity: '9.81 m/s²',
    temp: '14.9°C (avg)',
    details: 'Our home haven. The only known cosmic cradle harboring active biosphere systems, abundant liquid water oceans, and tectonic crustal recycling.',
    surface: '70.8% liquid ocean water, 29.2% continental crust with mountain belts, rainforests, polar ice sheets, and deserts.',
    atmosphere: '78.08% Nitrogen, 20.95% Oxygen, 0.93% Argon, and greenhouse water vapor / CO₂ shield.',
    moons: 1,
    moonList: [
      { name: 'The Moon (Luna)', details: 'Earth’s only natural satellite; stabilizes Earth’s axial tilt and drives oceanic tides.' }
    ],
    discovery: 'Known since antiquity.',
    day: '23.93 hours',
    orbitalPeriodDays: 365.25,
    radiusKm: 6371.0,
    color: '#38BDF8',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA18033/PIA18033~medium.jpg',
    eyesTarget: 'earth',
    imageHint: 'earth space'
  },
  {
    id: 'mars-view',
    name: 'Mars',
    type: 'Terrestrial',
    dist: '227.9m km',
    distAU: 1.524,
    gravity: '3.72 m/s²',
    temp: '-65°C',
    details: 'The Red Planet. Host to ancient lakebeds, fossil delta channels, and the solar system’s grandest volcano (Olympus Mons, 21.9 km high).',
    surface: 'Oxidized iron dust (rust) over volcanic basalt with massive rift valleys (Valles Marineris).',
    atmosphere: 'Thin CO₂ (95.3%), Nitrogen (2.6%), Argon (1.9%), with global dust storms.',
    moons: 2,
    moonList: [
      { name: 'Phobos', details: 'Larger, heavily cratered inner moon spiraling inward toward Mars.' },
      { name: 'Deimos', details: 'Smaller, outer asteroid-like moon in stable orbit.' }
    ],
    discovery: 'Known since antiquity.',
    day: '24.62 hours',
    orbitalPeriodDays: 687.0,
    radiusKm: 3389.5,
    color: '#EF4444',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA02653/PIA02653~medium.jpg',
    eyesTarget: 'mars',
    imageHint: 'mars planet'
  },
  {
    id: 'ceres-view',
    name: 'Ceres',
    type: 'Dwarf Planet',
    dist: '413.7m km',
    distAU: 2.767,
    gravity: '0.27 m/s²',
    temp: '-105°C',
    details: 'The queen of the main asteroid belt between Mars and Jupiter. Ceres accounts for one-third of the belt’s total mass and contains substantial subsurface water ice.',
    surface: 'Mixture of water ice and hydrated minerals (carbonates and clays) featuring bright sodium carbonate deposits inside Occator Crater.',
    atmosphere: 'Transient water vapor exosphere produced by ice sublimation.',
    moons: 0,
    moonList: [],
    discovery: 'Discovered by Giuseppe Piazzi on January 1, 1801.',
    day: '9.07 hours',
    orbitalPeriodDays: 1682,
    radiusKm: 469.7,
    color: '#D1D5DB',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA21079/PIA21079~small.jpg',
    eyesTarget: '1_ceres',
    imageHint: 'ceres asteroid belt'
  },
  {
    id: 'jupiter-view',
    name: 'Jupiter',
    type: 'Gas Giant',
    dist: '778.6m km',
    distAU: 5.204,
    gravity: '24.79 m/s²',
    temp: '-110°C',
    details: 'The colossal titan of the solar system. Over 2.5 times more massive than all other planets combined, with a colossal magnetosphere and hundreds of vortex storms.',
    surface: 'No true solid surface; hydrogen and helium gases condense under extreme pressures into liquid metallic hydrogen surrounding a dense rock core.',
    atmosphere: 'Hydrogen (89%), Helium (10%), with vibrant ammonium hydrosulfide cloud bands and the Great Red Spot anticyclone.',
    moons: 95,
    moonList: [
      { name: 'Europa', details: 'Smooth water ice shell harboring a global salty subsurface ocean with twice Earth’s water.' },
      { name: 'Ganymede', details: 'Largest moon in the Solar System, bigger than Mercury, with its own magnetic field.' },
      { name: 'Callisto', details: 'Heavily cratered, geologically ancient ice world.' },
      { name: 'Io', details: 'Most volcanically active body in the Solar System, driven by tidal flexing.' }
    ],
    discovery: 'Known since antiquity; Galilean moons discovered 1610.',
    day: '9.93 hours',
    orbitalPeriodDays: 4333,
    radiusKm: 69911,
    color: '#F97316',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA04866/PIA04866~medium.jpg',
    eyesTarget: 'jupiter',
    imageHint: 'jupiter planet'
  },
  {
    id: 'saturn-view',
    name: 'Saturn',
    type: 'Gas Giant',
    dist: '1.43b km',
    distAU: 9.537,
    gravity: '10.44 m/s²',
    temp: '-140°C',
    details: 'Adorned with the most intricate and dazzling ring system in the cosmos, spanning 282,000 km across yet averaging only 10 meters in thickness.',
    surface: 'Gas giant architecture with a deep metallic hydrogen layer and core of iron-nickel and silicate rock.',
    atmosphere: 'Atmosphere dominated by hydrogen and helium with golden ammonia-ice clouds and a persistent hexagonal polar jet stream.',
    moons: 146,
    moonList: [
      { name: 'Titan', details: 'Massive moon with a dense nitrogen atmosphere, methane rain, and hydrocarbon lakes.' },
      { name: 'Enceladus', details: 'Active cryovolcanic geysers erupting water vapor and organics from a subsurface sea.' },
      { name: 'Mimas', details: 'Cratered moon featuring the giant Herschel impact basin resembling the Death Star.' }
    ],
    discovery: 'Known since antiquity; rings identified by Christiaan Huygens in 1655.',
    day: '10.7 hours',
    orbitalPeriodDays: 10759,
    radiusKm: 58232,
    color: '#FBBF24',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA08206/PIA08206~small.jpg',
    eyesTarget: 'saturn',
    imageHint: 'saturn planet'
  },
  {
    id: 'uranus-view',
    name: 'Uranus',
    type: 'Ice Giant',
    dist: '2.87b km',
    distAU: 19.19,
    gravity: '8.69 m/s²',
    temp: '-195°C',
    details: 'The tilted ice giant. Its rotation axis is tipped 97.8 degrees onto its side, causing extreme 42-year seasons of continuous sunlight and darkness.',
    surface: 'Supercritical slush fluid of water, ammonia, and methane over a rocky silicate-iron core.',
    atmosphere: 'Hydrogen, Helium, and Methane gas that absorbs red light, lending the planet its serene aquamarine cyan color.',
    moons: 28,
    moonList: [
      { name: 'Titania', details: 'Largest Uranian moon, marked by fault valleys and giant scarps.' },
      { name: 'Oberon', details: 'Heavily cratered outer moon with dark carbonaceous deposits.' },
      { name: 'Miranda', details: 'Extreme canyon topography with Verona Rupes, the tallest cliff in the Solar System (20 km high).' }
    ],
    discovery: 'Discovered by William Herschel on March 13, 1781.',
    day: '17.24 hours (retrograde)',
    orbitalPeriodDays: 30687,
    radiusKm: 25362,
    color: '#22D3EE',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA18182/PIA18182~medium.jpg',
    eyesTarget: 'uranus',
    imageHint: 'uranus planet'
  },
  {
    id: 'neptune-view',
    name: 'Neptune',
    type: 'Ice Giant',
    dist: '4.50b km',
    distAU: 30.07,
    gravity: '11.15 m/s²',
    temp: '-201°C',
    details: 'The outermost major planet. Neptune harbors supersonic winds exceeding 2,100 km/h and dark vortex storm systems in its azure methane atmosphere.',
    surface: 'Fluid icy mantle composed of compressed water, ammonia, and methane ice surrounding an Earth-mass rocky core.',
    atmosphere: 'Dense hydrogen and helium atmosphere laced with active methane cirrus clouds and dynamic storm systems.',
    moons: 16,
    moonList: [
      { name: 'Triton', details: 'Only large moon in the Solar System with a retrograde orbit; exhibits nitrogen ice geysers.' },
      { name: 'Proteus', details: 'Irregular dark moon heavily pockmarked by impacts.' }
    ],
    discovery: 'Discovered via mathematical prediction by Urbain Le Verrier and Johann Galle in 1846.',
    day: '16.11 hours',
    orbitalPeriodDays: 60190,
    radiusKm: 24622,
    color: '#3B82F6',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~medium.jpg',
    eyesTarget: 'neptune',
    imageHint: 'neptune planet'
  },
  {
    id: 'pluto-view',
    name: 'Pluto',
    type: 'Dwarf Planet',
    dist: '5.90b km',
    distAU: 39.48,
    gravity: '0.62 m/s²',
    temp: '-229°C',
    details: 'Heart of the Kuiper Belt. Features Tombaugh Regio, a gigantic heart-shaped nitrogen ice glacier, mountain ranges of water ice, and red tholin stains.',
    surface: 'Solid nitrogen, methane, and carbon monoxide ices atop a rigid water-ice bedrock.',
    atmosphere: 'Tenuous nitrogen atmosphere that expands when Pluto approaches the Sun and freezes out as snow during aphelion.',
    moons: 5,
    moonList: [
      { name: 'Charon', details: 'Mutual tidal locking with Pluto; half of Pluto’s diameter, creating a true binary dwarf planet system.' },
      { name: 'Nix & Hydra', details: 'Small tumbling moons in chaotic rotation.' }
    ],
    discovery: 'Discovered by Clyde Tombaugh on February 18, 1930.',
    day: '6.39 Earth days',
    orbitalPeriodDays: 90560,
    radiusKm: 1188.3,
    color: '#E2E8F0',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA19952/PIA19952~medium.jpg',
    eyesTarget: 'pluto',
    imageHint: 'pluto planet'
  }
];

export const CONSTELLATIONS: Constellation[] = [
  {
    id: 'ursa-major',
    name: 'Ursa Major',
    aka: 'Great Bear & Big Dipper',
    stars: 'Dubhe, Merak, Phecda, Megrez, Alioth, Mizar, Alkaid',
    details: 'Contains the world-famous Big Dipper asterism. Its outer pointer stars, Merak and Dubhe, point directly to Polaris (the North Star), serving as humanity’s celestial compass for millennia.',
    hemisphere: 'Northern',
    visible: 'All Year (Circumpolar in Northern Hemisphere)',
    myth: 'Greek: Callisto, a nymph transformed into a bear by Zeus to protect her from Hera’s jealousy and lifted into the stars.',
    majorStars: [
      { name: 'Dubhe', mag: 1.8, x: 25, y: 30 },
      { name: 'Merak', mag: 2.3, x: 26, y: 48 },
      { name: 'Phecda', mag: 2.4, x: 40, y: 52 },
      { name: 'Megrez', mag: 3.3, x: 42, y: 35 },
      { name: 'Alioth', mag: 1.7, x: 58, y: 32 },
      { name: 'Mizar', mag: 2.2, x: 74, y: 38 },
      { name: 'Alkaid', mag: 1.8, x: 88, y: 52 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]],
    mythologyCulture: {
      greek: 'Callisto the wood nymph, mother of Arcas, immortalized in the northern heavens.',
      indigenousOrGlobal: 'Native American (Iroquois): Three hunters tracking the great bear through autumn as blood drips to turn leaves red.'
    }
  },
  {
    id: 'orion',
    name: 'Orion',
    aka: 'The Celestial Hunter',
    stars: 'Betelgeuse, Rigel, Bellatrix, Saiph, Alnitak, Alnilam, Mintaka',
    details: 'The crown jewel of the equatorial sky. Features Orion’s Belt, the magnificent red supergiant Betelgeuse at his shoulder, and the stellar nursery of the Orion Nebula (M42) hanging from his sword.',
    hemisphere: 'Equatorial',
    visible: 'November through April (Peak in Winter)',
    myth: 'Greek: The mighty giant hunter who vowed to conquer every beast on Earth before being challenged by Scorpius.',
    majorStars: [
      { name: 'Betelgeuse', mag: 0.5, x: 30, y: 22 },
      { name: 'Bellatrix', mag: 1.6, x: 70, y: 25 },
      { name: 'Alnitak', mag: 1.7, x: 42, y: 50 },
      { name: 'Alnilam', mag: 1.7, x: 50, y: 50 },
      { name: 'Mintaka', mag: 2.2, x: 58, y: 50 },
      { name: 'Saiph', mag: 2.0, x: 34, y: 80 },
      { name: 'Rigel', mag: 0.1, x: 68, y: 78 }
    ],
    lines: [[0, 2], [1, 4], [0, 1], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]],
    mythologyCulture: {
      greek: 'Orion battling Taurus the Bull across the celestial river Eridanus.',
      indigenousOrGlobal: 'Ancient Egypt: Sah, the soul of Osiris, god of resurrection and rebirth.'
    }
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    aka: 'The Queen’s Throne',
    stars: 'Schedar, Caph, Gamma Cassiopeiae, Ruchbah, Segin',
    details: 'Unmistakable zigzag "W" or "M" pattern in the northern circumpolar sky opposite Ursa Major. Anchored in the radiant band of the Milky Way, rich in open star clusters.',
    hemisphere: 'Northern',
    visible: 'All Year (Circumpolar)',
    myth: 'Greek: Vain Queen of Ethiopia who boasted her daughter Andromeda was lovelier than the Nereids, doomed to circle the celestial pole upside down.',
    majorStars: [
      { name: 'Caph', mag: 2.2, x: 15, y: 60 },
      { name: 'Schedar', mag: 2.2, x: 35, y: 35 },
      { name: 'Gamma Cas', mag: 2.1, x: 55, y: 55 },
      { name: 'Ruchbah', mag: 2.6, x: 75, y: 30 },
      { name: 'Segin', mag: 3.3, x: 90, y: 65 }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
    mythologyCulture: {
      greek: 'The Queen seated upon her celestial throne in eternal rotation.',
      indigenousOrGlobal: 'Arabic: The Hen and her chicks resting in the celestial branches.'
    }
  },
  {
    id: 'crux',
    name: 'Crux',
    aka: 'The Southern Cross',
    stars: 'Acrux (Alpha), Mimosa (Beta), Gacrux (Gamma), Imai (Delta)',
    details: 'The smallest of all 88 modern constellations, yet the most iconic symbol of the southern skies. Bordered by the deep Coal Sack dark nebula, it points southward to the celestial pole.',
    hemisphere: 'Southern',
    visible: 'All Year (Southern Hemisphere)',
    myth: 'Aboriginal Australian: The wedge-tailed eagle resting above the sacred emu spirit stretched across the dark Milky Way dust lanes.',
    majorStars: [
      { name: 'Gacrux', mag: 1.6, x: 50, y: 15 },
      { name: 'Mimosa', mag: 1.2, x: 25, y: 50 },
      { name: 'Delta Cru', mag: 2.8, x: 75, y: 45 },
      { name: 'Acrux', mag: 0.8, x: 50, y: 85 }
    ],
    lines: [[0, 3], [1, 2]],
    mythologyCulture: {
      greek: 'Formerly cataloged as part of Centaurus before modern classification.',
      indigenousOrGlobal: 'Inca: The Chakana (Inca Cross) linking the underworld, physical earth, and celestial heavens.'
    }
  },
  {
    id: 'scorpius',
    name: 'Scorpius',
    aka: 'The Celestial Scorpion',
    stars: 'Antares, Shaula, Sargas, Dschubba, Graffias',
    details: 'One of the few constellations that directly mirrors its namesake creature. Dominated by fiery red supergiant Antares (the "Rival of Mars") and curving through the galactic heart.',
    hemisphere: 'Southern',
    visible: 'May through September (Summer)',
    myth: 'Greek: The scorpion dispatched by Gaia that felled Orion the Hunter; placed at opposite sides of the sky so they never meet.',
    majorStars: [
      { name: 'Graffias', mag: 2.6, x: 20, y: 20 },
      { name: 'Dschubba', mag: 2.3, x: 22, y: 35 },
      { name: 'Antares', mag: 0.9, x: 35, y: 45 },
      { name: 'Wei', mag: 2.3, x: 48, y: 65 },
      { name: 'Sargas', mag: 1.8, x: 60, y: 80 },
      { name: 'Shaula', mag: 1.6, x: 80, y: 70 },
      { name: 'Lesath', mag: 2.7, x: 85, y: 62 }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
    mythologyCulture: {
      greek: 'The venomous hunter that drove Orion from the summer skies.',
      indigenousOrGlobal: 'Polynesian: Maui’s magic fishhook (Manaiakalani), pulled upward to drag islands from the sea floor.'
    }
  },
  {
    id: 'leo',
    name: 'Leo',
    aka: 'The Lion of Spring',
    stars: 'Regulus, Denebola, Algieba, Zosma, Rasalas',
    details: 'Prominent spring constellation recognizable by its backward question-mark sickle forming the lion’s mane and the brilliant blue-white royal star Regulus.',
    hemisphere: 'Equatorial',
    visible: 'February through June (Spring)',
    myth: 'Greek: The ferocious Nemean Lion whose golden impenetrable pelt was claimed by Hercules in the first of his Twelve Labors.',
    majorStars: [
      { name: 'Rasalas', mag: 3.8, x: 20, y: 35 },
      { name: 'Algieba', mag: 2.0, x: 35, y: 40 },
      { name: 'Regulus', mag: 1.3, x: 40, y: 70 },
      { name: 'Zosma', mag: 2.5, x: 65, y: 35 },
      { name: 'Chertan', mag: 3.3, x: 65, y: 60 },
      { name: 'Denebola', mag: 2.1, x: 85, y: 48 }
    ],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [2, 4], [3, 5], [4, 5]],
    mythologyCulture: {
      greek: 'The impenetrable Nemean Lion placed by Zeus in honor of Hercules.',
      indigenousOrGlobal: 'Ancient Babylon: UR.GU.LA, the great royal lion associated with Ishtar.'
    }
  }
];

export const SPACE_SOUNDS: SpaceSound[] = [
  {
    id: 'perseus-blackhole',
    title: 'Perseus Black Hole Sonification',
    category: 'Black Hole',
    date: 'NASA Chandra X-ray Observatory / 2022',
    description: 'Astronomers extracted acoustic pressure waves rippling through gas surrounding the supermassive black hole at the center of the Perseus galaxy cluster. Scaled up 57 octaves to human audible frequencies (144 quadrillion Hz higher than their original pitch).',
    synthPreset: 'black-hole',
    duration: '0:34',
    instrument: 'Chandra X-ray Observatory'
  },
  {
    id: 'voyager-interstellar',
    title: 'Voyager 1 Interstellar Plasma Waves',
    category: 'Deep Space',
    date: 'NASA Voyager Mission / 2013',
    description: 'When Voyager 1 crossed the heliopause into true interstellar space, its Plasma Wave instrument recorded oscillations in interstellar ionized gas triggered by solar coronal mass ejections.',
    synthPreset: 'plasma-wave',
    duration: '0:42',
    instrument: 'Voyager 1 Plasma Wave Subsystem'
  },
  {
    id: 'pulsar-vela',
    title: 'Vela Pulsar PSR B0833-45 Rotational Signal',
    category: 'Sonification',
    date: 'Parkes Radio Telescope / CSIRO',
    description: 'Radio emission pulses from a collapsed neutron star spinning at 11 rotations per second. The extreme magnetic beam sweeps across Earth like an astronomical lighthouse.',
    synthPreset: 'pulsar',
    duration: '0:28',
    instrument: 'Parkes Radio Observatory'
  },
  {
    id: 'saturn-radio',
    title: 'Saturnian Kilometric Radiation (SKR)',
    category: 'Planetary',
    date: 'NASA Cassini Solstice Mission',
    description: 'Cassini’s Radio and Plasma Wave Science (RPWS) instrument recorded eerie whistling and chirping electromagnetic waves emitted by auroras swirling at Saturn’s poles.',
    synthPreset: 'radio-burst',
    duration: '0:55',
    instrument: 'Cassini RPWS Instrument'
  },
  {
    id: 'earth-chorus',
    title: 'Earth Magnetospheric "Dawn Chorus"',
    category: 'Planetary',
    date: 'NASA Van Allen Probes',
    description: 'Electromagnetic radio waves in Earth’s Van Allen radiation belts caused by energetic electrons colliding with the geomagnetic shield, sounding remarkably like birds singing at dawn.',
    synthPreset: 'magnetosphere',
    duration: '0:38',
    instrument: 'Van Allen Probes EMFISIS'
  },
  {
    id: 'solar-flare-chirp',
    title: 'Solar Wind & Flare Radio Burst Emission',
    category: 'Sonification',
    date: 'Parker Solar Probe / SWEAP',
    description: 'Fluctuations in proton flux and magnetic switchbacks as NASA’s Parker Solar Probe dove deep into the solar corona, translated into auditory resonance.',
    synthPreset: 'solar-wind',
    duration: '0:46',
    instrument: 'Parker Solar Probe SWEAP'
  }
];

export const EXOPLANETS: Exoplanet[] = [
  {
    id: 'proxima-b',
    name: 'Proxima Centauri b',
    dist: '4.24 Ly',
    distLy: 4.24,
    star: 'Proxima Centauri (M5.5V Red Dwarf)',
    starType: 'M',
    hzIndex: '0.87',
    temp: '-39°C (est)',
    tempKelvin: 234,
    notes: 'The closest known extrasolar planet to Earth. Orbits well inside its host star’s liquid water zone, but subjected to intense ultraviolet stellar flare activity.',
    orbitalPeriodDays: 11.2,
    semiMajorAxisAU: 0.0485,
    radiusEarthRatio: 1.08,
    massEarthRatio: 1.17,
    habitabilityScore: 84,
    potentialWater: 'Potential Liquid'
  },
  {
    id: 'trappist-1e',
    name: 'TRAPPIST-1e',
    dist: '39.46 Ly',
    distLy: 39.46,
    star: 'TRAPPIST-1 (Ultra-cool M-Dwarf)',
    starType: 'M',
    hzIndex: '0.91',
    temp: '-22°C (est)',
    tempKelvin: 251,
    notes: 'Considered one of the most promising candidates for a temperate, terrestrial ocean world. Receives 66% of Earth’s solar flux with a dense rocky iron core.',
    orbitalPeriodDays: 6.1,
    semiMajorAxisAU: 0.029,
    radiusEarthRatio: 0.92,
    massEarthRatio: 0.69,
    habitabilityScore: 92,
    potentialWater: 'Likely Liquid'
  },
  {
    id: 'kepler-452b',
    name: 'Kepler-452b',
    dist: '1,402 Ly',
    distLy: 1402,
    star: 'Kepler-452 (G2V Yellow Dwarf like Sun)',
    starType: 'G',
    hzIndex: '0.83',
    temp: '-8°C (est)',
    tempKelvin: 265,
    notes: 'Earth’s older, larger cousin. Orbits a star nearly identical to our Sun on a 385-day cycle. Spent 6 billion years in the Goldilocks zone.',
    orbitalPeriodDays: 384.8,
    semiMajorAxisAU: 1.046,
    radiusEarthRatio: 1.63,
    massEarthRatio: 5.0,
    habitabilityScore: 81,
    potentialWater: 'Potential Liquid'
  },
  {
    id: 'kepler-186f',
    name: 'Kepler-186f',
    dist: '582 Ly',
    distLy: 582,
    star: 'Kepler-186 (M1V Red Dwarf)',
    starType: 'M',
    hzIndex: '0.64',
    temp: '-85°C (est)',
    tempKelvin: 188,
    notes: 'The historic first Earth-sized planet discovered residing inside a circumstellar habitable zone. Sits near the outer frost boundary.',
    orbitalPeriodDays: 129.9,
    semiMajorAxisAU: 0.432,
    radiusEarthRatio: 1.17,
    massEarthRatio: 1.4,
    habitabilityScore: 72,
    potentialWater: 'Potential Liquid'
  },
  {
    id: 'lhs-1140-b',
    name: 'LHS 1140 b',
    dist: '40.7 Ly',
    distLy: 40.7,
    star: 'LHS 1140 (Quiet M-Dwarf)',
    starType: 'M',
    hzIndex: '0.78',
    temp: '-43°C (est)',
    tempKelvin: 230,
    notes: 'A dense super-Earth orbiting an exceptionally quiet low-activity star. Recent JWST observations suggest a global ice shell with a temperate nitrogen-rich sea.',
    orbitalPeriodDays: 24.7,
    semiMajorAxisAU: 0.094,
    radiusEarthRatio: 1.73,
    massEarthRatio: 5.6,
    habitabilityScore: 86,
    potentialWater: 'Confirmed Vapor'
  },
  {
    id: 'toi-700-d',
    name: 'TOI-700 d',
    dist: '101.4 Ly',
    distLy: 101.4,
    star: 'TOI-700 (Quiet M-Dwarf)',
    starType: 'M',
    hzIndex: '0.90',
    temp: '-4°C (est)',
    tempKelvin: 269,
    notes: 'Discovered by NASA’s TESS mission. Receives 86% of the energy Earth receives from the Sun, making it optimal for cloud-stabilized liquid water.',
    orbitalPeriodDays: 37.4,
    semiMajorAxisAU: 0.163,
    radiusEarthRatio: 1.14,
    massEarthRatio: 1.25,
    habitabilityScore: 89,
    potentialWater: 'Likely Liquid'
  },
  {
    id: 'k2-18-b',
    name: 'K2-18 b',
    dist: '124 Ly',
    distLy: 124,
    star: 'K2-18 (M-Dwarf)',
    starType: 'M',
    hzIndex: '0.73',
    temp: '-2°C (est)',
    tempKelvin: 271,
    notes: 'A candidate Hycean world: a hydrogen-rich atmosphere encompassing a massive water ocean. JWST detected carbon-bearing molecules (methane and carbon dioxide).',
    orbitalPeriodDays: 32.9,
    semiMajorAxisAU: 0.143,
    radiusEarthRatio: 2.61,
    massEarthRatio: 8.6,
    habitabilityScore: 76,
    potentialWater: 'Confirmed Vapor'
  }
];

export const INITIAL_EXPLORER_PROFILE: ExplorerProfile = {
  id: 'EXP-9815-QN',
  displayName: 'Lead Astrogator',
  email: 'explorer@quantumnest.space',
  rank: 'Level 4 Astrogator',
  rankLevel: 4,
  joinedDate: 'Jan 2026',
  lastActive: 'Active Now',
  bookmarkedIds: ['earth-view', 'perseus-blackhole', 'trappist-1e', 'orion'],
  missionsLaunched: 18,
  listeningTimeMinutes: 47
};

export const STARGAZING_PROTOCOLS = [
  {
    title: 'Dark Sky Sites (Bortle Scale)',
    desc: 'Seek Class 1-3 rural observation sites away from urban light pollution for distinct Milky Way lanes and naked-eye nebulas.'
  },
  {
    title: 'Averted Vision Technique',
    desc: 'Direct your gaze 10-15° offset from faint star clusters to engage retinal rods for up to 40× heightened low-light sensitivity.'
  },
  {
    title: 'Red-Filtered Illumination',
    desc: 'Strictly utilize red light (wavelength >620 nm) to protect rhodopsin pigments and maintain complete 30-minute dark adaptation.'
  },
  {
    title: 'Planispheric Coordinates',
    desc: 'Calibrate your local horizon with Right Ascension (RA) and Declination (Dec) celestial grids aligned to Polaris or Sigma Octantis.'
  }
];

export const SMALL_BODIES: SmallBodyItem[] = [
  {
    id: 'vesta-4',
    name: '4 Vesta',
    category: 'Asteroid',
    mission: 'NASA Dawn Orbiter',
    diameter: '525 km mean diameter',
    orbitPeriod: '3.63 Earth years',
    summary: 'The second-most massive body in the main asteroid belt, featuring the giant Rheasilvia impact basin and differentiated rocky mantle.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA15797/PIA15797~medium.jpg',
    eyesTarget: '4_vesta',
  },
  {
    id: 'ida-243',
    name: '243 Ida & Moon Dactyl',
    category: 'Asteroid',
    mission: 'NASA Galileo Flyby',
    diameter: '31.4 km mean diameter',
    orbitPeriod: '4.84 Earth years',
    summary: 'The first asteroid confirmed to possess its own natural satellite (Dactyl), imaged by Galileo on its way to the Jovian system.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA00333/PIA00333~thumb.jpg',
  },
  {
    id: 'bennu-101955',
    name: '101955 Bennu',
    category: 'Asteroid',
    mission: 'NASA OSIRIS-REx',
    diameter: '490 meters',
    orbitPeriod: '1.20 Earth years',
    summary: 'Carbon-rich near-Earth rubble-pile asteroid sampled by NASA OSIRIS-REx, preserving pristine pre-solar organic compounds and hydrated clays.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24101/PIA24101~small.jpg',
    eyesTarget: '101955_bennu',
  },
  {
    id: 'halley-1p',
    name: '1P/Halley',
    category: 'Comet',
    mission: 'Giotto & Vega Armada',
    diameter: '11 km nucleus',
    orbitPeriod: '75.3 Earth years',
    summary: 'The archetypal short-period comet returning to the inner solar system every ~76 years, shedding glowing cyanogen and dust tails.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA17485/PIA17485~small.jpg',
  },
  {
    id: 'comet-67p',
    name: '67P/Churyumov-Gerasimenko',
    category: 'Comet',
    mission: 'ESA / NASA Rosetta',
    diameter: '4.1 km bilobed nucleus',
    orbitPeriod: '6.44 Earth years',
    summary: 'Bilobed Jupiter-family comet orbited and landed upon by the Rosetta and Philae spacecraft, revealing active sublimating dust jets.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA21068/PIA21068~medium.jpg',
    eyesTarget: '67p_churyumov-gerasimenko',
  },
  {
    id: 'comet-neowise',
    name: 'C/2020 F3 (NEOWISE)',
    category: 'Comet',
    mission: 'NASA NEOWISE / ISS',
    diameter: '~5 km nucleus',
    orbitPeriod: '~6,766 Earth years',
    summary: 'Retrograde long-period comet discovered by NASA’s NEOWISE infrared telescope, producing twin sodium-ion and dust tails visible across Earth.',
    imageUrl: 'https://images-assets.nasa.gov/image/NHQ202007120001/NHQ202007120001~medium.jpg',
  },
];
