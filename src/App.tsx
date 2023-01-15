import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { atom, useAtom } from "jotai";
import questionsRaw from "./questions.json";
import { Question } from "./types";
import { Stack, Heading, Card, CardBody, Text, Button } from "@chakra-ui/react";

let questions: Question[] = questionsRaw;

const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

type CurrentQuestion = {
  question: Question;
  answeredIndex: number | null;
};

const currentQuestion = atom<CurrentQuestion>({
  question: getRandomQuestion(),
  answeredIndex: null,
});

const Answer = ({ answer, index }: { answer: string; index: number }) => {
  const [question, setQuestion] = useAtom(currentQuestion);
  const {
    answeredIndex,
    question: { correctAnswer },
  } = question;

  const handleClick = () => {
    setQuestion({
      ...question,
      answeredIndex: index,
    });
  };

  const getBgColor = () => {
    if (answeredIndex === null) return undefined;

    if (index === correctAnswer) return "lightgreen";
    if (answeredIndex === index && answeredIndex !== correctAnswer)
      return "red";

    return undefined;
  };

  return (
    <Card variant="outline" className="answer_card" onClick={handleClick}>
      <CardBody backgroundColor={getBgColor()}>
        <Stack direction="row" spacing={5}>
          <Text fontWeight="bold" size="lg">
            {index === 0 ? "A" : index === 1 ? "B" : index === 2 ? "C" : "D"})
          </Text>
          <Text size="lg">{question.question.options[index]}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default function App() {
  const [question, setQuestion] = useAtom(currentQuestion);
  const [finished, setFinished] = React.useState(false);

  const handleNextQuestion = () => {
    if (question.answeredIndex === question.question.correctAnswer) {
      questions = questions.filter(
        (q) => q.question !== question.question.question
      );
    }
    const nextQuestion = getRandomQuestion();
    if (!nextQuestion) {
      setFinished(true);
      return;
    }
    setQuestion({
      question: getRandomQuestion(),
      answeredIndex: null,
    });
  };

  return (
    <div className="App">
      <Stack spacing={12}>
        {finished ? (
          <Heading as="h1" size="4xl" textAlign="center">
            Finished!
          </Heading>
        ) : (
          <>
            <Heading as="h1" size="lg" textAlign="center">
              {question.question.question}
            </Heading>
            <Stack spacing={4}>
              {question.question.options.map((answer, index) => (
                <Answer answer={answer} index={index} />
              ))}
            </Stack>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={handleNextQuestion}
              disabled={question.answeredIndex === null}
            >
              Next Question
            </Button>
          </>
        )}
      </Stack>
    </div>
  );
}
