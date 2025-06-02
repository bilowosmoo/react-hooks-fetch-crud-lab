import React, { useState, useEffect } from "react";
import QuestionList from "./QuestionList";

import App from "../../Appp"
function App() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  function handleAddQuestion(newQuestion) {
    setQuestions([...questions, newQuestion]);
  }

  function handleDeleteQuestion(deletedId) {
    const updated = questions.filter(q => q.id !== deletedId);
    setQuestions(updated);
  }

  function handleUpdateQuestion(updatedQuestion) {
    const updatedQuestions = questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setQuestions(updatedQuestions);
  }

  return (
    <div>
      <h1>Quiz Admin Panel</h1>
      <QuestionList
        questions={questions}
        onDelete={handleDeleteQuestion}
        onUpdate={handleUpdateQuestion}
      />
    </div>
  );
}

export default App;
