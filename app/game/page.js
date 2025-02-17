'use client'
import { useEffect, useState } from "react";
import io from "socket.io-client";

// Replace with your deployed WebSocket server URL on Render/Railway
const SOCKET_SERVER_URL = "https://websocket-server-bdk7.onrender.com"; // Update with your actual WebSocket server URL

let socket;

export default function TicTacToe({ user }) {
  // `user` is the authenticated user info (from Google login)
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState(null);
  const [room, setRoom] = useState(null);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    socket = io(SOCKET_SERVER_URL);

    // Send join request with user info after connection
    socket.on("connect", () => {
      socket.emit("joinGame", user);
    });

    socket.on("waiting", (data) => {
      setStatus(data.message);
    });

    socket.on("gameStart", (data) => {
      setRoom(data.room);
      // Identify which player you are based on your socket id or user info
      setPlayer(socket.id === data.turn ? "X" : "O");
      setStatus("Game started! Your move: " + (socket.id === data.turn ? "Yes" : "No"));
    });

    socket.on("move", (data) => {
      setBoard(data.board);
      // Optionally update whose turn it is
      setStatus("Your move!");
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleClick = (index) => {
    if (!room || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = player;
    // For simplicity, switching players locally; in a real app, the server should validate moves
    const nextPlayer = player === "X" ? "O" : "X";

    setBoard(newBoard);
    setStatus("Waiting for opponent...");

    // Send move event with the room info so only that room gets updated
    socket.emit("move", { room, board: newBoard, nextPlayer });
  };

  return (
    <div>
      <h1>Multiplayer Tic Tac Toe</h1>
      <p>{status}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)" }}>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            style={{ width: 100, height: 100, fontSize: "2rem" }}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
