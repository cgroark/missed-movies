import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';
import {PlusIcon, PencilIcon, FilmReelIcon, XCircleIcon} from '@phosphor-icons/react';
import type { movie } from '../types/types';
import MovieForm from './MovieForm';

type ModalProps = {
  action: 'add' | 'edit',
  movie: movie,
}

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
  margin: 0;
`;

const Description = styled(Dialog.Description)`
  font-size: 1rem;
  margin-bottom: 1.5rem;
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

const OpenButton = styled.div`
  background-color: var(--purple);
  border-radius: 50%;
  padding-top: .25rem;
  margin: -30px 0 0 150px;
  width: 35px;
  height: 30px;
  border: solid 2px #050505;
  position: absolute;
  cursor: pointer;
  transition: 200ms cubic-bezier(0.25, 0.1, 0.25, 1);

  @media (max-width: 768px) {
    margin: -30px 0 0 80px;
  }

  &:hover {
    transform: scale(1.1);
  }
`

function Modal({action, movie }: ModalProps) {

  const [open, setOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<movie | undefined>(movie);

  useEffect(() => {
    if (open) setCurrentMovie(movie);
  }, [open, movie]);

  const handleClose = () => setOpen(false);


  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <OpenButton>
          {action === 'add' ?
          <PlusIcon size={24} />
        :
          <PencilIcon size={24} />
        }
        </OpenButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Overlay />
        <Content>
          <CloseButton><XCircleIcon size={32} /></CloseButton>
          <Title style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
              <FilmReelIcon size={32} />
              <em>{currentMovie?.title}</em>
          </Title>
          <Description>
            <MovieForm
              currentMovie={currentMovie}
              action={action}
              onClose={handleClose}
            />
          </Description>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;