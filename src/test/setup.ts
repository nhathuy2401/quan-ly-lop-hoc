import '@testing-library/jest-dom/vitest';

// Mock BroadcastChannel for test environment
if (typeof window !== 'undefined') {
  class MockBroadcastChannel {
    name: string;
    onmessage: ((event: MessageEvent) => void) | null = null;
    constructor(name: string) {
      this.name = name;
    }
    postMessage(_data: any) {}
    close() {}
  }
  (window as any).BroadcastChannel = MockBroadcastChannel;

  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (window as any).ResizeObserver = MockResizeObserver;
}
