//Local Storage persistence

export interface CustomProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  source?: string;
  companies?: Array<{
    name: string;
    slug: string;
    frequency: number;
  }>;
  createdAt: string;
  isCustom: true; // Flag to identify custom problems
}

export interface NewProblemData {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  source?: string;
  companies?: Array<{
    name: string;
    slug: string;
    frequency: number;
  }>;
}

const STORAGE_KEY = 'zenith_custom_problems';

// Generate a URL-friendly slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Generate unique ID
const generateId = (): string => {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get all custom problems from localStorage
export const getCustomProblems = (): CustomProblem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading custom problems:', error);
  }
  return [];
};

// Save all custom problems to localStorage
const saveCustomProblems = (problems: CustomProblem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
  } catch (error) {
    console.error('Error saving custom problems:', error);
    throw new Error('Failed to save problem. Please try again.');
  }
};

// Create a new custom problem
export const createCustomProblem = (problemData: NewProblemData): CustomProblem => {
  const existingProblems = getCustomProblems();
  
  // Check for duplicate titles
  const titleExists = existingProblems.some(
    p => p.title.toLowerCase() === problemData.title.toLowerCase()
  );
  
  if (titleExists) {
    throw new Error('A problem with this title already exists');
  }

  const newProblem: CustomProblem = {
    id: generateId(),
    slug: generateSlug(problemData.title),
    title: problemData.title,
    difficulty: problemData.difficulty,
    description: problemData.description,
    examples: problemData.examples,
    constraints: problemData.constraints,
    source: problemData.source || 'Custom',
    companies: problemData.companies || [],
    createdAt: new Date().toISOString(),
    isCustom: true
  };

  const updatedProblems = [...existingProblems, newProblem];
  saveCustomProblems(updatedProblems);
  
  return newProblem;
};

// Update an existing custom problem
export const updateCustomProblem = (id: string, updates: Partial<NewProblemData>): CustomProblem => {
  const existingProblems = getCustomProblems();
  const problemIndex = existingProblems.findIndex(p => p.id === id);
  
  if (problemIndex === -1) {
    throw new Error('Problem not found');
  }

  // Check for duplicate titles (excluding current problem)
  if (updates.title) {
    const titleExists = existingProblems.some(
      (p, index) => index !== problemIndex && p.title.toLowerCase() === updates.title!.toLowerCase()
    );
    
    if (titleExists) {
      throw new Error('A problem with this title already exists');
    }
  }

  const updatedProblem: CustomProblem = {
    ...existingProblems[problemIndex],
    ...updates,
    slug: updates.title ? generateSlug(updates.title) : existingProblems[problemIndex].slug
  };

  const updatedProblems = [...existingProblems];
  updatedProblems[problemIndex] = updatedProblem;
  
  saveCustomProblems(updatedProblems);
  
  return updatedProblem;
};

// Delete a custom problem
export const deleteCustomProblem = (id: string): void => {
  const existingProblems = getCustomProblems();
  const updatedProblems = existingProblems.filter(p => p.id !== id);
  
  if (updatedProblems.length === existingProblems.length) {
    throw new Error('Problem not found');
  }
  
  saveCustomProblems(updatedProblems);
};

// Get a single custom problem by ID
export const getCustomProblem = (id: string): CustomProblem | null => {
  const problems = getCustomProblems();
  return problems.find(p => p.id === id) || null;
};

// Get custom problem by slug
export const getCustomProblemBySlug = (slug: string): CustomProblem | null => {
  const problems = getCustomProblems();
  return problems.find(p => p.slug === slug) || null;
};

// Export all custom problems as JSON
export const exportCustomProblems = (): string => {
  const problems = getCustomProblems();
  return JSON.stringify(problems, null, 2);
};

// Import custom problems from JSON
export const importCustomProblems = (jsonData: string, replaceExisting = false): number => {
  try {
    const importedProblems: CustomProblem[] = JSON.parse(jsonData);
    
    // Validate the imported data
    if (!Array.isArray(importedProblems)) {
      throw new Error('Invalid data format');
    }

    // Validate each problem
    importedProblems.forEach((problem, index) => {
      if (!problem.title || !problem.description || !problem.difficulty) {
        throw new Error(`Invalid problem at index ${index}: missing required fields`);
      }
    });

    const existingProblems = replaceExisting ? [] : getCustomProblems();
    
    // Merge with existing problems, handling duplicates
    const mergedProblems = [...existingProblems];
    let importedCount = 0;

    importedProblems.forEach(importedProblem => {
      const exists = mergedProblems.some(
        existing => existing.title.toLowerCase() === importedProblem.title.toLowerCase()
      );
      
      if (!exists) {
        // Ensure it has the right structure and generate new ID
        const newProblem: CustomProblem = {
          ...importedProblem,
          id: generateId(),
          slug: generateSlug(importedProblem.title),
          isCustom: true,
          createdAt: importedProblem.createdAt || new Date().toISOString()
        };
        
        mergedProblems.push(newProblem);
        importedCount++;
      }
    });

    saveCustomProblems(mergedProblems);
    return importedCount;
  } catch (error) {
    console.error('Error importing problems:', error);
    throw new Error('Failed to import problems. Please check the file format.');
  }
};

// Get stats about custom problems
export const getCustomProblemsStats = () => {
  const problems = getCustomProblems();
  
  const stats = {
    total: problems.length,
    byDifficulty: {
      Easy: problems.filter(p => p.difficulty === 'Easy').length,
      Medium: problems.filter(p => p.difficulty === 'Medium').length,
      Hard: problems.filter(p => p.difficulty === 'Hard').length
    },
    bySources: {} as Record<string, number>,
    oldestDate: null as string | null,
    newestDate: null as string | null
  };

  // Count by source
  problems.forEach(problem => {
    const source = problem.source || 'Custom';
    stats.bySources[source] = (stats.bySources[source] || 0) + 1;
  });

  // Get date range
  if (problems.length > 0) {
    const dates = problems.map(p => p.createdAt).sort();
    stats.oldestDate = dates[0];
    stats.newestDate = dates[dates.length - 1];
  }

  return stats;
};