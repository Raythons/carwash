import React from 'react';
import { useOwnerAnimals } from '../../hooks/queries/useOwnerQueries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const AnimalSelector = ({ ownerId, selectedAnimalId, onAnimalChange, disabled }) => {
  const { data: animals, isLoading, error } = useOwnerAnimals(ownerId);

  if (isLoading) return <p>Loading animals...</p>;
  if (error) return <p>Error loading animals.</p>;

  return (
    <Select
      value={selectedAnimalId || ''}
      onValueChange={onAnimalChange}
      disabled={disabled || !animals || animals.length === 0}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select an animal" />
      </SelectTrigger>
      <SelectContent>
        {animals && animals.map((animal) => (
          <SelectItem key={animal.id} value={animal.id.toString()}>
            {animal.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AnimalSelector;
