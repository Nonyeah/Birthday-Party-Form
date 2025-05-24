import { useState, useEffect, useRef } from "react";

interface FactData {
  id: string;
  question: string;
  answer: string;
}

const factData: Array<FactData> = [
  {
    id: "num0",
    question: "Where was Mama Ethel born?",
    answer:
      "The Nigeria eastern town of Umudim Nnewi, \
     but her childhood years were spent in Onitsha",
  },
  {
    id: "num1",
    question: "How many siblings does Mama Ethel have?",
    answer: "She has 11 brothers and sisters! How amazing is that?",
  },
  {
    id: "num2",
    question: "What was Mama Ethel's favourite subject in school?",
    answer: "English literature and English language were her top subjects.",
  },
  {
    id: "num3",
    question: "How many children and grand children does Mama Ethel have?",
    answer: "10! Can you believe it. But no great grand children yet!",
  },
  {
    id: "num4",
    question: "What's Mama Ethel's favourite food?",
    answer: "Mama Ethel loves a good Ofe Onugbu soup. \
    She's also quite partial to a spicy Jollof rice. Well she is Nigerian after all!",
  },
  {
    id: "num5",
    question: "Who is Ethel's favourite recording artist?",
    answer: "The late, great Michael Jackson of course!",
  },
];

export default function Facts() {
  const factBlocks = factData.map((fact) => {
    return (
      <CreateFacts key={fact.id} id={fact.id} question={fact.question} answer={fact.answer} />
    );
  });

  return <div className="fact-container">{factBlocks}</div>;
}

type HandleAnswer = () => void;

function CreateFacts({ id, question, answer }: FactData) {
  const [showanswer, setshowanser] = useState<boolean>(false);
  const answerRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (showanswer && answerRef.current) {
      const strArray: string[] = answer.split(" ");
      let timerId: any;
      let i: number = 100;
      for (let word of strArray) {
        timerId = setTimeout(() => {
          answerRef.current!.firstElementChild!.innerHTML += `${word} `;
        }, 2000 + (i += 200));
      }
      return () => clearTimeout(timerId);
    }
  }, [showanswer]);

  const handleAnswer: HandleAnswer = () => {
    setshowanser(!showanswer);
  };

  if (showanswer) {
    return (
      <div
        ref={answerRef}
        onClick={handleAnswer}
        className={`show-answer flip flip-colour `}
      >
        <p></p>
      </div>
    );
  } else {
    return (
      <div onClick={handleAnswer} className={`${id} show-answer`}>
        <p>{question}</p>
      </div>
    );
  }
}
