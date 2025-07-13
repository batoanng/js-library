import { StoryForm } from '@/form/stories';
import { FormRadioGroup } from './FormRadioGroup';
import { YES_NO_OPTIONS } from './types';
import { FormOption } from '@/types';

export default {
  title: 'Forms/Atoms/Radio Group',
  decorators: [],
};

interface CustomObject {
  prop1: string;
  prop2: number;
}

interface TestFormValues {
  storyRadio: string;
  isGoodComponent: boolean;
  myNumber: number;
  customHelpMessage: string;
  myFavouriteAnimal: number;
  myCustomObject: CustomObject;
}

const options = [
  { label: 'Option 1', value: 'op1' },
  { label: 'Option 2', value: 'op2' },
];

export const Default = () => {
  return (
    <StoryForm>
      <FormRadioGroup<TestFormValues, 'storyRadio'> name="storyRadio" label="This is the label" options={options} />
    </StoryForm>
  );
};

export const Rules = () => {
  return (
    <StoryForm>
      <FormRadioGroup<TestFormValues, 'storyRadio'>
        name="storyRadio"
        label="This is the label"
        options={options}
        rules={{
          required: 'You must check me!',
        }}
      />
    </StoryForm>
  );
};

export const Disabled = () => {
  const disabledOptions = options.map((option, index) => ({
    ...option,
    disabled: index % 2 == 1,
  }));

  return (
    <StoryForm>
      <FormRadioGroup<TestFormValues, 'storyRadio'>
        name="storyRadio"
        label="This is the label"
        options={disabledOptions}
        rules={{
          required: 'You must check me!',
        }}
      />
    </StoryForm>
  );
};

export const BooleanValues = () => {
  return (
    <StoryForm>
      <FormRadioGroup<TestFormValues, 'isGoodComponent'>
        name="isGoodComponent"
        label="This is the good component label"
        options={YES_NO_OPTIONS}
        rules={{
          validate: (value: any) => {
            if (value == null) {
              return 'You must select an option.';
            }
            return undefined;
          },
        }}
      />
    </StoryForm>
  );
};

export const NumberValues = () => {
  const numberOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ];
  return (
    <StoryForm>
      <FormRadioGroup<TestFormValues, 'myNumber'>
        name="myNumber"
        label="This is the number label"
        options={numberOptions}
        rules={{
          required: 'You must check me!',
        }}
      />
    </StoryForm>
  );
};

export const ObjectValue = () => {
  const options: CustomObject[] = [
    { prop1: 'xyz', prop2: 10 },
    { prop1: 'abc', prop2: 20 },
  ];
  return (
    <StoryForm>
      <FormRadioGroup<TestFormValues, 'myCustomObject', CustomObject, CustomObject>
        name="myCustomObject"
        label="How much money do you have?"
        options={options}
        getOptionKey={(option: CustomObject) => option.prop2.toString()}
        getOptionLabel={(option: CustomObject) => `$${option.prop2}`}
        areOptionValuesEqual={(x: CustomObject, y: CustomObject) => x?.prop2 === y?.prop2}
      />
    </StoryForm>
  );
};

export const OptionsHelpMessages = () => {
  const options: FormOption[] = [
    { label: 'Option 1', value: '1', helpMessage: 'Custom Help Message' },
    { label: 'Option 2', value: '2', helpMessage: 'Custom Help message 2' },
  ];

  return (
    <StoryForm>
      <FormRadioGroup<TestFormValues, 'customHelpMessage'>
        name="customHelpMessage"
        label="This is the number label"
        options={options}
        rules={{
          required: 'You must check me!',
        }}
      />
    </StoryForm>
  );
};

interface Animal {
  name: string;
  description: string;
  skills: string;
  animalId: number;
}

export const CustomOptionDisplay = () => {
  const animals: Animal[] = [
    { name: 'Monkey', description: 'Monkey likes bananas', skills: 'Climb trees', animalId: 100 },
    { name: 'Tiger', description: 'Tiger likes meat', skills: 'Run fast', animalId: 101 },
    { name: 'Kangaroo', description: 'Monkey likes hopping', skills: 'Fight', animalId: 102 },
  ];

  return (
    <StoryForm>
      <FormRadioGroup<TestFormValues, 'myFavouriteAnimal', Animal, Animal>
        name="myFavouriteAnimal"
        label="What your faviourite animal?"
        options={animals}
        getOptionKey={(option: Animal) => option.animalId.toString()}
        getOptionLabel={(option: Animal) => `${option.name} - ${option.description} - ${option.skills}`}
        getOptionValue={(option: Animal) => option.animalId}
        rules={{
          required: 'You must check me!',
        }}
      />
    </StoryForm>
  );
};
