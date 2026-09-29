function cleanText(value) {
/**
 * cleanText()
 * ---------------------------------------------------------
 * Purpose:
 *   Clean and normalize text while preserving its meaning.
 *
 * Features:
 *   1. Handle null / undefined safely
 *   2. Convert non-string values to string
 *   3. Remove zero-width / invisible characters
 *   4. Convert tabs, newlines, and non-breaking spaces to spaces
 *   5. Remove leading and trailing whitespace
 *   6. Replace multiple spaces with a single space
 *   7. Preserve case
 *   8. Preserve punctuation and Unicode/Bangla characters
 *
 * Example:
 *   "  Md.\t  Abdul\nKarim  "
 *       ↓
 *   "Md. Abdul Karim"
 */
  // -------------------------------------------------------
  // 1. Handle empty values
  // -------------------------------------------------------
  // null and undefined should become an empty string.
  if (value === null || value === undefined) {
    return "";
  }


  // -------------------------------------------------------
  // 2. Convert value to string
  // -------------------------------------------------------
  // Allows the function to safely handle numbers, booleans,
  // dates, etc.
  let text = String(value);


  // -------------------------------------------------------
  // 3. Remove zero-width / invisible characters
  // -------------------------------------------------------
  // These characters can make two visually identical values
  // behave differently during searching or comparison.
  text = text.replace(/[\u200B-\u200D\uFEFF]/g, "");


  // -------------------------------------------------------
  // 4. Normalize special whitespace
  // -------------------------------------------------------
  // Convert:
  //   - tabs
  //   - line breaks
  //   - carriage returns
  //   - non-breaking spaces
  //
  // into a normal space.
  text = text.replace(/[\t\n\r\u00A0]+/g, " ");


  // -------------------------------------------------------
  // 5. Remove leading and trailing whitespace
  // -------------------------------------------------------
  text = text.trim();


  // -------------------------------------------------------
  // 6. Collapse multiple spaces
  // -------------------------------------------------------
  // Example:
  //   "Md.    Abdul     Karim"
  //
  // becomes:
  //   "Md. Abdul Karim"
  text = text.replace(/ {2,}/g, " ");


  // -------------------------------------------------------
  // 7. Return cleaned text
  // -------------------------------------------------------
  // Case and meaningful punctuation are preserved.
  return text;
}
