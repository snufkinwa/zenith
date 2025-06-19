'use client';

import React, { useState } from 'react';
import { Plus, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import DraggableModal from './DraggableModal';

interface CreateProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onBringToFront: () => void;
  onCreateProblem: (problem: NewProblem) => void;
}

interface NewProblem {
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
  onCreateProblem
}) => {
  const [formData, setFormData] = useState<NewProblem>({
    title: '',
    difficulty: 'Easy',
    description: '',
    examples: [{ input: '', output: '', explanation: '' }],
    constraints: [''],
    source: '',
    companies: []
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

    if (formData.examples.some(ex => !ex.input.trim() || !ex.output.trim())) {
      newErrors.examples = 'All examples must have input and output';
    }

    if (formData.constraints.some(c => !c.trim())) {
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
      const cleanedProblem: NewProblem = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        examples: formData.examples.filter(ex => ex.input.trim() && ex.output.trim()),
        constraints: formData.constraints.filter(c => c.trim()),
        source: (formData.source ?? '').trim() || 'Custom'
      };

      await onCreateProblem(cleanedProblem);
      handleReset();
      onClose();
    } catch (error) {
      console.error('Error creating problem:', error);
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
      companies: []
    });
    setErrors({});
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const updateExample = (index: number, field: keyof typeof formData.examples[0], value: string) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const addConstraint = () => {
    setFormData(prev => ({
      ...prev,
      constraints: [...prev.constraints, '']
    }));
  };

  const removeConstraint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      constraints: prev.constraints.filter((_, i) => i !== index)
    }));
  };

  const updateConstraint = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      constraints: prev.constraints.map((c, i) => i === index ? value : c)
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
      <div className="p-6 h-full overflow-auto">
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-blue-800">
                Create your own coding problem
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Perfect for CodePath exercises, interview prep, or custom practice problems
            </p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Two Sum, Valid Parentheses"
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="text-red-600 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source (Optional)
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
              placeholder="e.g., CodePath, LeetCode, Interview Question"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the problem clearly. Use markdown formatting if needed..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Examples */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Examples *
              </label>
              <button
                onClick={addExample}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus size={14} />
                Add Example
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.examples.map((example, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Example {index + 1}
                    </span>
                    {formData.examples.length > 1 && (
                      <button
                        onClick={() => removeExample(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Input
                      </label>
                      <textarea
                        value={example.input}
                        onChange={(e) => updateExample(index, 'input', e.target.value)}
                        placeholder="nums = [2,7,11,15], target = 9"
                        rows={2}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Output
                      </label>
                      <textarea
                        value={example.output}
                        onChange={(e) => updateExample(index, 'output', e.target.value)}
                        placeholder="[0,1]"
                        rows={2}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={example.explanation}
                      onChange={(e) => updateExample(index, 'explanation', e.target.value)}
                      placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]."
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {errors.examples && (
              <p className="text-red-600 text-xs mt-1">{errors.examples}</p>
            )}
          </div>

          {/* Constraints */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Constraints
              </label>
              <button
                onClick={addConstraint}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus size={14} />
                Add Constraint
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.constraints.map((constraint, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={constraint}
                    onChange={(e) => updateConstraint(index, e.target.value)}
                    placeholder="e.g., 2 <= nums.length <= 104"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.constraints.length > 1 && (
                    <button
                      onClick={() => removeConstraint(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {errors.constraints && (
              <p className="text-red-600 text-xs mt-1">{errors.constraints}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 transition-colors"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isSaving ? 'Creating...' : 'Create Problem'}
            </button>
            
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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