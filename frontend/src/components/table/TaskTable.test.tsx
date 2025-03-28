import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TaskTable from './TaskTable';
import { StatusType } from '../../pages/Tasks/Tasks';
import '@testing-library/jest-dom';

// Mock props
const mockOnDelete = vi.fn();
const mockOnEditSave = vi.fn();

const mockTasks = [
  { id: '1', title: 'Task 1', description: 'Description 1', status: 'pending' as StatusType },
  { id: '2', title: 'Task 2', description: 'Description 2', status: 'completed' as StatusType },
];

describe('TaskTable', () => {
  beforeEach(() => {
    render(<TaskTable tasks={mockTasks} onDelete={mockOnDelete} onEditSave={mockOnEditSave} />);
  });

  it('should renders task table with tasks', async () => {
    const taskID1 = await screen.findByText("1")
    const taskTitle1 = await screen.findByText("Task 1")
    const taskDescription1 = await screen.findByText("Description 1")
    const taskStatus1 = await screen.findByText("pending")
    const taskID2 = await screen.findByText("2")
    const taskTitle2 = await screen.findByText("Task 2")
    const taskDescription2 = await screen.findByText("Description 2")
    const taskStatus2 = await screen.findByText("completed")
    const editButton = screen.getAllByRole("button", { name: /edit/i });
    const deleteButton = screen.getAllByRole("button", { name: /delete/i });
    expect(editButton).toHaveLength(2);
    expect(deleteButton).toHaveLength(2);
    expect(taskID1).toBeInTheDocument();
    expect(taskTitle1).toBeInTheDocument();
    expect(taskDescription1).toBeInTheDocument();
    expect(taskStatus1).toBeInTheDocument();
    expect(taskID2).toBeInTheDocument();
    expect(taskTitle2).toBeInTheDocument();
    expect(taskDescription2).toBeInTheDocument();
    expect(taskStatus2).toBeInTheDocument();
    expect(editButton[0]).toBeInTheDocument();
    expect(editButton[1]).toBeInTheDocument();
    expect(deleteButton[0]).toBeInTheDocument();
    expect(deleteButton[1]).toBeInTheDocument();

  });

  it('should remove task when delete is clicked', () => {
    const deleteButton = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton[0]);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
    
  });

  it('should opens edit form when edit button is clicked', async () => {
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    const title = screen.getByLabelText(/title/i);
    const description = screen.getByLabelText(/description/i);
    const status = screen.getByLabelText(/status/i);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(title).toHaveValue('Task 1');
    expect(description).toHaveValue('Description 1');
    expect(status).toHaveValue('pending');
    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  
  });

  it('should calls onEditSave when save button is clicked in edit form', async () => {
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    const title = screen.getByLabelText(/title/i);
    const description = screen.getByLabelText(/description/i);
    const status = screen.getByLabelText(/status/i);
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.change(title, { target: { value: 'Updated Task' } });
    fireEvent.change(description, { target: { value: 'Updated Description' } });
    fireEvent.change(status, { target: { value: 'in_progress' } });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockOnEditSave).toHaveBeenCalledWith(
          '1',
          'Updated Task',
          'Updated Description',
          'in_progress'
      );
    });
  });

  it('should closes edit form when cancel button is clicked', async () => {
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const title = screen.getByLabelText(/title/i);
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(title).not.toBeInTheDocument();
    });
  });
});
