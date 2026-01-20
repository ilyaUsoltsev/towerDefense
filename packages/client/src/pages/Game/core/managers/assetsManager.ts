const imagesConfig = [
  '/basic.png',
  '/fast.png',
  '/dumb.png',
  '/freeze.png',
  '/rocket.png',
  '/sniper.png',
] as const;

export type ImageKey = typeof imagesConfig[number];

export class AssetManager {
  private images: Partial<Record<ImageKey, HTMLImageElement>> = {};

  async loadAll(): Promise<void> {
    const promises = imagesConfig.map(url =>
      this.loadImage(url).then(img => {
        this.images[url] = img;
      })
    );

    await Promise.all(promises);
  }

  get(key: ImageKey): HTMLImageElement {
    const img = this.images[key];
    if (!img) throw new Error(`Image not loaded: ${key}`);
    return img;
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${url}`));
      img.src = url;
    });
  }
}

export const assetsManager = new AssetManager();
