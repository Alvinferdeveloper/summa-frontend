
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useDisabilityTypes } from '@/app/profile/hooks/useDisabilityTypes';
import { useCompleteOnboarding } from '@/app/profile/hooks/useCompleteOnboarding';

export default function OnboardingForm() {
  const { update } = useSession();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<number>>(new Set());
  const [formError, setFormError] = useState<string | null>(null);

  const { data: disabilityTypes, isLoading: isLoadingTypes, error: typesError } = useDisabilityTypes();
  const { mutate: completeOnboarding, isPending, error: mutationError } = useCompleteOnboarding();

  const handleTypeChange = (typeId: number) => {
    const newSelection = new Set(selectedTypes);
    if (newSelection.has(typeId)) {
      newSelection.delete(typeId);
    } else {
      newSelection.add(typeId);
    }
    setSelectedTypes(newSelection);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || selectedTypes.size === 0) {
      setFormError('All fields are required.');
      return;
    }
    setFormError(null);

    completeOnboarding({
      first_name: firstName,
      last_name: lastName,
      disability_type_ids: Array.from(selectedTypes),
    }, {
      onSuccess: () => {
        update({ onboardingCompleted: true });
      },
    });
  };

  if (isLoadingTypes) return <div>Loading form...</div>;

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '2rem' }}>
      <h2>Complete Your Profile</h2>
      <p>Please fill out this essential information to get started.</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Disability Types (Select all that apply)</label>
          {typesError && <p style={{ color: 'red' }}>Could not load options.</p>}
          {disabilityTypes?.map((type) => (
            <div key={type.ID}>
              <input
                type="checkbox"
                id={`type-${type.ID}`}
                checked={selectedTypes.has(type.ID)}
                onChange={() => handleTypeChange(type.ID)}
              />
              <label htmlFor={`type-${type.ID}`}>{type.name}</label>
            </div>
          ))}
        </div>
        {formError && <p style={{ color: 'red' }}>{formError}</p>}
        {mutationError && <p style={{ color: 'red' }}>An error occurred. Please try again.</p>}
        <button type="submit" disabled={isPending} style={{ padding: '0.75rem 1.5rem' }}>
          {isPending ? 'Saving...' : 'Save and Continue'}
        </button>
      </form>
    </div>
  );
}
