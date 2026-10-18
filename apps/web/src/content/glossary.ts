/**
 * Terms that are formally taught in a later chapter. When a card uses one early, write it as
 * [[term]] (or [[shown text|term]]) so the learner sees a dotted underline with a plain meaning
 * and a pointer to the chapter that formalises it. The content validator flags unmarked uses.
 */
export interface GlossaryEntry { plain: string; chapter: number; pattern: RegExp }

export const GLOSSARY: Record<string, GlossaryEntry> = {
  'risk ratio': { chapter: 4, pattern: /\brisk ratios?\b|\bRRs?\b|\brelative risks?\b/i,
    plain: 'The risk in one group divided by the risk in another. 2 means twice as high; 1 means the same.' },
  'rate ratio': { chapter: 4, pattern: /\brate ratios?\b/i,
    plain: 'The rate in one group divided by the rate in another. 2 means twice as high; 1 means the same.' },
  'risk difference': { chapter: 4, pattern: /\brisk differences?\b/i,
    plain: 'The risk in one group minus the risk in another: the extra cases per person (or per 100).' },
  'rate difference': { chapter: 4, pattern: /\brate differences?\b/i,
    plain: 'The rate in one group minus the rate in another: the extra cases per unit of population or time.' },
  'odds ratio': { chapter: 4, pattern: /\bodds ratios?\b/i,
    plain: 'A ratio of odds rather than of risks; close to the risk ratio when the outcome is rare.' },
  'incidence': { chapter: 4, pattern: /\bincidence\b/i,
    plain: 'How often new cases arise in a population over a period of time.' },
  'person-time': { chapter: 4, pattern: /\bperson-(time|years?)\b/i,
    plain: 'The total time that people were followed and could have become cases, added up across everyone.' },
  'attributable fraction': { chapter: 4, pattern: /\battributable fractions?\b/i,
    plain: 'The share of cases that would not have occurred without the exposure.' },
  'confidence interval': { chapter: 7, pattern: /\bconfidence intervals?\b|\b95% CI\b/i,
    plain: 'A range of values that the data are reasonably compatible with; its width shows precision.' },
  'P-value': { chapter: 7, pattern: /\bP-values?\b/i,
    plain: 'How compatible the data are with one particular hypothesis, usually "no effect".' },
  'likelihood ratio': { chapter: 12, pattern: /\blikelihood ratios?\b|\bLR[+-]/i,
    plain: 'How much a test result changes the odds of disease.' },
};

const lookup = (key: string) => GLOSSARY[key] ?? GLOSSARY[Object.keys(GLOSSARY).find(k => k.toLowerCase() === key.toLowerCase()) ?? ''];

/** Replace [[shown|key]] / [[key]] markers with an accessible inline preview span (HTML string). */
export function renderPreviews(src: string): string {
  return src.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, shown: string, key?: string) => {
    const k = (key ?? shown).trim();
    const g = lookup(k);
    if (!g) return shown;
    const tip = `${g.plain} Formally introduced in Chapter ${g.chapter}.`.replace(/"/g, '&quot;');
    return `<span class="preview" tabindex="0" data-tip="${tip}" aria-label="${shown}: ${tip}">${shown}</span>`;
  });
}

/** Remove marked previews so the validator can look for unmarked uses. */
export const stripPreviews = (s: string) => s.replace(/\[\[[^\]]+\]\]/g, '');
export const previewKeys = (s: string) => [...s.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)].map(m => (m[2] ?? m[1]).trim());
export const glossaryHas = (key: string) => !!lookup(key);
