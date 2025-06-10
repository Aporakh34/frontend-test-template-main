import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "./RegCodePage.css";

type RegCodePageLocationState = { code?: string };

export default function RegCodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as RegCodePageLocationState | null;
  const code = state?.code || "";
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    if (!code) {
      toast.error("Код не найден для копирования");
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Код скопирован!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      toast.error("Не удалось скопировать код");
    }
  };

  if (!code) {
    toast.error("Код не найден. Зарегистрируйтесь заново.");
    return (
      <div style={{ maxWidth: 320, margin: "40px auto", color: "red" }}>
        Код не найден. Зарегистрируйтесь заново.
      </div>
    );
  }

  return (
    <div className="regcode-root">
      <div className="regcode-card">
        <h2>Ваш анонимный код</h2>
        <div className="regcode-code">{code}</div>
        <button type="button" onClick={handleCopy}>
          {copied ? "Скопировано!" : "Скопировать"}
        </button>
        <button
          type="button"
          onClick={() => {
            toast.info("Переход к авторизации");
            navigate("/auth");
          }}
        >
          Перейти к входу
        </button>
        <div className="regcode-info">
          Сохраните этот код — он нужен для входа!
        </div>
      </div>
    </div>
  );
}
