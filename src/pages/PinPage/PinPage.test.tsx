import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const navigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return { ...actual, useNavigate: () => navigate };
});

import PinPage from "./PinPage";

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

function renderWithEmail(email = "test@example.com", initialTimer = 60) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/pin", state: { email } }]}>
      <Routes>
        <Route path="/pin" element={<PinPage initialTimer={initialTimer} />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("PinPage", () => {
  it("показывает ошибку при невалидном PIN", async () => {
    renderWithEmail();
    fireEvent.change(screen.getByPlaceholderText(/pin/i), {
      target: { value: "123" },
    });
    fireEvent.submit(screen.getByTestId("pin-form"));
    expect(await screen.findByText(/6-значный PIN/i)).toBeInTheDocument();
  });

  it("показывает ошибку если email не передан", async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/pin", state: {} }]}>
        <Routes>
          <Route path="/pin" element={<PinPage />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/pin/i), {
      target: { value: "123456" },
    });
    fireEvent.submit(screen.getByTestId("pin-form"));
    expect(await screen.findByText(/email не найден/i)).toBeInTheDocument();
  });

  it("отправляет запрос и сохраняет сессию при валидном PIN", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: { session: "abc" } }),
      } as unknown as Response)
    );

    renderWithEmail();
    fireEvent.change(screen.getByPlaceholderText(/pin/i), {
      target: { value: "123456" },
    });
    fireEvent.submit(screen.getByTestId("pin-form"));

    await waitFor(() => {
      expect(localStorage.getItem("session")).toBe("abc");
      expect(navigate).toHaveBeenCalledWith("/profile");
    });
  });

  it("показывает ошибку при ошибке сети", async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error("Network error"))
    ) as unknown as typeof fetch;

    renderWithEmail();
    fireEvent.change(screen.getByPlaceholderText(/pin/i), {
      target: { value: "123456" },
    });
    fireEvent.submit(screen.getByTestId("pin-form"));

    expect(await screen.findByText(/ошибка сети/i)).toBeInTheDocument();
  });

  it("отправляет повторно PIN и сбрасывает таймер", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as unknown as Response)
    );

    renderWithEmail("test@example.com", 0);
    const resendBtn = await screen.findByRole("button", { name: /повторно/i });
    expect(resendBtn).not.toBeDisabled();

    fireEvent.click(resendBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/v1/user/register/email",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });
});
