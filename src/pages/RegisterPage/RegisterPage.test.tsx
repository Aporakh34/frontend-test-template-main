import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegisterPage from "./RegisterPage";
import { ToastContainer } from "react-toastify";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("RegisterPage", () => {
  it("показывает ошибку при невалидном email", async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
        <ToastContainer />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "bad" },
    });
    fireEvent.submit(screen.getByTestId("register-form"));
    expect(await screen.findByText(/корректный email/i)).toBeInTheDocument();
  });

  it("отправляет запрос при валидном email", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as unknown as Response)
    );

    render(
      <MemoryRouter>
        <RegisterPage />
        <ToastContainer />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /зарегистрироваться/i })
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/v1/user/register/email",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  it("показывает ошибку при ошибке сети", async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error("Network error"))
    ) as unknown as typeof fetch;

    render(
      <MemoryRouter>
        <RegisterPage />
        <ToastContainer />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /зарегистрироваться/i })
    );
    // Toast появляется с role="alert"
    expect(await screen.findByRole("alert")).toHaveTextContent(/ошибка сети/i);
  });
});
