/**
 * Extracts parameter values from a test case input string.
 * Example: "nums = \\[2,7,11,15\\], target = 9" => "[2,7,11,15], 9"
 */
export function cleanInput(input: string): string {
  // Remove backslashes from brackets first
  let cleaned = input.replace(/\\([[\]{}()])/g, '$1');
  
  // Split by commas, but be careful with arrays
  const parts = [];
  let currentPart = '';
  let bracketCount = 0;
  let i = 0;
  
  while (i < cleaned.length) {
    const char = cleaned[i];
    
    if (char === '[') {
      bracketCount++;
    } else if (char === ']') {
      bracketCount--;
    }
    
    if (char === ',' && bracketCount === 0) {
      // This comma is not inside brackets, so it's a parameter separator
      parts.push(currentPart.trim());
      currentPart = '';
    } else {
      currentPart += char;
    }
    
    i++;
  }
  
  // Add the last part
  if (currentPart.trim()) {
    parts.push(currentPart.trim());
  }
  
  // Extract values after '=' from each part
  const values = parts.map(part => {
    const equalIndex = part.indexOf('=');
    if (equalIndex !== -1) {
      return part.substring(equalIndex + 1).trim();
    }
    return part.trim();
  }).filter(val => val !== '');
  
  return values.join(', ');
}

/**
 * Extracts function name from a Python def line.
 * Example: "def max_area(height):" => "max_area"
 */
export function extractFunctionName(template: string): string {
  const match = template.match(/def\s+(\w+)\s*\(/);
  return match ? match[1] : "solve";
}

/**
 * Builds a full Python script for execution.
 * Removes existing __main__ block and adds dynamic test call.
 */
export function buildPythonScript(template: string, cleanedInput: string): string {
  const functionName = extractFunctionName(template);
  
  // Remove existing __main__ block
  const templateClean = template.replace(/if\s+__name__\s*==\s*["']__main__["']:\s*[\s\S]*?(?=\n\S|\n*$)/g, '').trim();
  
  return `
${templateClean}

if __name__ == "__main__":
    sol = Solution()
    result = sol.${functionName}(${cleanedInput})
    print(result)
`.trim();
}

export function cleanDisplayText(text: string): string {
  return text
    .replace(/\\([[\]{}()])/g, '$1')      // unescape backslashed brackets
    .replace(/\\n/g, '\n')                // handle \n literals
    .replace(/\\t/g, '\t')                // handle \t literals
    .trim();
}
