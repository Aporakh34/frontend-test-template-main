import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RegCodePage from "./RegCodePage";

describe("RegCodePage", () => {
  function renderWithCode(code?: string) {
    return render(
      <MemoryRouter
        initialEntries={[{ pathname: "/regcode", state: { code } }]}
      >
        <Routes>
          <Route path="/regcode" element={<RegCodePage />} />
          <Route path="/auth" element={<div>AUTH PAGE</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("показывает код и кнопку копирования", () => {
    renderWithCode("ABC123");
    expect(screen.getByText("Ваш анонимный код")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /скопировать/i })
    ).toBeInTheDocument();
  });

  it("копирует код в буфер обмена", async () => {
    const writeText = vi.fn();
    // @ts-ignore
    global.navigator.clipboard = { writeText };

    renderWithCode("XYZ789");
    fireEvent.click(screen.getByRole("button", { name: /скопировать/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("XYZ789");
      expect(screen.getByText(/Скопировано!/i)).toBeInTheDocument();
    });
  });

  it("переходит к авторизации по кнопке", async () => {
    renderWithCode("QWE456");
    fireEvent.click(screen.getByRole("button", { name: /перейти к входу/i }));
    expect(await screen.findByText("AUTH PAGE")).toBeInTheDocument();
  });

  it("показывает ошибку если кода нет", () => {
    renderWithCode(undefined);
    expect(screen.getByText(/Код не найден/i)).toBeInTheDocument();
  });
});
