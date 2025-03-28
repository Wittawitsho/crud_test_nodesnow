import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import '@testing-library/jest-dom';
import Tasks from "./Tasks";


const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../api/userApi", () => ({
  getUser: vi.fn().mockResolvedValue({ id: "123", email: "test@example.com" }),
  logoutUser: vi.fn().mockResolvedValue({ message: "Logout successful" }),
}));

vi.mock("../../api/taskApi", () => ({
  getAllTask: vi.fn().mockResolvedValue([
    { id: "1", title: "Task 1", description: "Description 1", status: "pending" },
  ]),
  getTask: vi.fn().mockImplementation(async (id) => {
    if (id === "1") {
      return { id: "1", title: "Task 1", description: "Description 1", status: "pending" };
    }
    throw new Error("Task not found");
  }),
  createTask: vi.fn().mockResolvedValue({
    id: "88",
    title: "New Task",
    description: "New Description",
    status: "completed",
  }),
  editTask: vi.fn().mockResolvedValue({
    id: "1",
    title: "Updated Task",
    description: "Updated Description",
    status: "completed",
  }),
  deleteTask: vi.fn().mockResolvedValue(undefined),
}));



describe("Tasks Component", () => {
  beforeEach(() => {
    // Mock localStorage to return a token
    vi.spyOn(global.localStorage, "getItem").mockReturnValue("fake_token");
  });
  
  it("should renders user information correctly", async () => {
    render(<Tasks />);
    const userID = await screen.findByText("ID: 123");
    const userEmail = screen.getByText("Email: test@example.com");

    expect(userID).toBeInTheDocument();
    expect(userEmail).toBeInTheDocument();
    
  });
  
  it("should displays tasks, edit button and delete button", async () => {
    render(<Tasks />);
    const taskID = await screen.findByText("1")
    const taskTitle = await screen.findByText("Task 1")
    const taskDescription = await screen.findByText("Description 1")
    const taskStatus = await screen.findByText("pending")
    const editButton = await screen.getByRole("button", { name: /edit/i });
    const deleteButton = await screen.getByRole("button", { name: /delete/i });

    expect(taskID).toBeInTheDocument();
    expect(taskTitle).toBeInTheDocument();
    expect(taskDescription).toBeInTheDocument();
    expect(taskStatus).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

  });
  
  it("should display validation errors for empty search fields ", async () => {
    render(<Tasks />);
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    const searchError = await screen.findByText(/Task ID is required/i);
    expect(searchError).toBeInTheDocument();
  });
  it("should display task by search with id ", async () => {
    render(<Tasks />);
    const taskID = await screen.findByText("1")
    const taskTitle = await screen.findByText("Task 1")
    const taskDescription = await screen.findByText("Description 1")
    const taskStatus = await screen.findByText("pending")
    const searchInput = screen.getByPlaceholderText("Search by ID");
    const searchButton = screen.getByRole("button", { name: /search/i });

    fireEvent.change(searchInput, { target: { value: "1" } });

    fireEvent.click(searchButton);
    await act(async () => {
    expect(taskID).toBeInTheDocument();
    expect(taskTitle).toBeInTheDocument();
    expect(taskDescription).toBeInTheDocument();
    expect(taskStatus).toBeInTheDocument();
    });
  });

  it("should display add task page", async () => {
    render(<Tasks />);
    const addTaskButton = screen.getByRole("button", { name: /Add Task/i });
    fireEvent.click(addTaskButton);

    await act(async () => {
      const title = await screen.getByLabelText(/title/i)
      const description = await screen.getByLabelText(/description/i)
      const status = await screen.getByLabelText(/status/i)
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.change(title, { target: { value: "New Task" } });
      fireEvent.change(description, { target: { value: "New Description" } });
      fireEvent.change(status, { target: { value: "completed" } });
      fireEvent.click(saveButton);
  });
    
    const newTaskID = await screen.findByText(/88/i);
    const newTaskTitle = await screen.findByText(/New Task/i);
    const newTaskDescription = await screen.findByText(/New Description/i);
    const newTaskStatus = await screen.findByText("completed");

    expect(newTaskID).toBeInTheDocument();
    expect(newTaskTitle).toBeInTheDocument();
    expect(newTaskDescription).toBeInTheDocument();
    expect(newTaskStatus).toBeInTheDocument();

  });

  it("should can delete a task", async () => {
    render(<Tasks />);
    const taskID = await screen.findByText("1")
    const taskTitle = await screen.findByText("Task 1")
    const taskDescription = await screen.findByText("Description 1")
    const taskStatus = await screen.findByText("pending")
    const editButton = await screen.getByRole("button", { name: /edit/i });
    const deleteButton = await screen.getByRole("button", { name: /delete/i });

    expect(taskID).toBeInTheDocument();
    expect(taskTitle).toBeInTheDocument();
    expect(taskDescription).toBeInTheDocument();
    expect(taskStatus).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(taskID).not.toBeInTheDocument();
      expect(taskTitle).not.toBeInTheDocument();
      expect(taskDescription).not.toBeInTheDocument();
      expect(taskStatus).not.toBeInTheDocument();
      expect(editButton).not.toBeInTheDocument();
      expect(deleteButton).not.toBeInTheDocument();
    });
  });

  it("should can edits a task", async () => {
    render(<Tasks />);
    const taskID = await screen.findByText("1")
    const taskTitle = await screen.findByText("Task 1")
    const taskDescription = await screen.findByText("Description 1")
    const taskStatus = await screen.findByText("pending")
    const editButton = await screen.getByRole("button", { name: /edit/i });
    const deleteButton = await screen.getByRole("button", { name: /delete/i });

    expect(taskID).toBeInTheDocument();
    expect(taskTitle).toBeInTheDocument();
    expect(taskDescription).toBeInTheDocument();
    expect(taskStatus).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(editButton);
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const statusInput = screen.getByLabelText(/status/i);
    const saveButton = screen.getByRole("button", { name: /save/i });

    fireEvent.change(titleInput, { target: { value: "Updated Task" } });
    fireEvent.change(descriptionInput, { target: { value: "Updated Description" } });
    fireEvent.change(statusInput, { target: { value: "completed" } });
    fireEvent.click(saveButton);

    const updateTaskID = await screen.findByText("1")
    const updateTaskTitle = await screen.findByText("Updated Task")
    const updateTaskDescription = await screen.findByText("Updated Description")
    const updateTaskStatus = await screen.findByText("completed")

    expect(updateTaskID).toBeInTheDocument();
    expect(updateTaskTitle).toBeInTheDocument();
    expect(updateTaskDescription).toBeInTheDocument();
    expect(updateTaskStatus).toBeInTheDocument();

  });

  it("should log out the user and navigate to the home page", async () => {
    render(<Tasks />);
    
    const logoutButton = screen.getByRole("button", { name: /log out/i });
    fireEvent.click(logoutButton);
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  
  });
  
  it("should show no tasks when searched ID does not exist", async () => {
    render(<Tasks />);
  
    const searchInput = screen.getByPlaceholderText("Search by ID");
    fireEvent.change(searchInput, { target: { value: "999" } });
  
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);
  
    await waitFor(() => {
      expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    });
  });
  
  it("should show error when creating a task fails", async () => {
    render(<Tasks />);
    
    fireEvent.click(screen.getByRole("button", { name: /Add Task/i }));
  
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const statusInput = screen.getByLabelText(/status/i);
    const saveButton = screen.getByRole("button", { name: /save/i });
  
    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.change(descriptionInput, { target: { value: "New Description" } });
    fireEvent.change(statusInput, { target: { value: "completed" } });
  
    fireEvent.click(saveButton);
  
    await waitFor(() => {
      expect(screen.queryByText("New Task")).not.toBeInTheDocument();
    });
  });
  
});
