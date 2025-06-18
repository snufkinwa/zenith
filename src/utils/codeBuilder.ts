/**
 * Extracts parameter values from a test case input string.
 * Example: "height = \[1,8,6\]" => "[1,8,6]"
 */
export function cleanInput(input: string): string {
  const match = input.match(/=\s*\\?\[.*?\\?\]/);
  if (!match) return "";

  return match[0]
    .replace(/.*?=\s*/, "") // remove 'param = '
    .replace(/\\/g, "")     // remove escape slashes
    .trim();
}

/**
 * Builds a full Python script for execution.
 * Injects the function template and a dynamic test call.
 */
export function buildPythonScript(template: string, functionName: string, cleanedInput: string): string {
  return `
${template}

if __name__ == "__main__":
    sol = Solution()
    print(sol.${functionName}(${cleanedInput}))
`.trim();
}

/**
 * Extracts function name from a Python def line.
 * Example: "def max_area(height):" => "max_area"
 */
export function extractFunctionName(template: string): string {
  const match = template.match(/def\s+(\w+)\s*\(/);
  return match ? match[1] : "unknownFunction";
}