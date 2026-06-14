import React from 'react';
import { TasksView } from '../components/tasks/TasksView';
import { useTasksScreen } from '../hooks/useTasksScreen';

export const TasksScreen: React.FC = () => {
  const screenState = useTasksScreen();

  return <TasksView {...screenState} />;
};
