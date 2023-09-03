export type CategoryType = 'managers' | 'games' | 'notifications';

interface Category {
  name: CategoryType;
  title: string;
}

export const categoriesList: Category[] = [
  {
    name: 'managers',
    title: 'Managers',
  },
  {
    name: 'games',
    title: 'Games',
  },
  {
    name: 'notifications',
    title: 'Notifications',
  },
];
