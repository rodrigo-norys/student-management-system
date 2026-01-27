import styled from "styled-components";

export const StudentContainer = styled.div`
  margin-top: 15px;

  & > div {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-top: 1px solid #eee;
  }

  & > div:last-child {
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
  }

  .actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-right: 15px;
    min-width: 20px;
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    flex: 1;
    overflow: hidden;
  }

  .name {
    font-weight: bold;
    font-size: 16px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .email {
    font-size: 14px;
    color: #444;
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
`;

export const ProfilePicture = styled.div`
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  img, svg {
    width: 36px !important;
    height: 36px !important;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }
`;

export const HeaderToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;

  h1 {
    margin: 0;
  }
`;
