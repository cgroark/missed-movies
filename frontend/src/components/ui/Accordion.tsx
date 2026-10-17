import type { ReactNode } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import styled, { keyframes } from 'styled-components';
import { CaretDownIcon } from '@phosphor-icons/react';

interface AccordionProps {
  title: string;
  content: ReactNode;
}
const StyledAccordion = styled(Accordion.Root)`
  width: 100%;
`;

const Item = styled(Accordion.Item)`
  margin-top: 10px;
`;

const Trigger = styled(Accordion.Trigger)`
  all: unset;
  width: fit-content;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
  min-height: 32px;
  color: rgba(249, 244, 218, 0.75);
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background-color: transparent !important;
  }

  &:focus-visible {
    outline: 3px solid var(--focus-ring);
    outline-offset: 3px;
    border-radius: 4px;
  }

  &[data-state='open'] {
    svg {
      transform: rotate(180deg);
    }
  }
`;

const slideDown = keyframes`
  from {
      opacity: 0;
      transform: translateY(-5px);
    }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Content = styled(Accordion.Content)`
  background-color: transparent;
  text-align: left;
  font-size: 0.85rem;
  padding-top: 10px;
  line-height: 1.4;
  animation: ${slideDown} 300ms ease-out;
  border-top: 1px solid rgba(249, 244, 218, 0.15);
`;

export default function AccordionSection({ title, content }: AccordionProps) {
  return (
    <StyledAccordion type="single" collapsible>
      <Item value="item-1">
        <Trigger>
          {title} <CaretDownIcon size={24} />
        </Trigger>
        <Content>{content}</Content>
      </Item>
    </StyledAccordion>
  );
}
