import { useState, useEffect } from "react";
import { checkApiConnection } from "../../utils/apiUtils";

const ConnectionStatus = () => {
  const [status, setStatus] = useState({
    checking: true,
    connected: false,
    message: "Checking connection...",
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await checkApiConnection();
        setStatus({
          checking: false,
          connected: result.connected,
          message: result.connected ? result.message : result.error,
        });
      } catch (error) {
        setStatus({
          checking: false,
          connected: false,
          message: "Failed to check connection",
        });
      }
    };

    checkConnection();
  }, []);

  return (
    <div
      className={`p-2 rounded-md ${
        status.checking
          ? "bg-yellow-100 text-yellow-800"
          : status.connected
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
      }`}
    >
      <div className="flex items-center">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${
            status.checking
              ? "bg-yellow-500"
              : status.connected
                ? "bg-green-500"
                : "bg-red-500"
          }`}
        ></div>
        <span>{status.message}</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;
