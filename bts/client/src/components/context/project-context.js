import { createContext } from 'react';

export const ProjectContext = createContext({
  projectDetail: null,
  projectMembers: null,
  projectTickets: null,
  role: null,
  setProjectMembers: () => {},
  setProjectTickets: () => {},
});
