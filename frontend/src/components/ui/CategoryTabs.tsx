import styled from 'styled-components';

export const CategoryToolbar = styled.section`
  box-sizing: border-box;
  width: calc(100% - 40px);
  max-width: 1205px;
  margin: 0 auto 28px;
  padding: 0;

  h2 {
    margin: 0 0 10px;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(249, 244, 218, 0.6);
    text-align: left;
  }
`;

export const CategoryControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px;
  background: rgba(249, 244, 218, 0.035);
  border: 1px solid rgba(249, 244, 218, 0.1);
  border-radius: 16px;
  min-width: 0;
`;

export const CategoryList = styled.ul`
  padding: 4px;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--purple) transparent;

  @media (min-width: 577px) {
    justify-content: safe center;
  }

  li {
    flex-shrink: 0;
  }
`;

export const CategoryButton = styled.button`
  && {
    min-height: 44px;
    padding: 8px 16px;
    border-radius: 10px;
    background: transparent;
    border: 1px solid transparent;
    color: rgba(249, 244, 218, 0.75);
    font-size: 0.9rem;
    white-space: nowrap;

    &:hover {
      background: rgba(249, 244, 218, 0.06);
    }
    &.active {
      background: rgba(123, 94, 166, 0.3);
      border-color: rgba(189, 162, 227, 0.4);
      color: var(--offWhite);
    }
  }
`;

export const MediaTypeSwitch = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  width: fit-content;
  max-width: 100%;
  padding: 3px;
  margin: 0 auto 14px;
  border: 1px solid rgba(249, 244, 218, 0.12);
  border-radius: 12px;
  background: rgba(14, 14, 18, 0.48);
`;

export const MediaTypeButton = styled.button`
  && {
    min-height: 36px;
    padding: 7px 14px;
    border: 1px solid transparent;
    border-radius: 9px;
    background: transparent;
    color: rgba(249, 244, 218, 0.68);
    box-shadow: none;
    font-size: 0.82rem;
    font-weight: 500;
    white-space: nowrap;

    &[aria-pressed='true'] {
      border-color: rgba(70, 213, 187, 0.32);
      background: linear-gradient(135deg, rgba(70, 213, 187, 0.2), rgba(70, 213, 187, 0.08));
      color: var(--offWhite);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
    }

    &:hover:not([aria-pressed='true']) {
      background: rgba(249, 244, 218, 0.06);
      color: var(--offWhite);
    }
  }
`;
