import { QuestionValues } from '@/schemas/formBuilderSchema';
import { numberValidationQuestionTypes, textValidationQuestionTypes, ValidationRules } from '@/types/formBuilder';

export function buildValidationRules(values: QuestionValues): ValidationRules | null {
  if (textValidationQuestionTypes.includes(values.questionType)) {
    const rules: ValidationRules = {};

    if (typeof values.minLength === 'number' && !Number.isNaN(values.minLength)) {
      rules.minLength = values.minLength;
    }

    if (typeof values.maxLength === 'number' && !Number.isNaN(values.maxLength)) {
      rules.maxLength = values.maxLength;
    }

    if (values.pattern && values.pattern.trim()) {
      rules.pattern = values.pattern.trim();
    }

    return Object.keys(rules).length > 0 ? rules : null;
  }

  if (numberValidationQuestionTypes.includes(values.questionType)) {
    const rules: ValidationRules = {};

    if (typeof values.minValue === 'number' && !Number.isNaN(values.minValue)) {
      rules.min = values.minValue;
    }

    if (typeof values.maxValue === 'number' && !Number.isNaN(values.maxValue)) {
      rules.max = values.maxValue;
    }

    return Object.keys(rules).length > 0 ? rules : null;
  }

  return null;
}