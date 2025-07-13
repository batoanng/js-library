import type { FormOption } from '@/types';

import { FormChecklist } from './FormChecklist';
import { FormGroup, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { StoryForm } from '@/form/stories';

export default {
  title: 'Forms/Atoms/Checklist',
  decorators: [],
};

interface CustomObject {
  prop1: string;
  prop2: number;
}

interface TestFormValues {
  storyChecklist: string[];
  primitiveChecklist: number[];
  customObjectChecklist: CustomObject[];
}

const options = [
  { label: 'Option 1', value: 'op1' },
  { label: 'Option 2', value: 'op2' },
];

const businessNameOptions = [
  { label: 'DYNAMIC PODS', value: 'BN1' },
  { label: 'DYNAMIC STEEL FRAME', value: 'BN2' },
  { label: 'TOOL KIT DEPOT', value: 'BN3' },
  { label: 'CRAFTRIGHT', value: 'BN4' },
  { label: 'ONYA PRO', value: 'BN5' },
  { label: 'PROJECT GEAR', value: 'BN6' },
  { label: 'PROJECT TOOLS', value: 'BN7' },
  { label: 'BENCHMARK TOOLS', value: 'BN8' },
  { label: 'ONYA TOOLS', value: 'BN9' },
  { label: 'GARDENBASICS', value: 'BN10' },
  { label: 'ADELAIDE TOOLS', value: 'BN11' },
  { label: 'ADELAIDE TRADE TOOLS', value: 'BN12' },
  { label: 'DISCOUNT POWER TOOLS (S.A.)', value: 'BN13' },
  { label: 'ELECTRIC POWER TOOL SERVICES', value: 'BN14' },
  { label: 'OAKLANDS MOWER CENTRE', value: 'BN15' },
  { label: 'OAKLANDS ROAD MOWER CENTRE', value: 'BN16' },
  { label: 'TOOLS NOT TOYS', value: 'BN17' },
  { label: 'CLEVER LIVING CO', value: 'BN18' },
  { label: 'BUNNINGS KITCHEN COLLECTIVE', value: 'BN19' },
  { label: 'THE KITCHEN COLLECTIVE CO', value: 'BN20' },
  { label: 'HOME@GLADESVILLE', value: 'BN21' },
  { label: 'GLADESVILLE HOMEMAKER CENTRE', value: 'BN22' },
  { label: 'BUNNINGS OUTDOORS', value: 'BN23' },
  { label: 'BIG PRAWN', value: 'BN24' },
  { label: 'BUNNINGS TRADE', value: 'BN25' },
  { label: 'BUNNINGS', value: 'BN26' },
  { label: 'NARELLAN HOMEMAKER CENTRE', value: 'BN27' },
  { label: 'BUNNINGS WAREHOUSE', value: 'BN28' },
  { label: 'HARDWARE CAFE', value: 'BN29' },
];

export const Default = () => {
  return (
    <StoryForm>
      <FormChecklist<TestFormValues, 'storyChecklist'>
        id="simple"
        name="storyChecklist"
        label="This is the label"
        options={options}
      />
    </StoryForm>
  );
};

export const Columns = () => {
  const [numColumns, setNumColumns] = useState<number>(1);

  function handleOnChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    event.preventDefault();
    const value = parseInt(event.target.value, 10);
    setNumColumns(value > 4 ? 4 : value);
  }

  return (
    <StoryForm>
      <FormGroup sx={{ marginBottom: 4, width: '100px' }}>
        <TextField name="numColumns" type="number" label="No. Columns" value={numColumns} onChange={handleOnChange} />
      </FormGroup>
      <FormChecklist<TestFormValues, 'storyChecklist'>
        id="businessNameOptions"
        name="storyChecklist"
        label="This is the label"
        options={businessNameOptions.sort((a, b) => a.label.localeCompare(b.label))}
        numColumns={numColumns > 0 ? numColumns : 1}
      />
    </StoryForm>
  );
};

export const Rules = () => {
  return (
    <StoryForm>
      <FormChecklist<TestFormValues, 'storyChecklist'>
        name="storyChecklist"
        label="This is the label"
        options={options}
        rules={{
          required: 'You must check me!',
        }}
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
      <FormChecklist<TestFormValues, 'storyChecklist'>
        name="storyChecklist"
        label="This is the number label"
        options={options}
        rules={{
          required: 'You must check me!',
        }}
      />
    </StoryForm>
  );
};

export const Primitive = () => {
  const options = [1, 2];

  return (
    <StoryForm>
      <FormChecklist<TestFormValues, 'primitiveChecklist', number, number>
        name="primitiveChecklist"
        label="This is the label"
        options={options}
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
      <FormChecklist<TestFormValues, 'customObjectChecklist', CustomObject, CustomObject>
        name="customObjectChecklist"
        label="This is the label"
        options={options}
        getOptionKey={(o) => o.prop1}
        getOptionLabel={(o) => `$${o.prop2}`}
        areOptionValuesEqual={(x, y) => x?.prop1 === y?.prop1}
      />
    </StoryForm>
  );
};
