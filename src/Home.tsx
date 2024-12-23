import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { TimerList } from "./components/TimerList";
import { Toaster } from "sonner";
import { TimerModal } from "./components/TimerModal";
import { useTimerStore } from "./store/useTimerStore";
import { APP_NAME, ADD_TIMER } from "./utils/constants";

function Home() {
  const { addTimer } = useTimerStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        {/* Header with Timer title and Add Timer button */}
        <div className="flex items-center justify-between mb-6">
          {/* Timer Title */}
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{APP_NAME}</h1>
          </div>

          {/* Add Timer Button */}
          <button
            onClick={() => setIsModalOpen(true)} // Open the modal
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {ADD_TIMER}
          </button>
        </div>

        {/* Render the list of timers */}
        <TimerList />

        {/* Modal for Adding Timer */}
        <TimerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Close modal
          onSubmit={(timerData) => {
            addTimer(timerData); // Dispatch addTimer to Redux
            setIsModalOpen(false); // Ensure modal closes after submit
          }}
          mode="add"
        />
      </div>
    </div>
  );
}

export default Home;
