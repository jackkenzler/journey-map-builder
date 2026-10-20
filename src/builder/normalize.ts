import { MAX_FUTURE_PERSONAS, type JourneyMapConfig } from './types';

/** Fills in optional fields and enforces limits so older saved maps keep rendering. */
export function normalizeMapConfig(config: JourneyMapConfig): JourneyMapConfig {
  const personas = (config.futurePersonas ?? []).slice(0, MAX_FUTURE_PERSONAS).map((persona) => ({
    ...persona,
    markers: persona.markers ?? [],
  }));

  return {
    ...config,
    futurePersonas: personas,
    features: {
      summaryPanelEnabled: true,
      futurePersonasEnabled: false,
      ...config.features,
    },
  };
}
