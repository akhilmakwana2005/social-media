export async function generateGeminiText(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'mock-key') {
    return getFallbackText(prompt);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn('Gemini API returned error, using fallback:', error.error?.message);
      return getFallbackText(prompt);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackText(prompt);
  } catch (e) {
    console.warn('Gemini request failed, using fallback:', e);
    return getFallbackText(prompt);
  }
}

function getFallbackText(prompt: string): string {
  // Extract topic from prompt for a better fallback
  let topic = 'Specialty Coffee';
  const topicMatch = prompt.match(/about:\s*"(.*?)"/);
  if (topicMatch && topicMatch[1]) {
    topic = topicMatch[1];
  }

  // Parse platform to adjust formatting slightly
  const isLinkedIn = prompt.toLowerCase().includes('linkedin');

  if (isLinkedIn) {
    return `💡 Consistency beats talent when talent doesn’t show up. 

Crafting the perfect batch of "${topic}" requires precision, patience, and a deep appreciation for the roasting process. Whether we are profiling coffee acidity or refining roast curves, it’s all about maintaining standard excellence daily.

Here are 3 key takeaways from our roasting desk:
1️⃣ Temperature profiling is critical for flavor definition.
2️⃣ Direct trade bean sourcing builds sustainable farmer relationships.
3️⃣ Customer feedback drives local menu innovations.

Explore our latest roasting insights or shop our catalog online. #SpecialtyCoffee #RoastingDesign #ProductConsistency`;
  }

  return `☕ Savoring the craft of perfect roasting!

We believe that great coffee is more than a morning routine—it's a journey of chemistry, precision, and passion. Sourced directly from single-origin farms, each bean tells its own unique story.

Here is what makes this batch of "${topic}" so special:
✨ Rich flavor notes with a smooth profile.
🌱 Meticulously sourced & roasted to perfection.
💼 Crafted for coffee enthusiasts who appreciate the grind.

Stop by our roastery downtown or click the link in our bio to explore our subscription options! 📚 #SpecialtyCoffee #CoffeeGrind #CoffeeChemistry`;
}
