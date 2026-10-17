import styled from 'styled-components';

const MobileNavigation = styled.nav<{ $mobileOnly?: boolean }>`
  display: ${({ $mobileOnly }) => ($mobileOnly ? 'none' : 'contents')};

  .mobile-logout {
    display: none;
  }

  @media (max-width: 576px) {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 250;
    gap: 4px;
    box-sizing: border-box;
    padding: 8px 12px;
    padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
    padding-left: max(12px, env(safe-area-inset-left, 0px));
    padding-right: max(12px, env(safe-area-inset-right, 0px));
    background: rgba(33, 33, 40, 0.97);
    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
    border-top: 1px solid rgba(249, 244, 218, 0.15);
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.15);

    .mobile-logout {
      display: contents;
    }

    .mobile-logout .mobile-nav-item {
      order: -1;
    }
    > a.mobile-nav-item {
      order: 1;
    }

    && .mobile-nav-item {
      position: static;
      inset: auto;
      margin: 0;
      width: 100%;
      min-width: 0;
      height: 56px;
      min-height: 56px;
      box-sizing: border-box;
      display: grid;
      grid-template-rows: 24px 16px;
      justify-items: center;
      align-content: center;
      align-items: center;
      gap: 4px;
      padding: 6px 4px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 10px;
      color: var(--offWhite);
      font-family: inherit;
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 16px;
      text-decoration: none;
      text-align: center;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;

      > svg,
      > div {
        grid-row: 1;
        grid-column: 1;
      }
      > svg {
        display: block;
        width: 22px;
        height: 22px;
      }
      > span {
        grid-row: 2;
        grid-column: 1;
        white-space: nowrap;
      }

      &:hover,
      &[data-state='open'] {
        background: rgba(123, 94, 166, 0.22);
      }
      &:disabled {
        opacity: 0.55;
      }
    }
  }
`;

export default MobileNavigation;
