/**
 * Global type declarations for Shakti Margam
 */

interface ShaktiMargamGlobal {
  setActiveModule?: (moduleId: string) => void;
  clearConversation?: () => void;
}

interface Window {
  ShaktiMargam?: ShaktiMargamGlobal;
  API_ENDPOINT?: string;
}
