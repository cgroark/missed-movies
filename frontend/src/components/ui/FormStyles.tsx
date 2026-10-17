import styled from 'styled-components';

export const FormHint = styled.p`
  margin: 0 0 24px;
  color: inherit;
  opacity: 0.7;
  font-size: 0.875rem;
  line-height: 1.6;
  text-align: left;
`;

export const FormActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(123, 94, 166, 0.18);

  > button {
    flex: 1;
  }
`;

export const SecondaryButton = styled.button`
  && {
    background: transparent;
    color: inherit;
    border: 1px solid rgba(123, 94, 166, 0.3);

    &:hover {
      background: rgba(123, 94, 166, 0.08);
    }
  }
`;

export const DangerButton = styled(SecondaryButton)`
  && {
    color: #a52c44;
    border-color: rgba(165, 44, 68, 0.25);
    &:hover {
      background: rgba(165, 44, 68, 0.08);
    }
  }
`;

export const FormError = styled.p.attrs({ role: 'alert' })`
  text-align: left;
  color: #b6334b;
  background: rgba(207, 70, 91, 0.09);
  border: 1px solid rgba(207, 70, 91, 0.25);
  border-radius: 10px;
  padding: 10px 12px;
  margin: 12px 0 18px;
  font-size: 0.875rem;
  overflow-wrap: anywhere;
`;

export const FieldError = styled.p.attrs({ role: 'alert' })`
  margin: -14px 0 20px;
  color: #b6334b;
  text-align: left;
  font-size: 0.8rem;
  line-height: 1.5;
`;
