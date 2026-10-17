import { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { TrashIcon } from '@phosphor-icons/react';
import { Overlay, Content, Title } from './DialogStyles';
import { FormActions, FormError, SecondaryButton, DangerButton } from './FormStyles';
import Loader from './Loader';

interface ConfirmDeleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => Promise<{ success: boolean; error?: string | null }>;
}

export default function ConfirmDelete({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: ConfirmDeleteProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const inFlight = useRef(false);

  const confirm = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError(null);
    try {
      const result = await onConfirm();
      if (result.success) onOpenChange(false);
      else setError(result.error || 'Unable to delete. Please try again.');
    } catch {
      setError('Unable to delete. Please try again.');
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={next => {
        if (inFlight.current) return;
        setError(null);
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Overlay />
        <Content
          aria-busy={pending}
          onOpenAutoFocus={event => {
            event.preventDefault();
            cancelRef.current?.focus();
          }}
        >
          <Title>{title}</Title>
          <Dialog.Description
            style={{ margin: 0, lineHeight: 1.6, textAlign: 'center', overflowWrap: 'anywhere' }}
          >
            {description}
          </Dialog.Description>
          {error && <FormError>{error}</FormError>}
          <FormActions>
            <Dialog.Close asChild>
              <SecondaryButton ref={cancelRef} type="button" disabled={pending}>
                Cancel
              </SecondaryButton>
            </Dialog.Close>
            <DangerButton type="button" disabled={pending} onClick={confirm}>
              {pending ? 'Deleting' : 'Delete'}
              {pending ? <Loader size="small" /> : <TrashIcon size={20} />}
            </DangerButton>
          </FormActions>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
