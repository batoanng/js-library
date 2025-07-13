import type { FormOption } from '@/types';

import { FormMultiSelect } from './FormMultiSelect';
import { StoryForm } from '@/form/stories';

export default {
  title: 'Forms/Atoms/MultiSelect',

  decorators: [],
};

interface FormValues {
  animals: string[];
}

interface OptionalFormValues {
  animals?: string[];
}

const options: FormOption[] = [
  { label: 'Cats', value: 'cats' },
  { label: 'Dogs', value: 'dogs' },
  { label: 'Elephants', value: 'elephants' },
  { label: 'Rabbits', value: 'rabbits' },
  { label: 'Spiders', value: 'spiders' },
];

const LONG_OPTIONS: FormOption[] = Array.from({ length: 100 }, (_, i) => ({
  label: `Option ${i}`,
  value: `option-${i}`,
}));

const HELP_MESSAGE_OPTIONS: FormOption[] = Array.from({ length: 100 }, (_, i) => ({
  label: `Option ${i}`,
  value: `option-${i}`,
  helpMessage: `Some help message for ${i}`,
}));

const DISABLED_OPTIONS: FormOption[] = Array.from({ length: 100 }, (_, i) => ({
  label: `Option ${i}`,
  value: `option-${i}`,
  disabled: i % 2 === 0,
}));

export const Default = () => {
  return (
    <StoryForm<FormValues>>
      <FormMultiSelect<FormValues, 'animals'> name="animals" label="Select your favourite animals" options={options} />
    </StoryForm>
  );
};

export const Optional = () => {
  return (
    <StoryForm<OptionalFormValues>>
      <FormMultiSelect<FormValues, 'animals'> name="animals" label="Select your favourite animals" options={options} />
    </StoryForm>
  );
};

export const LongList = () => {
  return (
    <StoryForm<FormValues>>
      <FormMultiSelect<FormValues, 'animals'>
        name="animals"
        label="Select your favourite animals"
        options={LONG_OPTIONS}
      />
    </StoryForm>
  );
};

export const HelpMessage = () => {
  return (
    <StoryForm<FormValues>>
      <FormMultiSelect<FormValues, 'animals'>
        name="animals"
        label="Select your favourite animals"
        options={HELP_MESSAGE_OPTIONS}
      />
    </StoryForm>
  );
};

export const CustomWidth = () => {
  return (
    <StoryForm<FormValues>>
      <FormMultiSelect<FormValues, 'animals'>
        name="animals"
        label="Select your favourite animals"
        options={HELP_MESSAGE_OPTIONS}
        inputWidth="md"
      />
    </StoryForm>
  );
};

export const DisableOptions = () => {
  return (
    <StoryForm<FormValues>>
      <FormMultiSelect<FormValues, 'animals'>
        name="animals"
        label="Select your favourite animals"
        options={DISABLED_OPTIONS}
      />
    </StoryForm>
  );
};

interface Animal {
  id: number;
  species: string;
}

const animals: Animal[] = [
  { id: 1, species: 'Cat' },
  { id: 2, species: 'Dog' },
  { id: 3, species: 'Elephant' },
  { id: 4, species: 'Rabbit' },
  { id: 5, species: 'Spider' },
];

const animalOptions: FormOption<Animal>[] = animals.map((value) => ({ label: `${value.species}s`, value }));

interface AnimalFormValues {
  animals: Animal[];
}

export const NonFormObjectValues = () => {
  return (
    <StoryForm<AnimalFormValues>>
      <FormMultiSelect<AnimalFormValues, 'animals', Animal, Animal>
        name="animals"
        label="Select your favourite animals"
        options={animals}
        getOptionKey={(animal) => animal.id.toString()}
        getOptionLabel={(animal) => animal.species}
        getOptionValue={(animal) => animal}
        areOptionValuesEqual={(left, right) => left?.id === right?.id}
      />
    </StoryForm>
  );
};

export const FormOptionComplexValues = () => {
  return (
    <StoryForm<AnimalFormValues>>
      <FormMultiSelect<AnimalFormValues, 'animals'>
        name="animals"
        label="Select your favourite animals"
        options={animalOptions}
      />
    </StoryForm>
  );
};

const complexAnimalOptions: FormOption<{ animal: Animal }>[] = [
  { label: 'Cats', value: { animal: { id: 1, species: 'Cat' } } },
  { label: 'Dogs', value: { animal: { id: 2, species: 'Dog' } } },
  { label: 'Elephants', value: { animal: { id: 3, species: 'Elephant' } } },
  { label: 'Rabbits', value: { animal: { id: 4, species: 'Rabbit' } } },
  { label: 'Spiders', value: { animal: { id: 5, species: 'Spider' } } },
];

export const SuperComplexValues = () => {
  return (
    <StoryForm<AnimalFormValues>>
      <FormMultiSelect<AnimalFormValues, 'animals', { animal: Animal }>
        name="animals"
        label="Select your favourite animals"
        options={complexAnimalOptions}
        getOptionKey={(option) => option.value.animal.id.toString()}
      />
    </StoryForm>
  );
};
