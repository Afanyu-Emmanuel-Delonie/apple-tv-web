import { useState, useEffect } from 'react';
import { TEXT_LIMITS, countCharacters, exceedsLimit } from '../utils/textUtils';

export default function TextInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  maxLength, 
  textType = 'default',
  required = false,
  multiline = false,
  className = '',
  showCounter = true,
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);
  
  // Get appropriate limit based on text type
  const getLimit = () => {
    switch (textType) {
      case 'headline': return TEXT_LIMITS.HEADLINE_MEDIUM;
      case 'excerpt': return TEXT_LIMITS.EXCERPT_MEDIUM;
      case 'author': return TEXT_LIMITS.AUTHOR_NAME;
      case 'category': return TEXT_LIMITS.CATEGORY_NAME;
      case 'event-title': return TEXT_LIMITS.EVENT_TITLE;
      case 'opportunity-title': return TEXT_LIMITS.OPPORTUNITY_TITLE;
      case 'company': return TEXT_LIMITS.COMPANY_NAME;
      case 'location': return TEXT_LIMITS.LOCATION_NAME;
      case 'meta-description': return TEXT_LIMITS.META_DESCRIPTION;
      default: return maxLength || 500;
    }
  };

  const limit = getLimit();
  const currentLength = countCharacters(value || '');
  const isOverLimit = exceedsLimit(value || '', limit);
  const remainingChars = limit - currentLength;

  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Allow typing but warn when over limit
    onChange(e);
  };

  const getCounterColor = () => {
    if (remainingChars < 0) return 'text-red-500';
    if (remainingChars < limit * 0.1) return 'text-orange-500';
    return 'text-gray-500';
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <InputComponent
          type={multiline ? undefined : 'text'}
          value={value || ''}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${isOverLimit ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            ${multiline ? 'min-h-[100px] resize-vertical' : ''}
          `}
          rows={multiline ? 4 : undefined}
          {...props}
        />
        
        {showCounter && (isFocused || isOverLimit) && (
          <div className={`absolute -bottom-6 right-0 text-xs ${getCounterColor()}`}>
            {currentLength}/{limit}
            {isOverLimit && (
              <span className="ml-2 text-red-500 font-medium">
                ({Math.abs(remainingChars)} over limit)
              </span>
            )}
          </div>
        )}
      </div>
      
      {isOverLimit && (
        <p className="text-xs text-red-600 mt-1">
          Text exceeds recommended limit of {limit} characters. Consider shortening for better display.
        </p>
      )}
      
      {/* Helpful hints based on text type */}
      {textType === 'headline' && isFocused && (
        <p className="text-xs text-gray-500 mt-1">
          Keep headlines concise and engaging. Aim for {TEXT_LIMITS.HEADLINE_SHORT}-{TEXT_LIMITS.HEADLINE_MEDIUM} characters.
        </p>
      )}
      
      {textType === 'excerpt' && isFocused && (
        <p className="text-xs text-gray-500 mt-1">
          Write a compelling summary that encourages readers to click. Aim for {TEXT_LIMITS.EXCERPT_SHORT}-{TEXT_LIMITS.EXCERPT_MEDIUM} characters.
        </p>
      )}
      
      {textType === 'meta-description' && isFocused && (
        <p className="text-xs text-gray-500 mt-1">
          This appears in search results. Make it descriptive and include key terms. Max {TEXT_LIMITS.META_DESCRIPTION} characters.
        </p>
      )}
    </div>
  );
}

// Specialized components for common use cases
export function HeadlineInput(props) {
  return <TextInput textType="headline" {...props} />;
}

export function ExcerptInput(props) {
  return <TextInput textType="excerpt" multiline {...props} />;
}

export function AuthorInput(props) {
  return <TextInput textType="author" {...props} />;
}

export function EventTitleInput(props) {
  return <TextInput textType="event-title" {...props} />;
}

export function OpportunityTitleInput(props) {
  return <TextInput textType="opportunity-title" {...props} />;
}

export function CompanyInput(props) {
  return <TextInput textType="company" {...props} />;
}

export function LocationInput(props) {
  return <TextInput textType="location" {...props} />;
}

export function MetaDescriptionInput(props) {
  return <TextInput textType="meta-description" multiline {...props} />;
}