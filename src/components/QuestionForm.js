import React, { useState } from "react";

function QuestionForm({ onAddQuestion }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleAnswerChange(index, value) {
    const newAnswers = [...formData.answers];
    newAnswers[index] = value;
    setFormData({ ...formData, answers: newAnswers });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formData.prompt,
        answers: formData.answers,
        correctIndex: parseInt(formData.correctIndex),
      }),
    })
      .then((res) => res.json())
      .then((newQuestion) => onAddQuestion(newQuestion));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Question</h2>
      <input
        type="text"
        name="prompt"
        value={formData.prompt}
        onChange={handleChange}
        placeholder="Enter question prompt"
      />
      {formData.answers.map((answer, index) => (
        <input
          key={index}
          type="text"
          value={answer}
          onChange={(e) => handleAnswerChange(index, e.target.value)}
          placeholder={`Answer ${index + 1}`}
        />
      ))}
      <select
        name="correctIndex"
        value={formData.correctIndex}
        onChange={handleChange}
      >
        {formData.answers.map((_, index) => (
          <option key={index} value={index}>
            Correct Answer: {index + 1}
          </option>
        ))}
      </select>
      <button type="submit">Add Question</button>
    </form>
  );
}

export default QuestionForm;
