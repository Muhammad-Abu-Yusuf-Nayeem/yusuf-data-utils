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



  // 7. Capitalize first letter of English words
  //    Example: "JOHN DOE" → "John Doe"
  //    Bangla characters remain unchanged.
  text = text.replace(/\b([a-zA-Z])([a-zA-Z]*)\b/g, (word, first, rest) => {
    return first.toUpperCase() + rest.toLowerCase();
  });

  // 8. Return cleaned text
  return text;
}


//for date normalization, we can create a function that takes a date input and converts it into a standardized format. This function will handle various date formats and ensure that the output is consistent.
function normalizeDateds111(value) {
  // 1. Convert input to text
  // 2. Split using / . -
  // 3. return as it is if splited length is not 3
  // 4. then remove leading and trailing whitespace and leading zeros from each part
  // 5. then first part is day, second part is month and third part is year
  // 6. convert each part to integer
  // 7. if month is 1,3,5,7,8,10,12 then max day is 31
  // 8. if month is 4,6,9,11 then max day is 30
  // 9. if month is 2 then max day is 28 or 29 depending on leap year
  // 10. if day is greater than max day then return invalid date+"date"
  // 11. if month is greater than 12 then return invalid date="date"
  // 12. if year is less than 1000 then return invalid date="date"
  // 13. return date in MM-DD-YYYY format

}

function normalizeDate(value) {
  if (value === null || value === undefined || value === '') return value;

  // Handle Google Sheets Date objects directly
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return "invalid date: " + value;
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    const year = value.getFullYear();
    return `${month}-${day}-${year}`;
  }

  // Convert to string and clean up existing '&' separators or extra spaces
  const strValue = String(value).trim();

  // If input already contains '&', split by '&', otherwise split by whitespace
  const rawParts = strValue.includes('&')
    ? strValue.split('&')
    : strValue.split(/\s+/);

  // Helper function to normalize a single date string
  function normalizeSingleDate(dateStr) {
    const trimmedStr = dateStr.trim();
    if (!trimmedStr) return '';

    // If it's a standard JS date string (e.g. "Sat Jul 08 2023 ...")
    if (trimmedStr.includes('GMT') || (!isNaN(Date.parse(trimmedStr)) && /[a-zA-Z]/.test(trimmedStr))) {
      const parsedDate = new Date(trimmedStr);
      if (!isNaN(parsedDate.getTime())) {
        const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const d = String(parsedDate.getDate()).padStart(2, '0');
        const y = parsedDate.getFullYear();
        return `${m}-${d}-${y}`;
      }
    }

    const parts = trimmedStr.split(/[/.-]/);

    // Step 3: If it doesn't split into 3 parts, return original as-is
    if (parts.length !== 3) {
      return trimmedStr;
    }

    const cleanedParts = parts.map(part => part.trim().replace(/^0+/, ''));

    const day = parseInt(cleanedParts[0], 10);
    const month = parseInt(cleanedParts[1], 10);
    let year = parseInt(cleanedParts[2], 10);

    // If parsing fails to yield numbers
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return "invalid date: " + trimmedStr;
    }

    // Adjust 2-digit years
    if (year < 100) {
      year += 2000;
    }

    // Step 11 & 12: Validate month and year range
    if (year < 1000 || year > 9999 || month < 1 || month > 12) {
      return "invalid date: " + trimmedStr;
    }

    // Step 9: Check leap year
    const isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);

    // Steps 7, 8, 9: Calculate maximum allowed days
    let maxDay;
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      maxDay = 31;
    } else if ([4, 6, 9, 11].includes(month)) {
      maxDay = 30;
    } else if (month === 2) {
      maxDay = isLeapYear(year) ? 29 : 28;
    }

    // Step 10: Validate day against maxDay
    if (day < 1 || day > maxDay) {
      return "invalid date: " + trimmedStr;
    }

    // Step 13: Return formatted date MM-DD-YYYY
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');

    return `${formattedMonth}-${formattedDay}-${year}`;
  }

  // Normalize all date parts and join with " & "
  const results = rawParts
    .map(normalizeSingleDate)
    .filter(res => res !== '');

  return results.join(' & ');
}