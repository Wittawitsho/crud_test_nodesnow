import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import '@testing-library/jest-dom';
import TaskForm from "./TaskForm";

describe("TaskForm", () => {
  it("should render TaskForm with required fields", () => {
    render(<TaskForm onSave={vi.fn()} onCancel={vi.fn()} />);
    const title = screen.getByLabelText(/title/i);
    const description = screen.getByLabelText(/description/i);
    const status = screen.getByLabelText(/status/i);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(status).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it("should call onSave when form is valid and submitted", async () => {
    const mockOnSave = vi.fn();
    render(<TaskForm onSave={mockOnSave} onCancel={vi.fn()} />);
    const title = screen.getByLabelText(/title/i)
    const description = screen.getByLabelText(/description/i)
    const status = screen.getByLabelText(/status/i)
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.change(title, { target: { value: "New Task" } });
    fireEvent.change(description, { target: { value: "This is a description." } });
    fireEvent.change(status, { target: { value: "pending" } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith("New Task", "This is a description.", "pending");
    });
  });

  it("should show validation error if required fields are empty", async () => {
    const mockOnSave = vi.fn();
    render(<TaskForm onSave={mockOnSave} onCancel={vi.fn()} />);
    const saveButton = screen.getByRole("button", { name: /save/i });
    
    fireEvent.click(saveButton);
    
    const titleError = await screen.findByText(/Title is required/i);
    const descriptionError = await screen.findByText(/Description is required/i);

    expect(titleError).toBeInTheDocument();
    expect(descriptionError).toBeInTheDocument();
  });

  it("should call onCancel when Cancel button is clicked", () => {
    const mockOnCancel = vi.fn();
    render(<TaskForm onSave={vi.fn()} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

});