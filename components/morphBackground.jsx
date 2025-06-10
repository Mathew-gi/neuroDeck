import { useState, useEffect } from "react";
import clsx from "clsx";

export function MorphBackground({isWelcomeRead, setIsWelcomeRead}) {
  const [welcomeState, setWelcomeState] = useState({
    text: "Добро пожаловать!",
    state: true,
  });

  const [fade, setFade] = useState(true);

  const smoothText = () => {
    if (welcomeState.text == "Добро пожаловать!") {
      setFade(false);
      setTimeout(() => {
        setWelcomeState({
          text: "NeuroDeck — это умный тренажёр для запоминания, который позволяет создавать и использовать обучающие карточки. Ты можешь сгенерировать карточки автоматически с помощью нейросети: просто укажи тему и границы материала, а система подготовит карточки или текстовые вопросы с вариантами ответов. Готовые колоды можно использовать для тренировок по алгоритму интервального повторения, чтобы запоминать информацию надолго и без перегрузки. Создай колоду, добавь карточки, и начни учиться эффективно.",
          state: true,
        });
        setFade(true);
      }, 150);
    } else {
      setFade(false);
      setTimeout(() => {
        setWelcomeState({
          text: "",
          state: false,
        });
        setIsWelcomeRead(true);
      }, 150);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-1 overflow-hidden">
      <div
        style={{ fontSize: welcomeState.size }}
        className={clsx(
          !fade ? "opacity-0" : "opacity-100",
          welcomeState.text == "Добро пожаловать!" ? "text-[200%]" : "sm:text-[120%] text-[60%]",
          "absolute sm:w-7/20 w-6/10 z-2 text-center transition-opacity pointer-events-none"
        )}
      >
        {welcomeState.text}
      </div>
      <div className={clsx(isWelcomeRead ? "sm:w-[60%] w-[95%]" : "sm:w-9/20 w-9/10", "relative aspect-square transition-all duration-500")}>
        {["#00ffff", "#ff00ff", "#00ff99", "#ffff00", "#ff6600"].map(
          (color, i) => (
            <div
              style={{
                border: `2px solid ${color}`,
                // boxShadow: `0 0 10px ${color}`,
                animationDelay: `${-i * 2}s`,
                animationDuration: `${20 + 4 * i}s, ${8 + 1 * i}s`,
              }}
              className={clsx(isWelcomeRead ? "pointer-events-none" : "cursor-pointer", "absolute w-full h-full rounded-full animated-shape transition-all duration-500")}
              onClick={() => {
                smoothText();
              }}
              key={"morphCircle" + i}
            ></div>
          )
        )}
      </div>
    </div>
  );
}
