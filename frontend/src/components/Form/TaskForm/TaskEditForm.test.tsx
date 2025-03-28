import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import TaskEditForm from './TaskEditForm';

const mockOnSave = vi.fn();
const mockOnCancel = vi.fn();

describe('TaskEditForm', () => {
  beforeEach(() => {
    render(
      <TaskEditForm
        taskId="1"
        title="Test Task"
        description="Test description"
        status="pending"
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
  });

  it('should renders the form with initial values', () => {
    const title = screen.getByLabelText(/title/i);
    const description = screen.getByLabelText(/description/i);
    const status = screen.getByLabelText(/status/i);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(title).toHaveValue('Test Task');
    expect(description).toHaveValue('Test description');
    expect(status).toHaveValue('pending');
    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('should calls onCancel when cancel button is clicked', () => {
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows validation error when fields are empty and form is submitted', async () => {
    const title = screen.getByLabelText(/title/i);
    const description = screen.getByLabelText(/description/i);
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.change(title, { target: { value: '' } });
    fireEvent.change(description, { target: { value: '' } });

    
    fireEvent.click(saveButton);

    const titleError = await screen.findByText(/Title is required/i);
    const descriptionError = await screen.findByText(/Description is required/i);

    expect(titleError).toBeInTheDocument();
    expect(descriptionError).toBeInTheDocument();
  });

  it('calls onSave when form is valid and submit is clicked', async () => {
    const title = screen.getByLabelText(/title/i);
    const description = screen.getByLabelText(/description/i);
    const status = screen.getByLabelText(/status/i);
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.change(title, { target: { value: 'Updated Task' } });
    fireEvent.change(description, { target: { value: 'Updated description' } });
    fireEvent.change(status, { target: { value: 'in_progress' } });

    // Submit the form
    fireEvent.click(saveButton);

    // Wait for the onSave function to be called with correct arguments
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        '1',
        'Updated Task', 
        'Updated description',
        'in_progress' 
      );
    });
  });

});
