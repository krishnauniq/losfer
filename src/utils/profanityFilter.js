
// Basic list of offensive slurs (English & Common Hinglish)
// In a production app, this should be more comprehensive or an API.
const BAD_WORDS = [
    // English
    "fuck", "shit", "bitch", "asshole", "dick", "pussy", "bastard", "whore", "slut", "nigger", "faggot",
    "retard", "cunt", "kill", "suicide", "murder", "rape",

    // Hinglish (Common web spellings)
    "chutiya", "madarchod", "bhenchod", "bhosdike", "gandu", "lauda", "loda", "tatte",
    "randi", "saala", "kutti", "kutta", "harami", "tharki", "chinaal", "bhadwa"
];

export const containsProfanity = (text) => {
    if (!text) return false;
    // Normalize: Convert to lower, substitute common leetspeak
    let cleaned = text.toLowerCase()
        .replace(/0/g, 'o')
        .replace(/1/g, 'i')
        .replace(/@/g, 'a')
        .replace(/\$/g, 's')
        .replace(/\*/g, '') // Remove masking chars like *
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ""); // Remove punctuation

    // 1. Exact Word Check
    const words = cleaned.split(/\s+/);
    const foundWord = words.find(word => BAD_WORDS.includes(word));
    if (foundWord) return foundWord;

    // 2. Substring Check (Strict list)
    // Some words are unique enough to be banned as substrings (e.g. 'madarchod', 'bhenchod')
    // We skip short words like 'ass' to avoid 'class', 'glass' false positives
    const SEVERE_SUBSTRINGS = ["madarchod", "bhenchod", "chutiya", "bhosdike", "nigger", "faggot"];

    // Check for "bhen" AND "chod" appearing near each other
    if (cleaned.includes("bhen") && cleaned.includes("chod")) return "bhenchod (detected)";
    if (cleaned.includes("bhen") && cleaned.includes("chd")) return "bhenchod (detected)";

    const heavyFound = SEVERE_SUBSTRINGS.find(bad => cleaned.includes(bad));
    if (heavyFound) return heavyFound;

    return false;
};

export const maskProfanity = (text) => {
    if (!text) return text;

    const words = text.split(/\s+/);

    const maskedWords = words.map(word => {
        if (BAD_WORDS.includes(word.toLowerCase())) {
            return "*".repeat(word.length);
        }
        return word;
    });

    return maskedWords.join(" ");
}
