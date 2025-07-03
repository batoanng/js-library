import { Button } from '@mui/material';
import { useState } from 'react';

import { Modal } from '@/components/molecules/Modal/Modal';

export default {
  title: 'Components/Molecules/Modal',
  decorators: [],
};

export const Transactional = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        open={isOpen}
        heading={'Your submission was successful'}
        primaryButton={{
          text: 'Make new submission',
          onClick: () => setIsOpen(false),
          variant: 'contained',
          color: 'secondary',
        }}
        secondaryButton={{
          text: 'View submissions',
          onClick: () => setIsOpen(false),
          variant: 'outlined',
          color: 'secondary',
        }}
        text={
          'Thank you for your submission, it has been successfully received. We aim to respond within 3 business days by your preferred contact method. You can now make another submission or view your active submission. '
        }
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const SingleCallToAction = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        open={isOpen}
        heading={'Changing how we design services'}
        primaryButton={{
          text: 'Proceed',
          onClick: () => setIsOpen(false),
          variant: 'contained',
          color: 'secondary',
        }}
        text={
          'A service is any activity that helps someone complete a task. With that in mind, all public servants – whether they work in digital, communications, policy or operations – are involved in designing services.\n' +
          'Services are groups of transactions, activities or information that work together. They might take place online or offline.\n' +
          'Government services often require people to go through the service in the way that government designs it, and often this design is not simple or easy to follow.'
        }
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const Danger = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        open={isOpen}
        heading={'Delete file permanently?'}
        primaryButton={{
          text: 'Delete',
          onClick: () => setIsOpen(false),
          variant: 'contained',
          color: 'primary',
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: () => setIsOpen(false),
          variant: 'outlined',
          color: 'secondary',
        }}
        text={'If you delete this file, you will not be able to recover it. Do you want to delete?'}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const Dismissible = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        dismiss
        open={isOpen}
        heading={'Changes will be lost'}
        primaryButton={{
          text: 'Exit form',
          onClick: () => setIsOpen(false),
          variant: 'contained',
          color: 'secondary',
        }}
        secondaryButton={{
          text: 'Return to form',
          onClick: () => setIsOpen(false),
          variant: 'outlined',
          color: 'secondary',
        }}
        text={
          'This form contains unsaved changes. By exiting, all unsaved changes will be permanently lost. If you wish to save your changes, return to form and follow the prompts to save your progress. If you do not wish to keep any unsaved changes you can proceed to exit the form. '
        }
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const OpenByDefault = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        open={isOpen}
        heading={'Your submission was successful'}
        primaryButton={{
          text: 'Make new submission',
          onClick: () => setIsOpen(false),
          variant: 'contained',
          color: 'secondary',
        }}
        secondaryButton={{
          text: 'View submissions',
          onClick: () => setIsOpen(false),
          variant: 'outlined',
          color: 'secondary',
        }}
        text={
          'Thank you for your submission, it has been successfully received. We aim to respond within 3 business days by your preferred contact method. You can now make another submission or view your active submission. '
        }
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const ModalNoContents = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        open={isOpen}
        heading={'Your submission was successful'}
        primaryButton={{
          text: 'Make new submission',
          onClick: () => setIsOpen(false),
          variant: 'contained',
          color: 'primary',
        }}
        secondaryButton={{
          text: 'View submissions',
          onClick: () => setIsOpen(false),
          variant: 'outlined',
          color: 'secondary',
        }}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export const ModalNoButtons = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        open={isOpen}
        heading={'Your submission was successful'}
        text={
          'Thank you for your submission, it has been successfully received. We aim to respond within 3 business days by your preferred contact method. You can now make another submission or view your active submission. '
        }
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
