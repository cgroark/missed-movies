import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Overlay, Content, Title, CloseButton } from './DialogStyles';
import { XCircleIcon } from '@phosphor-icons/react';
import type { movie } from '../../types/types';
import MovieForm from '../movies/MovieForm';
import CategoryForm from '../categories/CategoryForm';

type ModalProps = {
  action: 'add' | 'edit' | 'category';
  movie: movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAfterSave: () => Promise<void>;
};

function Modal({ action, movie, onOpenChange, open }: ModalProps) {
  const [isAddingCategory, setAddingCategory] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<movie | null>(movie);

  useEffect(() => {
    if (!open) setAddingCategory(false);
    if (open && movie) setCurrentMovie(movie);
  }, [open, movie]);

  const handleClose = () => onOpenChange(false);
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isAddingCategory) {
      setAddingCategory(false);
      return;
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content aria-describedby={undefined}>
          <CloseButton className="no-hover" aria-label="Close dialog">
            <XCircleIcon size={32} />
          </CloseButton>
          <Title>
            {isAddingCategory ? (
              'Add category'
            ) : action === 'category' ? (
              'Categories'
            ) : (
              <em>{currentMovie?.title}</em>
            )}
          </Title>
          {action === 'category' ? (
            <CategoryForm onClose={handleClose} />
          ) : (
            <>
              <div hidden={isAddingCategory}>
                <MovieForm
                  currentMovie={currentMovie}
                  action={action}
                  onClose={handleClose}
                  onAddCategory={() => setAddingCategory(true)}
                />
              </div>
              {isAddingCategory && (
                <CategoryForm addOnly onClose={() => setAddingCategory(false)} />
              )}
            </>
          )}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
