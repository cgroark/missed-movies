import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';
import {XCircleIcon} from '@phosphor-icons/react';
import type { movie } from '../types/types';
import MovieForm from './MovieForm';
import CategoryForm from './CategoryForm';

type ModalProps = {
  action: 'add' | 'edit' | 'category';
  movie: movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAfterSave: () => Promise<void>;
};

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const Content = styled(Dialog.Content)`
  background: var(--offWhite);
  color: var(--lightBlack);
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  margin: auto;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const Title = styled(Dialog.Title)`
  font-size: 1.5rem;
  margin: 0 0 20px 0;
  text-align: center;
`;

const CloseButton = styled(Dialog.Close)`
  padding: 0;
  display: block;
  margin-left: auto;
  background: transparent;
  color: var(--purple);
  border: none;
  cursor: pointer;
  &:hover {
    color: var(--darkPurple);
  }
`;

function Modal({action, movie, onOpenChange, open, onAfterSave }: ModalProps) {

  const [currentMovie, setCurrentMovie] = useState<movie | null>(movie);

  useEffect(() => {
    if (open && movie) setCurrentMovie(movie);
  }, [open, movie]);

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content aria-describedby={undefined}>
          <CloseButton><XCircleIcon size={32} /></CloseButton>
          <Title>
            {action === 'category' ? 'Categories' :
              <em>{currentMovie?.title}</em>
            }
          </Title>
            {action === 'category' ?
            <CategoryForm />
            :
            <MovieForm
              currentMovie={currentMovie}
              action={action}
              onClose={handleClose}
            />
          }
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;