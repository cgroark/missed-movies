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
