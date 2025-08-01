/**
 * Ghanaian dish pronunciation enhancement for kitchen TTS
 * Loads pronunciations from dishDictionary.json and applies SSML phoneme tags
 */

export class DishPronunciation {
  private pronunciationMap: Map<string, string>;
  private dishDictionary: any;

  constructor() {
    this.pronunciationMap = new Map();
    this.loadDishDictionary();
  }

  private loadDishDictionary() {
    try {
      this.dishDictionary = require('../../config/dishDictionary.json');
      this.buildPronunciationMap();
    } catch (error) {
      console.warn('Could not load dish dictionary, using fallback pronunciations');
      this.loadFallbackPronunciations();
    }
  }

  private buildPronunciationMap() {
    if (!this.dishDictionary?.dishes) return;

    Object.entries(this.dishDictionary.dishes).forEach(([key, dish]: [string, any]) => {
      // Add main dish name
      this.addSSMLPronunciation(dish.name.toLowerCase(), dish.pronunciation);
      
      // Add alternatives
      if (dish.alternatives) {
        dish.alternatives.forEach((alt: string) => {
          this.addSSMLPronunciation(alt.toLowerCase(), dish.pronunciation);
        });
      }
    });
  }

  private loadFallbackPronunciations() {
    // Fallback pronunciations in case JSON fails to load
    const fallbacks = [
      ['jollof rice', 'JOH-lof rice'],
      ['banku', 'BAHN-koo'],
      ['fufu', 'FOO-foo'],
      ['waakye', 'WAH-chay'],
      ['kelewele', 'keh-leh-WEH-leh'],
      ['tuo zaafi', 'TOO-oh ZAH-fee'],
      ['shito', 'SHEE-toh'],
    ];

    fallbacks.forEach(([dish, pronunciation]) => {
      this.addSSMLPronunciation(dish, pronunciation);
    });
  }

  private addSSMLPronunciation(dish: string, pronunciation: string) {
    // Convert phonetic pronunciation to SSML phoneme tag
    const ssmlPronunciation = `<phoneme alphabet="x-sampa" ph="${pronunciation}">${dish}</phoneme>`;
    this.pronunciationMap.set(dish.toLowerCase(), ssmlPronunciation);
  }

  /**
   * Enhance text with proper Ghanaian dish pronunciations
   * @param items - Order items text to enhance
   * @returns Enhanced text with SSML pronunciation tags
   */
  enhanceText(items: string): string {
    let enhancedText = items;
    
    for (const [dish, pronunciation] of this.pronunciationMap) {
      const regex = new RegExp(`\\b${dish}\\b`, 'gi');
      enhancedText = enhancedText.replace(regex, pronunciation);
    }
    
    return enhancedText;
  }

  /**
   * Add new pronunciation dynamically
   */
  addPronunciation(dish: string, pronunciation: string) {
    this.pronunciationMap.set(dish.toLowerCase(), pronunciation);
  }
}

export const dishPronunciation = new DishPronunciation();