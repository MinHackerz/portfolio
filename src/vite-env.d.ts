/// <reference types="vite/client" />

// View Transitions API type augmentation
interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
}
