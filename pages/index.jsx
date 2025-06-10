import { MorphBackground } from "../components/morphBackground";
import { ArrowRight } from "../images/arrowRight";
import BouncingDots from "../components/bouncingDots";
import { ArrowRotate } from "../images/arrowRotate";
import clsx from "clsx";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function HomePage() {
  const [isWelcomeRead, setIsWelcomeRead] = useState(false);
  const [topicPrompt, setTopicPrompt] = useState("");
  const [cards, setCards] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [choosenAnswer, setChoosenAnswer] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const topicRef = useRef(null);
  const [previousTopic, setPreviousTopic] = useState("");

  const generateCards = async (topic) => {
    const res = await axios.post("http://localhost:3000/api/generate", {
      topic,
    });
    setIsGenerating(false);
    setCards(res.data);
  };

  useEffect(() => {
    console.log(previousTopic == topicRef.current.value);
  }, [previousTopic]);

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <MorphBackground
        isWelcomeRead={isWelcomeRead}
        setIsWelcomeRead={setIsWelcomeRead}
      ></MorphBackground>
      <div
        className={clsx(
          isWelcomeRead ? "bottom-[5%]" : "-bottom-2/5",
          "flex justify-center items-center sm:w-2/5 w-9/10 aspect-[12/1] absolute left-1/2 -translate-x-1/2 z-3 rounded-full bg-white shadow-[0_0_10px_#B7B7B8] transition-all duration-500"
        )}
      >
        <input
          className="w-[89%] h-full focus:outline-none mr-[2%]"
          type="text"
          placeholder="Введите тему или вопрос..."
          ref={topicRef}
          onChange={(e) => setTopicPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key == "Enter" &&
              !(
                previousTopic == topicRef.current?.value &&
                topicRef.current?.value != ""
              )
            ) {
              setPreviousTopic(topicPrompt);
              setCards([]);
              setCurrentQuestion(1);
              generateCards(topicPrompt);
              setIsGenerating(true);
            } else if (
              e.key == "Enter" &&
              previousTopic == topicRef.current?.value &&
              topicRef.current?.value != ""
            ) {
              setCards([]);
              setCurrentQuestion(1);
              generateCards(previousTopic);
              setIsGenerating(true);
            }
          }}
        />
        <ArrowRight
          onClick={() => {
            setPreviousTopic(topicPrompt);
            generateCards(topicPrompt);
            setIsGenerating(true);
          }}
          className={clsx(
            previousTopic == topicRef.current?.value &&
              topicRef.current?.value != ""
              ? "opacity-0 pointer-events-none absolute right-[3%]"
              : "opacity-100",
            "w-[4%] aspect-square cursor-pointer transition-all duration-150"
          )}
          fill="#909091"
        ></ArrowRight>
        <ArrowRotate
          onClick={() => {
            setCards([]);
            generateCards(previousTopic);
            setIsGenerating(true);
          }}
          className={clsx(
            previousTopic == topicRef.current?.value &&
              topicRef.current?.value != ""
              ? "opacity-100"
              : "opacity-0 pointer-events-none absolute right-[3%]",
            "w-[3%] aspect-square cursor-pointer transition-opacity"
          )}
          fill="#909091"
        ></ArrowRotate>
      </div>

      <div
        className={clsx(
          cards.length == 0 && isWelcomeRead && !isGenerating
            ? "opacity-100"
            : "opacity-0 pointer-events-none absolute",
          "transition-opacity duration-500 z-3 w-2/5 text-center sm:text-[120%] text-[70%]"
        )}
      >
        Теперь просто введите тему, и я создам для вас 5 обучающих карточек.
        Хотите повторить школьный предмет, подготовиться к экзамену или изучить
        что-то новое? Просто напишите, например:
        <br />
        "Гравитация", "Глаголы в английском", "Основы HTML" — и поехали!
      </div>

      <div
        className={clsx(
          isGenerating
            ? "opacity-100"
            : "opacity-0 pointer-events-none absolute",
          "w-1/2 h-1/2 transition-opacity duration-500"
        )}
      >
        <BouncingDots></BouncingDots>
      </div>

      <div
        className={clsx(
          currentQuestion - 1 == cards.length && cards.length != 0 && !isGenerating
            ? "opacity-100"
            : "opacity-0 pointer-events-none absolute",
          "transition-opacity duration-500 z-3 sm:w-2/5 w-[70%] text-center sm:text-[120%] text-[80%]"
        )}
      >
        <div className="sm:text-[140%] text-[100%]">Вы просмотрели все карточки!</div>
        <br />
        Хотите сгенерировать новые по этой же теме или выбрать другую?
        <br />
        Просто введите новую тему или нажмите «Сгенерировать заново» справа от
        запроса, чтобы получить другие варианты.
      </div>

      {cards.length != 0 &&
        cards.map((item, index) => {
          console.log(index, currentQuestion, index - currentQuestion + 1);
          return (
            <div
              style={{
                left: `${(index - currentQuestion + 1) * 100 + 50}%`,
                transform: "translateX(-50%)",
              }}
              className="absolute w-4/5 flex gap-10 flex-col z-3 transition-all duration-600"
              key={"card" + index}
            >
              <div className="flex justify-center items-center text-center sm:text-[200%] text-[100%]">
                {item.question}
              </div>
              <div className="flex flex-wrap gap-[5%] gap-y-3">
                {item.options.map((option, index) => {
                  console.log(choosenAnswer == item.answer);
                  return (
                    <div
                      key={"answer" + index}
                      className={clsx(
                        choosenAnswer != null &&
                          choosenAnswer == item.answer &&
                          choosenAnswer == option
                          ? "bg-green-300"
                          : choosenAnswer != null &&
                            choosenAnswer != item.answer &&
                            choosenAnswer == option
                          ? "bg-red-300"
                          : "bg-white",
                        "flex justify-center items-center text-center w-[47.5%] rounded-full shadow-md p-[1%] pt-[3%] pb-[3%] hover:scale-110 transition-all duration-150 cursor-pointer break-words"
                      )}
                      onClick={() => {
                        setChoosenAnswer(option);
                      }}
                    >
                      <p className="w-full">{option}</p>
                      
                    </div>
                  );
                })}
              </div>

              <div
                className={clsx(
                  choosenAnswer != null
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none",
                  "flex justify-center items-center transition-opacity"
                )}
              >
                <ArrowRight
                  onClick={() => {
                    setChoosenAnswer(null);
                    setCurrentQuestion((p) => p + 1);
                  }}
                  className="sm:w-[3%] w-[8%] aspect-square cursor-pointer"
                  fill="#909091"
                ></ArrowRight>
              </div>
            </div>
          );
        })}
    </div>
  );
}
