import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (!options) {
      // GET /questions
      return Promise.resolve({
        json: () => Promise.resolve([
          {
            id: 1,
            prompt: "What is 2 + 2?",
            answers: ["3", "4", "5", "22"],
            correctIndex: 1,
          },
        ]),
      });
    }

    if (options.method === "POST") {
      // POST /questions
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            id: 2,
            prompt: "What is 3 + 3?",
            answers: ["5", "6", "7", "33"],
            correctIndex: 1,
          }),
      });
    }

    if (options.method === "DELETE") {
      // DELETE /questions/:id
      return Promise.resolve({});
    }

    if (options.method === "PATCH") {
      // PATCH /questions/:id
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            id: 1,
            correctIndex: 2,
          }),
      });
    }
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("displays question prompts after fetching", async () => {
  render(<App />);
  const question = await screen.findByText("What is 2 + 2?");
  expect(question).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("New Question"));

  fireEvent.change(screen.getByLabelText(/prompt/i), {
    target: { value: "What is 3 + 3?" },
  });

  fireEvent.change(screen.getByLabelText(/answer 1/i), {
    target: { value: "5" },
  });
  fireEvent.change(screen.getByLabelText(/answer 2/i), {
    target: { value: "6" },
  });
  fireEvent.change(screen.getByLabelText(/answer 3/i), {
    target: { value: "7" },
  });
  fireEvent.change(screen.getByLabelText(/answer 4/i), {
    target: { value: "33" },
  });

  fireEvent.change(screen.getByLabelText(/correct answer/i), {
    target: { value: "1" },
  });

  fireEvent.click(screen.getByText("Submit Question"));

  const newQuestion = await screen.findByText("What is 3 + 3?");
  expect(newQuestion).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);
  const question = await screen.findByText("What is 2 + 2?");
  const deleteButton = screen.getByText("Delete");
  fireEvent.click(deleteButton);
  await waitFor(() =>
    expect(screen.queryByText("What is 2 + 2?")).not.toBeInTheDocument()
  );
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);
  const select = await screen.findByLabelText("Correct Answer:");
  fireEvent.change(select, { target: { value: "2" } });
  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
    "http://localhost:4000/questions/1",
    expect.objectContaining({
      method: "PATCH",
      body: JSON.stringify({ correctIndex: 2 }),
    })
  ));
});
