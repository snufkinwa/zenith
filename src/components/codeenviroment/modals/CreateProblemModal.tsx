'use client';

import React, { useState } from 'react';
import { Plus, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import DraggableModal from './DraggableModal';
import { createCustomProblem } from '@/utils/customProblems';
import type { Problem } from '../CodeEnvironment';

interface CreateProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onBringToFront: () => void;
  onCreateProblem: (problem: Problem) => void; // Changed to expect Problem interface
}

interface NewProblemData {
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

const CreateProblemModal: React.FC<CreateProblemModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  onBringToFront,
  onCreateProblem,
}) => {
  const [formData, setFormData] = useState<NewProblemData>({
    title: '',
    difficulty: 'Easy',
    description: '',
    examples: [{ input: '', output: '', explanation: '' }],
    constraints: [''],
    source: '',
    companies: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.examples.some((ex) => !ex.input.trim() || !ex.output.trim())) {
      newErrors.examples = 'All examples must have input and output';
    }

    if (formData.constraints.some((c) => !c.trim())) {
      newErrors.constraints = 'All constraints must be filled or removed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Clean up the data
      const cleanedData: NewProblemData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        examples: formData.examples.filter(
          (ex) => ex.input.trim() && ex.output.trim(),
        ),
        constraints: formData.constraints.filter((c) => c.trim()),
        source: (formData.source ?? '').trim() || 'Custom',
      };

      // Use the utility function to create and save the problem
      const newCustomProblem = createCustomProblem(cleanedData);

      // Convert CustomProblem to Problem interface for the component
      const problemForComponent: Problem = {
        id: newCustomProblem.id,
        slug: newCustomProblem.slug,
        title: newCustomProblem.title,
        difficulty: newCustomProblem.difficulty,
        description: newCustomProblem.description,
        examples: newCustomProblem.examples,
        constraints: newCustomProblem.constraints,
        companies: newCustomProblem.companies || [],
        source: newCustomProblem.source,
        isCustom: true,
        createdAt: newCustomProblem.createdAt,
      };

      // Call the parent component's handler
      await onCreateProblem(problemForComponent);

      handleReset();
      onClose();
    } catch (error) {
      console.error('Error creating problem:', error);
      // Show error to user
      setErrors({
        general:
          error instanceof Error ? error.message : 'Failed to create problem',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      difficulty: 'Easy',
      description: '',
      examples: [{ input: '', output: '', explanation: '' }],
      constraints: [''],
      source: '',
      companies: [],
    });
    setErrors({});
  };

  const addExample = () => {
    setFormData((prev) => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }],
    }));
  };

  const removeExample = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index),
    }));
  };

  const updateExample = (
    index: number,
    field: keyof (typeof formData.examples)[0],
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      examples: prev.examples.map((ex, i) =>
        i === index ? { ...ex, [field]: value } : ex,
      ),
    }));
  };

  const addConstraint = () => {
    setFormData((prev) => ({
      ...prev,
      constraints: [...prev.constraints, ''],
    }));
  };

  const removeConstraint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      constraints: prev.constraints.filter((_, i) => i !== index),
    }));
  };

  const updateConstraint = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      constraints: prev.constraints.map((c, i) => (i === index ? value : c)),
    }));
  };

  return (
    <DraggableModal
      title="Create New Problem"
      isOpen={isOpen}
      onClose={onClose}
      initialPosition={{ x: 150, y: 50 }}
      initialSize={{ width: 700, height: 600 }}
      icon={<Plus size={16} className="text-green-600" />}
      zIndex={zIndex}
      onBringToFront={onBringToFront}
    >
      <div className="h-full overflow-auto p-6">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-blue-800">
                Create your own coding problem
              </span>
            </div>
            <p className="mt-1 text-xs text-blue-700">
              Perfect for coding exercises, interview prep, or custom practice
              problems
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Problem Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., Two Sum, Valid Parentheses"
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    difficulty: e.target.value as any,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Source (Optional)
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, source: e.target.value }))
              }
              placeholder="e.g., CodePath, LeetCode, Interview Question"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Problem Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the problem clearly. Use markdown formatting if needed..."
              rows={4}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Examples */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Examples *
              </label>
              <button
                onClick={addExample}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus size={14} />
                Add Example
              </button>
            </div>

            {errors.examples && (
              <p className="mb-2 text-xs text-red-600">{errors.examples}</p>
            )}

            <div className="space-y-4">
              {formData.examples.map((example, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Example {index + 1}
                    </span>
                    {formData.examples.length > 1 && (
                      <button
                        onClick={() => removeExample(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-gray-600">
                        Input
                      </label>
                      <textarea
                        value={example.input}
                        onChange={(e) =>
                          updateExample(index, 'input', e.target.value)
                        }
                        placeholder="Input for this example"
                        rows={2}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-gray-600">
                        Output
                      </label>
                      <textarea
                        value={example.output}
                        onChange={(e) =>
                          updateExample(index, 'output', e.target.value)
                        }
                        placeholder="Expected output"
                        rows={2}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={example.explanation || ''}
                      onChange={(e) =>
                        updateExample(index, 'explanation', e.target.value)
                      }
                      placeholder="Explain how this example works..."
                      rows={2}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Constraints
              </label>
              <button
                onClick={addConstraint}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus size={14} />
                Add Constraint
              </button>
            </div>

            {errors.constraints && (
              <p className="mb-2 text-xs text-red-600">{errors.constraints}</p>
            )}

            <div className="space-y-2">
              {formData.constraints.map((constraint, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={constraint}
                    onChange={(e) => updateConstraint(index, e.target.value)}
                    placeholder="e.g., 1 <= n <= 10^4"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {formData.constraints.length > 0 && (
                    <button
                      onClick={() => removeConstraint(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 border-t pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Save size={16} />
              )}
              {isSaving ? 'Creating...' : 'Create Problem'}
            </button>

            <button
              onClick={handleReset}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
            >
              Reset
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DraggableModal>
  );
};

export default CreateProblemModal;
