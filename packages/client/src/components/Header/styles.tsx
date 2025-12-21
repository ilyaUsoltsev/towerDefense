import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  width: 100%;
  height: 70px;
  padding: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AvatarWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const IconButton = styled.button`
  width: 40px;
  height: 40px;
  padding: 12px;
  border: 1px solid var(--g-color-base-brand);
  border-radius: 50%;
  background: transparent;

  & svg path {
    fill: var(--g-color-base-brand);
  }
`;
