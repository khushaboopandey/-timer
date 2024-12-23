import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateTimerForm, TimerFormData } from "./validation";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(), // Mock the error function
  },
}));

describe("validateTimerForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return true for valid data", () => {
    const validData: TimerFormData = {
      title: "Valid Timer",
      description: "This is a valid timer",
      hours: 1,
      minutes: 30,
      seconds: 45,
    };

    expect(validateTimerForm(validData)).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should return false if title is empty", () => {
    const invalidData: TimerFormData = {
      title: "",
      description: "No title provided",
      hours: 1,
      minutes: 30,
      seconds: 45,
    };

    expect(validateTimerForm(invalidData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Title is required");
  });

  it("should return false if title exceeds 50 characters", () => {
    const invalidData: TimerFormData = {
      title: "A".repeat(51),
      description: "Title too long",
      hours: 1,
      minutes: 30,
      seconds: 45,
    };

    expect(validateTimerForm(invalidData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Title must be less than 50 characters"
    );
  });

  it("should return false if time values are negative", () => {
    const invalidData: TimerFormData = {
      title: "Negative Time",
      description: "Invalid time values",
      hours: -1,
      minutes: 30,
      seconds: 45,
    };

    expect(validateTimerForm(invalidData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Time values cannot be negative");
  });

  it("should return false if minutes or seconds exceed 59", () => {
    const invalidData: TimerFormData = {
      title: "Invalid Minutes/Seconds",
      description: "Invalid values for minutes and seconds",
      hours: 1,
      minutes: 60,
      seconds: 60,
    };

    expect(validateTimerForm(invalidData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Minutes and seconds must be between 0 and 59"
    );
  });

  it("should return false if total time is 0", () => {
    const invalidData: TimerFormData = {
      title: "Zero Time",
      description: "No time set",
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    expect(validateTimerForm(invalidData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Please set a time greater than 0"
    );
  });

  it("should return false if total time exceeds 24 hours", () => {
    const invalidData: TimerFormData = {
      title: "Exceeding Time",
      description: "More than 24 hours",
      hours: 25,
      minutes: 0,
      seconds: 0,
    };

    expect(validateTimerForm(invalidData)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Timer cannot exceed 24 hours");
  });
});
