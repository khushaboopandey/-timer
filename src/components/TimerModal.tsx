import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ModalButtons } from "./ModalButtons";
import { toast } from "sonner";
import {
  SAVE_CHANGES,
  ADD_TIMER,
  DESC,
  TITLE,
  TITLE_IS_REQUIRED,
  DURATION_MUST_BE_GREATER_THAN_ZERO,
  ADD_NEW_TIMER,
  EDIT_TIMER,
} from "../utils/constants";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (timerData: TimerData) => void;
  mode: "add" | "edit";
  timer?: TimerData;
}

interface TimerData {
  id: string;
  title: string;
  description?: string;
  duration: number;
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  timer,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (mode === "add") {
        setTitle("");
        setDescription("");
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      } else if (mode === "edit" && timer) {
        setTitle(timer.title);
        setDescription(timer.description || "");
        setHours(Math.floor(timer.duration / 3600));
        setMinutes(Math.floor((timer.duration % 3600) / 60));
        setSeconds(timer.duration % 60);
      }
    }
  }, [isOpen, mode, timer]);

  const getTimersFromLocalStorage = (): TimerData[] => {
    const savedTimers = localStorage.getItem("timers");
    return savedTimers ? JSON.parse(savedTimers) : [];
  };

  const saveTimerToLocalStorage = (newTimer: TimerData) => {
    const existingTimers = getTimersFromLocalStorage();
    const updatedTimers = [...existingTimers, newTimer];
    localStorage.setItem("timers", JSON.stringify(updatedTimers));
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (!title.trim()) {
      toast.error(TITLE_IS_REQUIRED);
      return;
    }
    if (totalSeconds <= 0) {
      toast.error(DURATION_MUST_BE_GREATER_THAN_ZERO);
      return;
    }

    const newTimer: TimerData = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      duration: totalSeconds,
    };

    saveTimerToLocalStorage(newTimer);

    onSubmit(newTimer);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {mode === "edit" ? EDIT_TIMER : ADD_NEW_TIMER}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {TITLE} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter timer title"
            />
          </div>

          {/* Description Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {DESC}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter a brief description (optional)"
            />
          </div>

          {/* Duration Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Hours"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Minutes"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Seconds"
                />
              </div>
            </div>
          </div>

          {/* Modal Buttons */}
          <ModalButtons
            onCancel={onClose}
            submitText={mode === "edit" ? SAVE_CHANGES : ADD_TIMER}
          />
        </form>
      </div>
    </div>
  );
};
