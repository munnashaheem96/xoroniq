import { ANIMATION_CONFIG } from '../data/x3Kit';

export class FrameLoader {
  private static instance: FrameLoader | null = null;
  private totalFrames: number;
  private basePath: string;
  private cache: Map<number, HTMLImageElement> = new Map();
  private loadingSet: Set<number> = new Set();
  private loadedCount: number = 0;
  private progressListeners: Set<(loaded: number, total: number) => void> = new Set();
  private isBackgroundLoadingStarted = false;

  private constructor(totalFrames: number = ANIMATION_CONFIG.frameCount, basePath: string = ANIMATION_CONFIG.framePath) {
    this.totalFrames = totalFrames;
    this.basePath = basePath;
  }

  public static getInstance(totalFrames: number = ANIMATION_CONFIG.frameCount, basePath: string = ANIMATION_CONFIG.framePath): FrameLoader {
    if (!FrameLoader.instance) {
      FrameLoader.instance = new FrameLoader(totalFrames, basePath);
    }
    return FrameLoader.instance;
  }

  public getFormattedPath(frameIndex: number): string {
    // 0-indexed to 1-indexed (ezgif-frame-001.png)
    const indexNumber = frameIndex + 1;
    const padded = String(indexNumber).padStart(3, '0');
    return this.basePath.replace('{index}', padded);
  }

  public getTotalFrames(): number {
    return this.totalFrames;
  }

  public getLoadedCount(): number {
    return this.loadedCount;
  }

  public onProgress(cb: (loaded: number, total: number) => void): () => void {
    this.progressListeners.add(cb);
    cb(this.loadedCount, this.totalFrames);
    return () => this.progressListeners.delete(cb);
  }

  private notifyProgress(): void {
    for (const listener of this.progressListeners) {
      listener(this.loadedCount, this.totalFrames);
    }
  }

  public loadSingleFrame(index: number): Promise<HTMLImageElement> {
    const clampedIndex = Math.max(0, Math.min(this.totalFrames - 1, index));
    const cached = this.cache.get(clampedIndex);
    if (cached && cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }

    if (this.loadingSet.has(clampedIndex)) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const img = this.cache.get(clampedIndex);
          if (img && img.complete && img.naturalWidth > 0) {
            clearInterval(checkInterval);
            resolve(img);
          }
        }, 30);
      });
    }

    this.loadingSet.add(clampedIndex);

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = this.getFormattedPath(clampedIndex);

      img.onload = () => {
        this.cache.set(clampedIndex, img);
        this.loadingSet.delete(clampedIndex);
        this.loadedCount = this.cache.size;
        this.notifyProgress();
        resolve(img);
      };

      img.onerror = () => {
        this.loadingSet.delete(clampedIndex);
        // Fallback resolution to closest frame
        const fallback = this.getClosestFrame(clampedIndex);
        if (fallback) {
          resolve(fallback);
        }
      };
    });
  }

  /**
   * Priority 1: Preload critical milestone frames immediately
   */
  public async preloadMilestones(): Promise<void> {
    const milestones = [
      0,
      Math.floor(this.totalFrames * 0.2),
      Math.floor(this.totalFrames * 0.4),
      Math.floor(this.totalFrames * 0.6),
      Math.floor(this.totalFrames * 0.8),
      this.totalFrames - 1,
    ];

    await Promise.all(milestones.map((idx) => this.loadSingleFrame(idx)));
  }

  /**
   * Priority 2: Preload surrounding window of frames
   */
  public preloadProximity(currentIndex: number, windowSize = 15): void {
    const min = Math.max(0, currentIndex - windowSize);
    const max = Math.min(this.totalFrames - 1, currentIndex + windowSize);

    for (let i = min; i <= max; i++) {
      if (!this.cache.has(i) && !this.loadingSet.has(i)) {
        this.loadSingleFrame(i);
      }
    }
  }

  /**
   * Priority 3: Preload all remaining frames in chunks in background
   */
  public startBackgroundPreload(): void {
    if (this.isBackgroundLoadingStarted) return;
    this.isBackgroundLoadingStarted = true;

    let index = 0;
    const batchSize = 6;

    const loadNextBatch = () => {
      if (this.cache.size >= this.totalFrames) {
        return;
      }

      let loadedInBatch = 0;
      while (index < this.totalFrames && loadedInBatch < batchSize) {
        if (!this.cache.has(index) && !this.loadingSet.has(index)) {
          this.loadSingleFrame(index);
          loadedInBatch++;
        }
        index++;
      }

      if (index >= this.totalFrames) {
        index = 0; // Wrap to check any missed frames
      }

      if (this.cache.size < this.totalFrames) {
        setTimeout(loadNextBatch, 50);
      }
    };

    setTimeout(loadNextBatch, 100);
  }

  /**
   * Get closest available frame when requested frame is not yet in cache
   */
  public getClosestFrame(requestedIndex: number): HTMLImageElement | null {
    const exact = this.cache.get(requestedIndex);
    if (exact && exact.complete && exact.naturalWidth > 0) {
      return exact;
    }

    if (this.cache.size === 0) {
      return null;
    }

    let closestDist = Infinity;
    let closestImg: HTMLImageElement | null = null;

    for (const [idx, img] of this.cache.entries()) {
      if (img.complete && img.naturalWidth > 0) {
        const dist = Math.abs(idx - requestedIndex);
        if (dist < closestDist) {
          closestDist = dist;
          closestImg = img;
        }
      }
    }

    return closestImg;
  }
}
