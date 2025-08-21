import { SpeciesInfo, Scenario, ActionType } from '@/types/game';

export const SPECIES_DATA: SpeciesInfo[] = [
  {
    type: 'r-selected',
    name: 'r-selected Species',
    description: 'Fast-reproducing opportunists that thrive in unstable environments',
    characteristics: [
      'High reproductive rate',
      'Small body size',
      'Short lifespan',
      'Early maturity',
      'Many offspring with little care'
    ],
    preferredEnvironments: ['Disturbed habitats', 'Early succession', 'Unpredictable conditions'],
    strategies: ['reproduce-quickly', 'colonize-quickly'],
    color: 'r-species',
    icon: '🐰'
  },
  {
    type: 'K-selected',
    name: 'K-selected Species',
    description: 'Competitive specialists adapted to stable, resource-limited environments',
    characteristics: [
      'Low reproductive rate',
      'Large body size',
      'Long lifespan',
      'Late maturity',
      'Few offspring with extensive care'
    ],
    preferredEnvironments: ['Stable habitats', 'Climax communities', 'Predictable conditions'],
    strategies: ['invest-in-offspring', 'compete-aggressively', 'build-defenses'],
    color: 'k-species',
    icon: '🦌'
  },
  {
    type: 'C-competitive',
    name: 'Competitive Species',
    description: 'Aggressive competitors in resource-rich, low-stress environments',
    characteristics: [
      'High competitive ability',
      'Fast growth in good conditions',
      'Resource monopolization',
      'Shade tolerance',
      'Dense canopy formation'
    ],
    preferredEnvironments: ['High resource areas', 'Low disturbance', 'Fertile soils'],
    strategies: ['compete-aggressively', 'build-defenses'],
    color: 'c-species',
    icon: '🌳'
  },
  {
    type: 'S-stress-tolerant',
    name: 'Stress-Tolerant Species',
    description: 'Survivors in harsh, resource-poor environments',
    characteristics: [
      'High stress tolerance',
      'Slow growth rate',
      'Efficient resource use',
      'Drought/cold resistance',
      'Conservative growth strategy'
    ],
    preferredEnvironments: ['Harsh conditions', 'Resource-poor areas', 'Extreme climates'],
    strategies: ['conserve-resources', 'wait-and-observe'],
    color: 's-species',
    icon: '🌵'
  },
  {
    type: 'R-ruderal',
    name: 'Ruderal Species',
    description: 'Pioneer colonizers of disturbed, resource-rich environments',
    characteristics: [
      'Fast colonization',
      'High growth rate when resources available',
      'Pioneer species traits',
      'Seed dispersal adaptation',
      'Rapid establishment'
    ],
    preferredEnvironments: ['Recently disturbed areas', 'High resource availability', 'Open habitats'],
    strategies: ['colonize-quickly', 'reproduce-quickly'],
    color: 'ruderal',
    icon: '🌱'
  }
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'forest-fire',
    name: 'Post-Forest Fire Recovery',
    description: 'A wildfire has cleared large areas of forest, creating open, nutrient-rich soil with high light availability but unstable conditions.',
    environment: 'disturbed',
    imagePrompt: 'Forest clearing after wildfire with new growth emerging, sunlight streaming through, nutrient-rich soil',
    advantageousStrategies: ['r-selected', 'R-ruderal'],
    explanation: 'Disturbed environments favor fast-growing, quick-reproducing species that can rapidly colonize open spaces.'
  },
  {
    id: 'mature-forest',
    name: 'Old-Growth Forest',
    description: 'A stable, mature forest with established canopy, intense competition for light, and predictable but limited resources.',
    environment: 'stable-mature',
    imagePrompt: 'Dense mature forest canopy with filtered light, established trees, complex ecosystem',
    advantageousStrategies: ['K-selected', 'C-competitive'],
    explanation: 'Stable environments favor species that invest heavily in competition and long-term survival strategies.'
  },
  {
    id: 'fertile-meadow',
    name: 'Fertile Meadow',
    description: 'A resource-rich grassland with abundant nutrients, water, and sunlight, but potential for competition.',
    environment: 'resource-rich',
    imagePrompt: 'Lush green meadow with abundant flowers, rich soil, bright sunlight, thriving ecosystem',
    advantageousStrategies: ['C-competitive', 'R-ruderal'],
    explanation: 'Resource-rich environments favor competitive species that can monopolize abundant resources.'
  },
  {
    id: 'desert-edge',
    name: 'Desert Margins',
    description: 'Harsh, arid environment with scarce water, extreme temperatures, and limited nutrients requiring resource conservation.',
    environment: 'resource-poor',
    imagePrompt: 'Desert landscape with sparse vegetation, rocky soil, intense sun, water-stressed plants',
    advantageousStrategies: ['S-stress-tolerant'],
    explanation: 'Stress environments favor species that can survive harsh conditions and use resources efficiently.'
  },
  {
    id: 'coastal-storm',
    name: 'Storm-Battered Coast',
    description: 'Coastal area subject to frequent storms, salt spray, and variable conditions with periodic disturbance and recovery.',
    environment: 'variable',
    imagePrompt: 'Rocky coastline with waves, salt-resistant plants, weathered landscape, dynamic environment',
    advantageousStrategies: ['r-selected', 'S-stress-tolerant'],
    explanation: 'Variable environments favor flexible species that can handle both disturbance and stress.'
  },
  {
    id: 'agricultural-abandonment',
    name: 'Abandoned Farmland',
    description: 'Recently abandoned agricultural field with rich soil and high nutrients, but no established plant community.',
    environment: 'disturbed',
    imagePrompt: 'Empty farmfield with rich dark soil, few scattered plants beginning to colonize, open space',
    advantageousStrategies: ['R-ruderal', 'r-selected'],
    explanation: 'Newly available habitats favor pioneer species that can quickly establish and reproduce.'
  },
  {
    id: 'glacial-retreat',
    name: 'Glacial Retreat Zone',
    description: 'Newly exposed rocky terrain after glacial retreat, with extreme conditions, minimal soil, and harsh pioneer environment.',
    environment: 'resource-poor',
    imagePrompt: 'Rocky mountain terrain with retreating glacier, sparse hardy plants, extreme conditions, primary succession',
    advantageousStrategies: ['S-stress-tolerant', 'r-selected'],
    explanation: 'Primary succession environments favor stress-tolerant pioneers that can establish on bare rock and extreme conditions.'
  },
  {
    id: 'urban-edge',
    name: 'Urban Development Edge',
    description: 'Interface between city and natural areas with pollution, habitat fragmentation, variable resources, and frequent human disturbance.',
    environment: 'variable',
    imagePrompt: 'Edge habitat between urban development and nature, fragmented landscape, pollution stress, human disturbance',
    advantageousStrategies: ['R-ruderal', 'S-stress-tolerant'],
    explanation: 'Urban environments favor adaptable species that can handle pollution, disturbance, and fragmented habitats.'
  }
];

export const ACTION_DESCRIPTIONS: Record<ActionType, { name: string; description: string; suitableFor: string[] }> = {
  'reproduce-quickly': {
    name: 'Reproduce Quickly',
    description: 'Produce many offspring rapidly to take advantage of current conditions',
    suitableFor: ['r-selected', 'R-ruderal']
  },
  'invest-in-offspring': {
    name: 'Invest in Offspring',
    description: 'Produce fewer offspring but provide extensive parental care',
    suitableFor: ['K-selected']
  },
  'compete-aggressively': {
    name: 'Compete Aggressively',
    description: 'Use energy to outcompete other species for resources',
    suitableFor: ['K-selected', 'C-competitive']
  },
  'conserve-resources': {
    name: 'Conserve Resources',
    description: 'Minimize energy expenditure and store resources for harsh times',
    suitableFor: ['S-stress-tolerant']
  },
  'colonize-quickly': {
    name: 'Colonize Quickly',
    description: 'Spread rapidly to new areas before competitors arrive',
    suitableFor: ['r-selected', 'R-ruderal']
  },
  'build-defenses': {
    name: 'Build Defenses',
    description: 'Invest energy in protection against competitors and harsh conditions',
    suitableFor: ['K-selected', 'C-competitive', 'S-stress-tolerant']
  },
  'form-partnerships': {
    name: 'Form Partnerships',
    description: 'Create mutualistic relationships with other organisms',
    suitableFor: ['S-stress-tolerant', 'K-selected']
  },
  'wait-and-observe': {
    name: 'Wait and Observe',
    description: 'Remain dormant or inactive until conditions improve',
    suitableFor: ['S-stress-tolerant']
  }
};