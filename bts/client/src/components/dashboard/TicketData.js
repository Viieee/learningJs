let id = 0;
const createData = (
  project,
  title,
  description,
  status,
  priority,
  type,
  assignedDevs,
  author,
  dateEnd,
  comments
) => {
  id += 1;
  return {
    id,
    project,
    title,
    description,
    status,
    priority,
    type,
    assignedDevs,
    author,
    dateEnd,
    comments,
  };
};

export let rows = [
  createData(
    'Project 4',
    'Ticket 1',
    'this is the description for the ticket test test test',
    'New',
    'High',
    'Bug',
    ['April Tucker', 'Ralph Hubbard', 'Omar Alexander'],
    'vieri adhitya',
    new Date(2022, 0, 1, 6, 55, 2),
    []
  ),
  createData(
    'Project 1',
    'Ticket 2',
    'this is the description for the ticket test test test',
    'In Progress',
    'Low',
    'Bug',
    [],
    'vieri adhitya',
    new Date(2022, 0, 1, 14, 55, 2),
    []
  ),
  createData(
    'Project 5',
    'Ticket 3',
    'this is the description for the ticket test test test',
    'ongoing',
    'low',
    'bug',
    [],
    'vieri adhitya1',
    new Date(2022, 3, 22, 15, 30, 0),
    []
  ),
  createData(
    'Project 1',
    'Ticket 4',
    'this is the description for the ticket test test test',
    'new',
    'low',
    'bug',
    [],
    'vieri adhitya1',
    new Date(2022, 3, 14, 12, 30, 0),
    []
  ),
  createData(
    'Project 3',
    'Ticket 5',
    'this is the description for the ticket test test test',
    'new',
    'low',
    'bug',
    [],
    'vieri adhitya1',
    new Date(2022, 3, 14, 12, 30, 0),
    []
  ),
  createData(
    'Project 2',
    'Ticket 6',
    'this is the description for the ticket test test test',
    'new',
    'low',
    'bug',
    [],
    'vieri adhitya1',
    new Date(2022, 3, 14, 12, 30, 0),
    []
  ),
];
